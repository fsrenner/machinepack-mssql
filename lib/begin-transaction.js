const mssql = require('mssql');

module.exports = {


  friendlyName: 'Begin transaction',


  description: 'Begin a new database transaction on the provided connection.',


  moreInfoUrl: 'https://docs.microsoft.com/en-us/sql/t-sql/language-elements/begin-transaction-transact-sql?view=sql-server-2017',


  inputs: {

    connection: {
      friendlyName: 'Connection',
      description: 'An active database connection.',
      extendedDescription: 'The provided database connection instance must still be active.  Only database connection instances created by the `getConnection()` machine in this driver are supported.',
      example: '===',
      required: true
    },

    meta: {
      friendlyName: 'Meta (custom)',
      description: 'Additional stuff to pass to the driver.',
      extendedDescription: 'This is reserved for custom driver-specific extensions.  Please refer to the documentation for the driver you are using for more specific information.',
      example: '==='
    }

  },


  exits: {

    success: {
      description: 'The transaction was successfully started.',
      extendedDescription: 'Until it is committed, rolled back, or times out, subsequent queries run on this connection will be transactional.  They will not have any true effect on the database until the transaction is committed, and will not affect queries made on other connections.',
      outputVariableName: 'report',
      outputDescription: 'The `meta` property is reserved for custom driver-specific extensions.',
      outputExample: '==='
      // outputExample: {
      //   meta: '==='
      // }
    },

    badConnection: {
      friendlyName: 'Bad connection',
      description: 'The provided connection is not valid or no longer active.  Are you sure it was obtained by calling this driver\'s `getConnection()` method?',
      extendedDescription: 'Usually, this means the connection to the database was lost due to a logic error or timing issue in userland code.  In production, this can mean that the database became overwhelemed or was shut off while some business logic was in progress.',
      outputVariableName: 'report',
      outputDescription: 'The `meta` property is reserved for custom driver-specific extensions.',
      outputExample: '==='
      // outputExample: {
      //   meta: '==='
      // }
    }

  },


  fn: async function beginTransaction(inputs, exits) {
    const transaction = new mssql.Transaction(inputs.connection);
    if (inputs.meta && inputs.meta.isolationLevel) {
      await transaction.begin(inputs.meta.isolationLevel);
    }
    else {
      await transaction.begin();
    }

    transaction.on('rollback', () => {

      transaction.rolledBack = true;
    });

    inputs.connection.currentTransaction = transaction;

    return exits.success({
      meta: inputs.meta
    });

    // var Pack = require('../');

    // Since we're using `sendNativeQuery()` to access the underlying connection,
    // we have confidence it will be validated before being used.
    // const report = await Pack.sendNativeQuery({
    //   connection: inputs.connection,
    //   nativeQuery: 'BEGIN'
    // })
    // .switch({
    //   error: function error(err) {
    //     return exits.error(err);
    //   },
    //   badConnection: function badConnection() {
    //     return exits.badConnection({
    //       meta: inputs.meta
    //     });
    //   },
    // success: function success() {
    // return exits.success({
    //   meta: inputs.meta
    // });
    // }
    // });
  }


};
