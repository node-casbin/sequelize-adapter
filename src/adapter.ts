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

import {Helper, Model} from 'casbin';
import {Sequelize, ISequelizeUriConfig} from 'sequelize-typescript';
import {CasbinRule} from './casbinRule';

/**
 * SequelizeAdapter represents the Sequelize adapter for policy storage.
 */
export class SequelizeAdapter {
    private connStr: string;
    private dbSpecified: boolean;

    private sequelize: Sequelize;

    constructor(connStr: string, dbSpecified: boolean) {
        this.connStr = connStr;
        this.dbSpecified = dbSpecified;
    }

    /**
     * newAdapter is the constructor.
     * dbSpecified is an optional boolean parameter. The default value is false.
     * It's up to whether you have specified an existing DB in connStr.
     * If dbSpecified == true, you need to make sure the DB in connStr exists.
     * If dbSpecified == false, the adapter will automatically create a DB named 'casbin'.
     */
    public static async newAdapter(connStr: string, dbSpecified: boolean = false) {
        const a = new SequelizeAdapter(connStr, dbSpecified);
        await a.open();

        return a;
    }

    private async createDatabase() {
        const uriConfig: ISequelizeUriConfig = {url: this.connStr, logging: false, pool: { max: 5, min: 0, idle: 10000 }};
        this.sequelize = new Sequelize(uriConfig);
        await this.sequelize.authenticate();

        await this.sequelize.query('CREATE DATABASE IF NOT EXISTS casbin');

        await this.sequelize.close();
    }

    private async open() {
        if (this.dbSpecified) {
            const uriConfig: ISequelizeUriConfig = {url: this.connStr, logging: false, pool: { max: 5, min: 0, idle: 10000 }};
            this.sequelize = new Sequelize(uriConfig);
        } else {
            await this.createDatabase();
            const url = this.connStr + 'casbin';
            const uriConfig: ISequelizeUriConfig = {url, logging: false, pool: { max: 5, min: 0, idle: 10000 }};
            this.sequelize = new Sequelize(uriConfig);
        }

        await this.sequelize.authenticate();
        this.sequelize.addModels([CasbinRule]);

        await this.createTable();
    }

    public async close() {
        await this.sequelize.close();
    }

    private async createTable() {
        await CasbinRule.sync();
    }

    private async dropTable() {
        await CasbinRule.destroy({where: {}, truncate: true});
    }

    private loadPolicyLine(line: CasbinRule, model: Model) {
        let lineText = line.ptype;
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

    /**
     * loadPolicy loads all policy rules from the storage.
     */
    public async loadPolicy(model: Model) {
        const lines = await CasbinRule.findAll();

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
    public async savePolicy(model: Model) {
        await this.dropTable();
        await this.createTable();

        let astMap = model.model.get('p');
        // @ts-ignore
        for (const [ptype, ast] of astMap) {
            for (const rule of ast.policy) {
                const line = this.savePolicyLine(ptype, rule);
                await line.save();
            }
        }

        astMap = model.model.get('g');
        // @ts-ignore
        for (const [ptype, ast] of astMap) {
            for (const rule of ast.policy) {
                const line = this.savePolicyLine(ptype, rule);
                await line.save();
            }
        }

        return true;
    }

    /**
     * addPolicy adds a policy rule to the storage.
     */
    public async addPolicy(sec: string, ptype: string, rule: string[]) {
        throw new Error('not implemented');
    }

    /**
     * removePolicy removes a policy rule from the storage.
     */
    public async removePolicy(sec: string, ptype: string, rule: string[]) {
        throw new Error('not implemented');
    }

    /**
     * removeFilteredPolicy removes policy rules that match the filter from the storage.
     */
    public async removeFilteredPolicy(sec: string, ptype: string, fieldIndex: number, ...fieldValues: string[]) {
        throw new Error('not implemented');
    }
}
