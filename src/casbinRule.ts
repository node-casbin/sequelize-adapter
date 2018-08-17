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

import * as Sequelize from 'sequelize';

interface CasbinRuleAttributes {
  id: string;
  p_type: string;
  v0: string;
  v1: string;
  v2: string;
  v3: string;
  v4: string;
  v5: string;
}

type CasbinRuleInstance = Sequelize.Instance<CasbinRuleAttributes> & CasbinRuleAttributes;

const CasbinRule = (sequalize: Sequelize.Sequelize) => {
  const UUID = Sequelize.UUID;
  const STRING = Sequelize.STRING(100);
  const attributes: SequelizeAttributes<CasbinRuleAttributes> = {
    id: {
      type: UUID,
      allowNull: false,
      unique: true,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    p_type: {
      type: STRING,
      allowNull: false
    },
    v0: {
      type: STRING,
      allowNull: true
    },
    v1: {
      type: STRING,
      allowNull: true
    },
    v2: {
      type: STRING,
      allowNull: true
    },
    v3: {
      type: STRING,
      allowNull: true
    },
    v4: {
      type: STRING,
      allowNull: true
    },
    v5: {
      type: STRING,
      allowNull: true
    }
  };
  return sequalize.define<CasbinRuleInstance, CasbinRuleAttributes>('CasbinRule', attributes);
};

export { CasbinRuleAttributes, CasbinRuleInstance, CasbinRule };
