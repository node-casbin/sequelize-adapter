# Sequelize Adapter

[![NPM version][npm-image]][npm-url]
[![NPM download][download-image]][download-url]
[![codebeat badge](https://codebeat.co/badges/c17c9ee1-da42-4db3-8047-9574ad2b23b1)](https://codebeat.co/projects/github-com-node-casbin-sequelize-adapter-master)
[![ci](https://github.com/node-casbin/sequelize-adapter/actions/workflows/ci.yml/badge.svg)](https://github.com/node-casbin/sequelize-adapter/actions/workflows/ci.yml)
[![Coverage Status](https://coveralls.io/repos/github/node-casbin/sequelize-adapter/badge.svg?branch=master)](https://coveralls.io/github/node-casbin/sequelize-adapter?branch=master)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/casbin/lobby)

[npm-image]: https://img.shields.io/npm/v/casbin-sequelize-adapter.svg?style=flat-square
[npm-url]: https://npmjs.org/package/casbin-sequelize-adapter
[download-image]: https://img.shields.io/npm/dm/casbin-sequelize-adapter.svg?style=flat-square
[download-url]: https://npmjs.org/package/casbin-sequelize-adapter

Sequelize Adapter is the [Sequelize](https://github.com/sequelize/sequelize) adapter for [Node-Casbin](https://github.com/casbin/node-casbin). With this library, Node-Casbin can load policy from Sequelize supported database or save policy to it.

Based on [Officially Supported Databases](http://docs.sequelizejs.com/), the current supported databases are:

- PostgreSQL
- MySQL
- SQLite
- MSSQL

You may find other 3rd-party supported DBs in Sequelize website or other places.

## Installation

NPM Install

```bash
npm install casbin-sequelize-adapter --save
```

Yarn Install

```bash
yarn add casbin-sequelize-adapter
```

## Testing Locally

Start mysql for tests:

```bash
docker compose up -d
```

```bash
yarn test
```

## Simple Example

```typescript
import casbin from 'casbin';
import { SequelizeAdapter } from 'casbin-sequelize-adapter';

async function myFunction() {
  // Initialize a Sequelize adapter and use it in a Node-Casbin enforcer:
  // The adapter can not automatically create database.
  // But the adapter will automatically and use the table named "casbin_rule".
  // ORM should not create databases automatically.
  const a = await SequelizeAdapter.newAdapter({
    username: 'root',
    password: '',
    database: 'casbin',
    dialect: 'mysql',
  });

  const e = await casbin.newEnforcer('examples/rbac_model.conf', a);

  // Check the permission.
  e.enforce('alice', 'data1', 'read');

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
