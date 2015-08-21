/** user.js **/
/*
 * User model and db interaction.
**/
var schemas = require("./schemas.js");  
var _ = require("lodash");

// Database queries
var CHECK_EMAIL_UNIQUENESS = 'SELECT * FROM users WHERE email = ?';
var GET_SCHOOL_ID = 'SELECT * FROM schools WHERE name = ?';
var SAVE_USER = 'INSERT INTO users SET ?';

// Errors
var EMAIL_UNIQUENESS_ERROR = {error : "Email is already associated with an account."};
var GET_SCHOOL_ID_ERROR = {error : "Could not find school."};
var SAVE_USER_ERROR = {error : "Could not save user."};

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
User.prototype.save = function(pool, callback) {
  var userData = this.data;
  // Check for unique email
  if(!this.exists(pool)) {
    var school_id;
    // Find school_id to add to user
    pool.query(GET_SCHOOL_ID, this.data.school, function(error, rows) {
      // Couldn't find school
      if(error || rows.length === 0) {
        callback(GET_SCHOOL_ID_ERROR, null);
        return;
      }
      userData.school_id = rows[0].id;

      // Save user
      pool.query(SAVE_USER, userData, function(error, res) {
        // Error saving user.
        if(error || !res) {
          callback(SAVE_USER_ERROR, null);
          return;
        }
        // Successful save, callback with insertion id.
        callback(error, res.insertId);
      })
    });

  } else {
    callback(EMAIL_UNIQUENESS_ERROR, null);
  }
}

/**
 * Checks the uniqueness of user email.
 * @param {Object} pool - mySQL connection pool to use for queries.
 * @return {Boolean} True if email could not be found in db, false otherwise.
**/
User.prototype.exists(pool) {
  pool.query(CHECK_EMAIL_UNIQUENESS, this.data.email, function(err, rows) {
    if(err) {
      return true;
    }
    return rows.length === 0;
  });
}



module.exports = User;
