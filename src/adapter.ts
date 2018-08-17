// Copyright 2018 The casbin Authors. All Rights Reserved.
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
import * as Sequelize from 'sequelize';
import { CasbinRuleAttributes, CasbinRuleInstance, CasbinRule } from './casbinRule';

export class SequelizeAdapter implements Adapter {
  public sequelize: Sequelize.Sequelize;
  public casbinRule: Sequelize.Model<CasbinRuleInstance, CasbinRuleAttributes>;

  // NewAdapter is the constructor for Adapter.
  // dbSpecified is an optional bool parameter. The default value is false.
  // It's up to whether you have specified an existing DB in dataSourceName.
  // If dbSpecified == true, you need to make sure the DB in dataSourceName exists.
  // If dbSpecified == false, the adapter will automatically create a DB named "casbin".
  constructor(uri: string, config: any) {
    config = Object.assign({}, config, {
      pool: {
        max: 5,
        min: 0,
        idle: 10000
      },
      logging: false,
      benchmark: true
    });
    this.sequelize = new Sequelize(uri, config);
    this.casbinRule = CasbinRule(this.sequelize);
  }

  // init
  public async init(): Promise<void> {
    try {
      await this.authenticate();
      await this.sync();
    } catch (e) {
      throw e;
    }
  }

  // authenticate is the destructor for Adapter.
  private async authenticate(): Promise<void> {
    await this.sequelize.authenticate();
  }

  // sync is the destructor for Adapter.
  private async sync(): Promise<void> {
    await this.casbinRule.sync();
  }

  private loadPolicyLine(line: any, model: Model): void {
    let lineText = line.p_type;
    if (line.v0) {
      lineText += ', ' + line.v0;
    }
    if (line.v1) {
      lineText += ', ' + line.v1;
    }
    if (line.v2) {
      lineText += ', ' + line.v2;
    }
    if (line.v3) {
      lineText += ', ' + line.v3;
    }
    if (line.v4) {
      lineText += ', ' + line.v4;
    }
    if (line.v5) {
      lineText += ', ' + line.v5;
    }
    Helper.loadPolicyLine(lineText, model);
  }

  // loadPolicy loads policy from database.
  public async loadPolicy(model: Model) {
    const {casbinRule} = this;
    const lines = await casbinRule.findAll();

    for (const line of lines) {
      this.loadPolicyLine(line.toJSON(), model);
    }
  }

  private savePolicyLine(ptype: string, rule: string[]): CasbinRuleAttributes {
    const line: any = {p_type: ptype};

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

  // savePolicy saves policy to database.
  public async savePolicy(model: Model): Promise<boolean> {
    // this.dropTable()
    // this.createTable()
    const {casbinRule} = this;
    const lines: CasbinRuleAttributes[] = [];
    let astMap = model.model.get('p');
    // @ts-ignore
    for (const [ptype, ast] of astMap) {
      for (const rule of ast.policy) {
        const line: CasbinRuleAttributes = this.savePolicyLine(ptype, rule);
        lines.push(line);
      }
    }

    astMap = model.model.get('g');
    // @ts-ignore
    for (const [ptype, ast] of astMap) {
      for (const rule of ast.policy) {
        const line: CasbinRuleAttributes = this.savePolicyLine(ptype, rule);
        lines.push(line);
      }
    }

    await casbinRule.bulkCreate(lines);
    return true;
  }

  // addPolicy adds a policy rule to the storage.
  public async addPolicy(sec: string, ptype: string, rule: string[]): Promise<void> {
    // const {casbinRule} = this;
    // const line: any = this.savePolicyLine(ptype, rule);
    // await casbinRule.create(line);
    throw new Error('not implemented');
  }

  // removePolicy removes a policy rule from the storage.
  public async removePolicy(sec: string, ptype: string, rule: string[]): Promise<void> {
    // const {casbinRule} = this;
    // const where: any = this.savePolicyLine(ptype, rule);
    // await casbinRule.destroy({where});
    throw new Error('not implemented');
  }

  // removeFilteredPolicy removes policy rules that match the filter from the storage.
  public async removeFilteredPolicy(sec: string, ptype: string, fieldIndex: number, ...fieldValues: string[]): Promise<void> {
  //   const {casbinRule} = this;
  //   const where: any = {p_type: ptype};
  //   const sum: number = fieldIndex + fieldValues.length;
  //   let count: number = 0;

  //   if (fieldIndex <= count && sum > count) {
  //     where.v0 = fieldValues[count - fieldIndex];
  //   }
  //   count += 1;
  //   if (fieldIndex <= count && sum > count) {
  //     where.v1 = fieldValues[count - fieldIndex];
  //   }
  //   count += 1;
  //   if (fieldIndex <= count && sum > count) {
  //     where.v2 = fieldValues[count - fieldIndex];
  //   }
  //   count += 1;
  //   if (fieldIndex <= count && sum > count) {
  //     where.v3 = fieldValues[count - fieldIndex];
  //   }
  //   count += 1;
  //   if (fieldIndex <= count && sum > count) {
  //     where.v4 = fieldValues[count - fieldIndex];
  //   }
  //   count += 1;
  //   if (fieldIndex <= count && sum > count) {
  //     where.v5 = fieldValues[count - fieldIndex];
  //   }

  //   await casbinRule.destroy({where});
  throw new Error('not implemented');
  }
}
