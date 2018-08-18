Sequelize Adapter [![Build Status](https://travis-ci.org/node-casbin/sequelize-adapter.svg?branch=master)](https://travis-ci.org/node-casbin/sequelize-adapter) [![Coverage Status](https://coveralls.io/repos/github/node-casbin/sequelize-adapter/badge.svg?branch=master)](https://coveralls.io/github/node-casbin/sequelize-adapter?branch=master)
====

Sequelize Adapter is the [Sequelize](https://github.com/sequelize/sequelize) adapter for [Node-Casbin](https://github.com/casbin/node-casbin). With this library, Node-Casbin can load policy from Sequelize supported database or save policy to it.

Based on [Officially Supported Databases](http://docs.sequelizejs.com/), the current supported databases are:

- PostgreSQL
- MySQL
- SQLite
- MSSQL

You may find other 3rd-party supported DBs in Sequelize website or other places.

## Installation

    npm install casbin-sequelize-adapter

## Simple Example

```typescript
import {Enforcer} from 'casbin';
import {SequelizeAdapter} from 'casbin-sequelize-adapter';

async function myFunction() {
    // Initialize a Sequelize adapter and use it in a Node-Casbin enforcer:
    // The adapter will use the MySQL database named "casbin".
    // If it doesn't exist, the adapter will create it automatically.
    const a = await SequelizeAdapter.newAdapter('mysql://root:123@localhost:3306/'); // Your connection string. 

    // Or you can use an existing DB "abc" like this:
    // The adapter will use the table named "casbin_rule".
    // If it doesn't exist, the adapter will create it automatically.
    // const a = await SequelizeAdapter.newAdapter('mysql://root:123@localhost:3306/abc');


    const e = await Enforcer.newEnforcer('examples/rbac_model.conf', a);

    // Load the policy from DB.
    await e.loadPolicy();

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