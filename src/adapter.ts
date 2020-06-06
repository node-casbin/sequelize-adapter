// Copyright 2018 The Casbin Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { Adapter, Helper, Model } from 'casbin';
import { Sequelize, SequelizeOptions } from 'sequelize-typescript';
import { CasbinRule } from './casbinRule';

/**
 * SequelizeAdapter represents the Sequelize adapter for policy storage.
 */
export class SequelizeAdapter implements Adapter {
  private option: SequelizeOptions;
  private sequelize: Sequelize;

  constructor(option: SequelizeOptions) {
    this.option = option;
  }

  /**
   * newAdapter is the constructor.
   * @param option sequelize connection option
   */
  public static async newAdapter(
    option: SequelizeOptions
  ): Promise<SequelizeAdapter> {
    const a = new SequelizeAdapter(option);
    await a.open();

    return a;
  }

  private async open(): Promise<void> {
    this.sequelize = new Sequelize(this.option);
    await this.sequelize.authenticate();
    this.sequelize.addModels([CasbinRule]);
    await this.createTable();
  }

  public async close(): Promise<void> {
    await this.sequelize.close();
  }

  private async createTable(): Promise<void> {
    await this.sequelize.sync();
  }

  private loadPolicyLine(line: CasbinRule, model: Model): void {
    const result =
      line.ptype +
      ', ' +
      [line.v0, line.v1, line.v2, line.v3, line.v4, line.v5]
        .filter((n) => n)
        .join(', ');
    Helper.loadPolicyLine(result, model);
  }

  /**
   * loadPolicy loads all policy rules from the storage.
   */
  public async loadPolicy(model: Model): Promise<void> {
    const lines = await this.sequelize.getRepository(CasbinRule).findAll();

    for (const line of lines) {
      this.loadPolicyLine(line, model);
    }
  }

  private savePolicyLine(ptype: string, rule: string[]): CasbinRule {
    const line = new CasbinRule();

    line.ptype = ptype;
    if (rule.length > 0) {
      line.v0 = rule[0];
    }
    if (rule.length > 1) {
      line.v1 = rule[1];
    }
    if (rule.length > 2) {
      line.v2 = rule[2];
    }
    if (rule.length > 3) {
      line.v3 = rule[3];
    }
    if (rule.length > 4) {
      line.v4 = rule[4];
    }
    if (rule.length > 5) {
      line.v5 = rule[5];
    }

    return line;
  }

  /**
   * savePolicy saves all policy rules to the storage.
   */
  public async savePolicy(model: Model): Promise<boolean> {
    await this.sequelize.transaction(async (tx) => {
      // truncate casbin table
      await this.sequelize
        .getRepository(CasbinRule)
        .destroy({ where: {}, truncate: true, transaction: tx });

      const lines: CasbinRule[] = [];

      let astMap = model.model.get('p')!;
      for (const [ptype, ast] of astMap) {
        for (const rule of ast.policy) {
          const line = this.savePolicyLine(ptype, rule);
          lines.push(line);
        }
      }

      astMap = model.model.get('g')!;
      for (const [ptype, ast] of astMap) {
        for (const rule of ast.policy) {
          const line = this.savePolicyLine(ptype, rule);
          lines.push(line);
        }
      }

      await CasbinRule.bulkCreate(
        lines.map((l) => l.get({ plain: true })),
        { transaction: tx }
      );
    });
    return true;
  }

  /**
   * addPolicy adds a policy rule to the storage.
   */
  public async addPolicy(
    sec: string,
    ptype: string,
    rule: string[]
  ): Promise<void> {
    const line = this.savePolicyLine(ptype, rule);
    await line.save();
  }

  /**
   * addPolicies adds a policyList rules to the storage.
   */
  public async addPolicies(
    sec: string,
    ptype: string,
    rules: string[][]
  ): Promise<void> {
    const lines: CasbinRule[] = [];
    for (const rule of rules) {
      const line = this.savePolicyLine(ptype, rule);
      lines.push(line);
    }
    await this.sequelize.transaction(async (tx) => {
      await CasbinRule.bulkCreate(
        lines.map((l) => l.get({ plain: true })),
        { transaction: tx }
      );
    });
  }

  /**
   * removePolicies removes a policyList rule from the storage.
   */
  public async removePolicy(
    sec: string,
    ptype: string,
    rule: string[]
  ): Promise<void> {
    const line = this.savePolicyLine(ptype, rule);
    const where = {};

    Object.keys(line.get({ plain: true }))
      .filter((key) => key !== 'id')
      .forEach((key) => {
        // @ts-ignore
        where[key] = line[key];
      });

    await this.sequelize.getRepository(CasbinRule).destroy({ where });
  }

  /**
   * removePolicies removes a policyList rule from the storage.
   */
  public async removePolicies(
    sec: string,
    ptype: string,
    rules: string[][]
  ): Promise<void> {
    await this.sequelize.transaction(async (tx) => {
      for (const rule of rules) {
        const line = this.savePolicyLine(ptype, rule);
        const where = {};

        Object.keys(line.get({ plain: true }))
          .filter((key) => key !== 'id')
          .forEach((key) => {
            // @ts-ignore
            where[key] = line[key];
          });

        await this.sequelize
          .getRepository(CasbinRule)
          .destroy({ where, transaction: tx });
      }
    });
  }

  /**
   * removeFilteredPolicy removes policy rules that match the filter from the storage.
   */
  public async removeFilteredPolicy(
    sec: string,
    ptype: string,
    fieldIndex: number,
    ...fieldValues: string[]
  ): Promise<void> {
    const line = new CasbinRule();

    const idx = fieldIndex + fieldValues.length;
    if (fieldIndex <= 0 && 0 < idx) {
      line.v0 = fieldValues[0 - fieldIndex];
    }
    if (fieldIndex <= 1 && 1 < idx) {
      line.v1 = fieldValues[1 - fieldIndex];
    }
    if (fieldIndex <= 2 && 2 < idx) {
      line.v2 = fieldValues[2 - fieldIndex];
    }
    if (fieldIndex <= 3 && 3 < idx) {
      line.v3 = fieldValues[3 - fieldIndex];
    }
    if (fieldIndex <= 4 && 4 < idx) {
      line.v4 = fieldValues[4 - fieldIndex];
    }
    if (fieldIndex <= 5 && 5 < idx) {
      line.v5 = fieldValues[5 - fieldIndex];
    }

    const where = {};

    Object.keys(line.get({ plain: true }))
      .filter((key) => key !== 'id')
      .forEach((key) => {
        // @ts-ignore
        where[key] = line[key];
      });

    await this.sequelize.getRepository(CasbinRule).destroy({
      where,
    });
  }
}
