Sequelize Adapter
====
[![CI](https://github.com/node-casbin/sequelize-adapter/actions/workflows/ci.yml/badge.svg)](https://github.com/node-casbin/sequelize-adapter/actions/workflows/ci.yml)
[![Coverage Status](https://coveralls.io/repos/github/node-casbin/sequelize-adapter/badge.svg?branch=master)](https://coveralls.io/github/node-casbin/sequelize-adapter?branch=master)
[![NPM version][npm-image]][npm-url]
[![NPM download][download-image]][download-url]
[![Discord](https://img.shields.io/discord/1022748306096537660?logo=discord&label=discord&color=5865F2)](https://discord.gg/S5UjpzGZjN)

[npm-image]: https://img.shields.io/npm/v/casbin-sequelize-adapter.svg?style=flat-square
[npm-url]: https://npmjs.com/package/casbin-sequelize-adapter
[download-image]: https://img.shields.io/npm/dm/casbin-sequelize-adapter.svg?style=flat-square
[download-url]: https://npmjs.com/package/casbin-sequelize-adapter

Sequelize Adapter is the [Sequelize](https://github.com/sequelize/sequelize) adapter for [Node-Casbin](https://github.com/casbin/node-casbin). With this library, Node-Casbin can load policy from Sequelize supported database or save policy to it.

Based on [Officially Supported Databases](http://docs.sequelizejs.com/), the current supported databases are:

- MySQL
- PostgreSQL
- SQLite
- MSSQL

You may find other 3rd-party supported DBs in Sequelize website or other places.

## Installation

    npm install casbin-sequelize-adapter

## Simple Example

```typescript
import { newEnforcer } from 'casbin';
import { SequelizeAdapter } from 'casbin-sequelize-adapter';

async function myFunction() {
  // Initialize a Sequelize adapter and use it in a Node-Casbin enforcer:
  // The adapter can not automatically create database.
  // But the adapter will automatically create and use the table named "casbin_rule".
  // I think ORM should not automatically create databases.
  const a = await SequelizeAdapter.newAdapter({
    username: 'root',
    password: '',
    database: 'casbin',
    dialect: 'mysql',
  });

  const e = await newEnforcer('examples/rbac_model.conf', a);

  // Load the policy from DB.
  await e.loadPolicy();

  // Check the permission.
  await e.enforce('alice', 'data1', 'read');

  // Modify the policy.
  // await e.addPolicy(...);
  // await e.removePolicy(...);

  // Save the policy back to DB.
  await e.savePolicy();
}
```

## Simple Filter Example

```typescript
import { newEnforcer } from 'casbin';
import { SequelizeAdapter } from 'casbin-sequelize-adapter';

async function myFunction() {
  // Initialize a Sequelize adapter and use it in a Node-Casbin enforcer:
  // The adapter can not automatically create database.
  // But the adapter will automatically create and use the table named "casbin_rule".
  // I think ORM should not automatically create databases.
  const a = await SequelizeAdapter.newAdapter({
    username: 'root',
    password: '',
    database: 'casbin',
    dialect: 'mysql',
  });

  const e = await newEnforcer('examples/rbac_model.conf', a);

  // Load the filtered policy from DB.
  await e.loadFilteredPolicy({
    ptype: 'p',
    v0: 'alice'
  });

  // Check the permission.
  await e.enforce('alice', 'data1', 'read');

  // Modify the policy.
  // await e.addPolicy(...);
  // await e.removePolicy(...);

  // Save the policy back to DB.
  await e.savePolicy();
}
```

## Getting Help

- [Node-Casbin](https://github.com/casbin/node-casbin)

## License

This project is under Apache 2.0 License. See the [LICENSE](LICENSE) file for the full license text.
