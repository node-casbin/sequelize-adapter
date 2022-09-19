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

import {
  Table,
  Column,
  Model,
  getOptions,
  setOptions,
} from 'sequelize-typescript';

@Table({ timestamps: false })
export class CasbinRule extends Model<CasbinRule> {
  @Column
  public ptype: string;

  @Column
  public v0: string;

  @Column
  public v1: string;

  @Column
  public v2: string;

  @Column
  public v3: string;

  @Column
  public v4: string;

  @Column
  public v5: string;
}

export function updateCasbinRule(
  tableName = 'casbin_rule',
  schema?: string
): void {
  const options = getOptions(CasbinRule.prototype);
  options!.tableName = tableName;
  options!.schema = schema;
  setOptions(CasbinRule.prototype, options!);
}
