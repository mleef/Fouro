/** user.js **/
/*
 * User model and db interaction.
**/
var schemas = require("./schemas.js");  
var _ = require("lodash");
var randtoken = require('rand-token');
var nodemailer = require('nodemailer');

// Database queries
var CHECK_EMAIL_UNIQUENESS = 'SELECT * FROM users WHERE username = ?';
var GET_SCHOOL_ID = 'SELECT * FROM schools WHERE name = ?';
var SAVE_USER = 'INSERT INTO users SET ?';
var LOGIN_USER = 'SELECT * FROM users WHERE username = ? AND password = ?';

// Errors
var EMAIL_UNIQUENESS_ERROR = "Email is already associated with an account.";
var GET_SCHOOL_ID_ERROR = "Could not find school.";
var SAVE_USER_ERROR = "Could not save user.";

/**
 * Constructor for user model.
 * @param {Object} data - Contains properties of new user.
**/
var User = function (data) {  
  this.data = this.sanitize(data);
}

// Initialize data to empty
User.prototype.data = {};

/**
 * Ensures fields of the user are only set if they are a part of the schema.
 * @param {Object} data - Contains properties of new user.
 * @return {Object} Sanitized data.
**/
User.prototype.sanitize = function(data) {  
    data = data || {};
    schema = schemas.user;
    return _.pick(_.defaults(data, schema), _.keys(schema)); 
}

/**
 * Saves a new user to the database.
 * @param {Object} pool - mySQL connection pool to use for queries.
 * @param {Function} callback - Function to callback with error/response.
**/
User.prototype.create = function(pool, callback) {
  var userData = this.data;
  // Check for unique username/email
  this.exists(pool, function(rows) {
  	if(rows && rows.length === 0) {
      var school_id;
      // Find school_id to add to user
      pool.query(GET_SCHOOL_ID, userData.school, function(error, rows) {
        // Error or couldn't find school
        if(error || rows.length === 0) {
          callback(GET_SCHOOL_ID_ERROR, null);
          return;
        }
        // Attach school_id to data
        userData.school_id = rows[0].id;

        // Remove superfluous 'school' property
        delete userData.school;

        // Save user
        pool.query(SAVE_USER, userData, function(error, res) {
          // Error saving user.
          if(error || !res) {
            callback(SAVE_USER_ERROR, null);
            return;
          }
          // Successful create, callback with insertion id.
          callback(null, res.insertId);
          return;
        })
      });
    } else {
    	callback(EMAIL_UNIQUENESS_ERROR, null);
    	return;
    }
  }); 
}

User.prototype.login = function(pool, callback) {
	var userData = this.data;

}

User.prototype.logout = function(pool, callback) {
	
}

/**
 * Checks the uniqueness of user username.
 * @param {Object} pool - mySQL connection pool to use for queries.
 * @param {Function} callback - callback function when done.
 * @return {Boolean} True if username could not be found in db, false otherwise.
**/
User.prototype.exists = function(pool, callback) {
  pool.query(CHECK_EMAIL_UNIQUENESS, this.data.username, function(err, rows) {
    callback(rows);
  });
}



module.exports = User;
