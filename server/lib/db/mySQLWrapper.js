/** mySQLWrapper.js **/
/*
 * Grade routing.
**/
var mysql = require('mysql');


module.exports = function() {
	// Connection to be used for queries
	var connection = mysql.createConnection({
		host     : 'mydbinstance.abcdefghijkl.us-west-2.rds.amazonaws.com;dbname=mydb',
		user     : 'mleef',
		password : '7agentsmith!',
		port 	   : '3306'
	});
	return connection;
};
