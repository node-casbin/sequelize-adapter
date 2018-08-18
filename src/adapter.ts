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
import {Sequelize} from 'sequelize-typescript';
import {CasbinRule} from './casbinRule';

export class Adapter {
    private connStr: string;

    private sequelize: Sequelize;

    constructor(connStr: string) {
        this.connStr = connStr;

        this.open();
    }

    private createDatabase() {
    }

    private open() {
        this.sequelize = new Sequelize(this.connStr);
        this.sequelize.addModels([CasbinRule]);

        this.createTable();
    }

    private close() {
        this.sequelize.close();
    }

    private createTable() {
    }

    private dropTable() {
    }

    private loadPolicyLine(line: {[index: string]: string}, model: Model) {
        let lineText = line.ptype;
        if (line.v0 !== '') {
            lineText += ', ' + line.v0;
        }
        if (line.v1 !== '') {
            lineText += ', ' + line.v1;
        }
        if (line.v2 !== '') {
            lineText += ', ' + line.v2;
        }
        if (line.v3 !== '') {
            lineText += ', ' + line.v3;
        }
        if (line.v4 !== '') {
            lineText += ', ' + line.v4;
        }
        if (line.v5 !== '') {
            lineText += ', ' + line.v5;
        }

        Helper.loadPolicyLine(lineText, model);
    }

    /**
     * loadPolicy loads all policy rules from the storage.
     */
    public loadPolicy(model: Model) {
        const lines = CasbinRule.findAll();

        for (const line of lines) {
            this.loadPolicyLine(line.toJSON(), model);
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
    public savePolicy(model: Model) {
        this.dropTable();
        this.createTable();

        const lines = [];
        let astMap = model.get('p');
        for (const [ptype, ast] of astMap) {
            for (const rule of ast.Policy) {
                const line = this.savePolicyLine(ptype, rule);
                lines.push(line);
            }
        }

        astMap = model.get('g');
        for (const [ptype, ast] of astMap) {
            for (const rule of ast.Policy) {
                const line = this.savePolicyLine(ptype, rule);
                lines.push(line);
            }
        }

        CasbinRule.bulkCreate(lines);
    }

    /**
     * addPolicy adds a policy rule to the storage.
     */
    public addPolicy(sec: string, ptype: string, rule: string[]) {
        throw new Error('not implemented');
    }

    /**
     * removePolicy removes a policy rule from the storage.
     */
    public removePolicy(sec: string, ptype: string, rule: string[]) {
        throw new Error('not implemented');
    }

    /**
     * removeFilteredPolicy removes policy rules that match the filter from the storage.
     */
    public removeFilteredPolicy(sec: string, ptype: string, rule: string[]) {
        throw new Error('not implemented');
    }
}
