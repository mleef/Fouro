/** mySQLWrapper.js **/
/*
 * Creates a pool for sql connections to be drawn from.
**/
var mysql = require('mysql');


module.exports = function() {
        
  // Connection pool to be used for queries
  var pool = mysql.createPool({
    host : 'aaf49ha3m9h772.cokfwtp02qun.us-east-1.rds.amazonaws.com',
    connectionLimit : 100,
    database : 'fouro',
    user : 'mleef',
    password : '7agentsmith!',
    port : '3306'
  });

  return pool;
};
