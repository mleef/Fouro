/** mySQLWrapper.js **/
/*
 * Grade routing.
**/

var mysql = require('mysql');

var mySQLWrapperFactory = function() {

	// Wrapper object
	var mySQL = {};

	// Connection to be used for queries
	var connection = mysql.createConnection({
		host     : 'mydbinstance.abcdefghijkl.us-west-2.rds.amazonaws.com;dbname=mydb',
		user     : 'mleef',
		password : '7agentsmith!',
		port 	   : '3306'
	});

	// Function to save users to the db.
	mySQL.saveUser = function(user, callback) {

		/*
		connection.query('INSERT INTO users', user, function(err, res) {
			callback(err, res);
		});
		*/
	};

	return mySQL;
}

module.exports = mySQLWrapperFactory;
