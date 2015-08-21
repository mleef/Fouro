/** user.js **/
/*
 * User model.
**/
var schemas = require("./schemas.js");  
var _ = require("lodash");
var connection = require('../db/mySQLWrapper')();

var User = function (data) {  
	this.data = this.sanitize(data);
}

User.prototype.data = {};

User.prototype.sanitize = function(data) {  
    data = data || {};
    schema = schemas.user;
    return _.pick(_.defaults(data, schema), _.keys(schema)); 
}

User.prototype.save = function(callback) {
	// Check for unique email
	if(!this.exists()) {
		var school_id;
		// Find school_id to add to user
		connection.query('SELECT * FROM schools WHERE name = ?', this.data.school, function(err, rows) {
			if(err) {
				callback(err, null);
				return;
			}
			school_id = rows[0].id;
		});

		// Save user
		connection.query('INSERT INTO users (school_id, name, email, password) VALUES (?, ?, ?, ?)', [school_id, this.data.name, this.data.email, this.data.password], function(err, res) {
			callback(err, res.insertId);
		})
	} else {
		callback({error : "Email is already associated with an account."});
	}

	
}

/**
 * Checks the uniqueness of user email.
**/
User.prototype.exists() {
	connection.query('SELECT * FROM users WHERE email = ?', [this.data.email], function(err, rows) {
		return rows.length === 0;
	});
}



module.exports = User;