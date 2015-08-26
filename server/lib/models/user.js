/** user.js **/
/*
 * User model and db interaction.
**/
var schemas = require("./schemas.js");  
var _ = require("lodash");
var randtoken = require('rand-token');
var nodemailer = require('nodemailer');
var School = require('./school.js');

// Database queries
var CHECK_UNIQUENESS = 'SELECT * FROM users WHERE username = ?';
var SAVE_USER = 'INSERT INTO users SET ?';
var REGISTER_USER = 'INSERT INTO confirmation SET ?';
var CONFIRM_USER = 'SELECT * FROM confirmation WHERE token = ?'
var LOGIN_USER = 'SELECT * FROM users WHERE username = ? AND password = ?';
var AUTHORIZE_USER = 'INSERT INTO auth SET ?';
var SAVE_TOKEN = 'INSERT INTO auth SET ? ON DUPLICATE KEY UPDATE token=VALUES(token), valid_until=VALUES(valid_until)';

// Errors
var UNIQUENESS_ERROR = "Email is already associated with an account.";
var SAVE_USER_ERROR = "Could not save user.";
var REGISTER_USER_ERROR = "Could not register user."
var CONFIRM_USER_ERROR = "Could not find registration token."
var LOGIN_USER_ERROR = "Incorrect username/password";
var AUTHORIZE_USER_ERROR = "Could not authenticate user.";
var EMAIL_ERROR = "Could not send email to specified address.";

/**
 * Constructor for user model.
 * @param {Object} data - Contains properties of new user.
**/
var User = function (data, pool) {  
  this.data = this.sanitize(data);
  this.pool = pool;
}

// Initialize data to empty
User.prototype.data = {};
User.prototype.pool = {};

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
 * Creates a new user by saving their data in a temporary table and sending a confirmation email with a token.
**/
User.prototype.create = function() {
  var curUser = this;
  return new Promise(function(resolve, reject) {
  	// Check for email/username uniqueness
    this.isUnique().then(function(result) {
      // Use school object to get the id
      var school = new School({name : this.data.school}, this.pool);
      school.getByName().then(function(result) {
      	// Set school_id on user object
      	this.data.school_id = result.id;
        this.register().then(function(result) {
          // Send confirmation email if registration succeeded
          sendConfirmationEmail(this.data).then(function(result) {
            resolve();
          }.bind(curUser), function(error) {
            reject(error);
          });
        }.bind(curUser), function(error) {
          reject(error);
        });
      }.bind(curUser), function(error) {
        reject(error);
      });
    }.bind(curUser), function(error) {
      reject(error);
    });
  }.bind(curUser));
}

/**
 * Logs user into the system by deleting their access token.
**/
User.prototype.login = function(callback) {
  var curUser = this;
  return new Promise(function(resolve, reject) {
    this.pool.query(LOGIN_USER, [this.data.username, this.data.password], function(error, rows) {
      if(!error && rows.length === 1) {
      	// Generate new token and send back to user.
      	var token = randtoken.generate(16);
      	var curDate = new Date();
      	var futureDate = new Date();
      	// Expires in a year
      	futureDate.setMonth(futureDate.getMonth() + 12);
        var authData = {
          user_id : rows[0].id,
          token : token,
          valid_until : futureDate.toISOString().slice(0, 19).replace('T', ' '),
          updated_at : curDate.toISOString().slice(0, 19).replace('T', ' '),
          created_at : curDate.toISOString().slice(0, 19).replace('T', ' ')
        };
        this.pool.query(AUTHORIZE_USER, authData, function(error, rows) {
          if(error) {
          	reject()
          } else {
          	resolve(token);
          }
        });
      } else {
      	reject(LOGIN_USER_ERROR);
      }
    }.bind(curUser))
  }.bind(curUser));
}

/**
 * Logs user out of the system by deleting their access token.
**/
User.prototype.logout = function(callback) {
	
}

/**
 * Validates uniqueness of user (email/username);
**/
User.prototype.isUnique = function() {
  var curUser = this;
  return new Promise(function(resolve, reject) {
  	// Query for username
    this.pool.query(CHECK_UNIQUENESS, this.data.username, function(error, rows) {
  	  if(rows && rows.length === 0) {
  	    resolve(true);
  	  } else {
  	    reject(UNIQUENESS_ERROR);
  	  }
    });
  }.bind(curUser));
}

/**
 * Saves user data to the database.
**/
User.prototype.save = function() {
  var curUser = this;
  return new Promise(function(resolve, reject) {
  	// Query to put user into users table
    this.pool.query(SAVE_USER, this.data, function(error, res) {
      // Error saving user.
      if(error || !res) {
        reject(SAVE_USER_ERROR);
      } else {
        resolve();
      }
    })
  }.bind(curUser));
}

/**
 * Writes user data to temporary table and provides a token by which registration can be completed.
**/
User.prototype.register = function() {
  var curUser = this;
  return new Promise(function(resolve, reject) {
  	var token = randtoken.generate(16);
    this.data.token = token;
    delete this.data.school;
    // Query to put user data into temporary confirmation table
    this.pool.query(REGISTER_USER, this.data, function(error, res) {
      // Error saving user.
      if(error || !res) {
        reject(REGISTER_USER_ERROR);
      } else {
        resolve(token);
      }
    })
  }.bind(curUser));
}

/**
 * Validates confirmation token and saves user to normal db.
**/
User.prototype.confirm = function(token) {
  var curUser = this;
  return new Promise(function(resolve, reject) {
    this.pool.query(CONFIRM_USER, token, function(error, rows) {
      // Error saving user.
      if( error || !rows ) {
        reject(CONFIRM_USER_ERROR);
      } else {
        var newUser = new User(rows[0], this.pool);
        delete newUser.data.school;
        newUser.data.school_id = rows[0].school_id;
        newUser.save().then(function(result) {
          resolve();
        }, function(error) {
          reject(error);
        });
      }
    }.bind(curUser))
  }.bind(curUser));
}

/**
 * Sends email with confirmation link to user.
**/
function sendConfirmationEmail(data) {
  return new Promise(function(resolve, reject) {
  	// Generate link that contains token
    var confirmationLink = 'http://fouro-env.elasticbeanstalk.com/users/confirm/' + data.token;
    // New transport with sender account info
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'leefmarc@gmail.com',
        pass: '7agentsmith!'
      }
    });

    // Send mail
    transporter.sendMail({
      from: 'leefmarc@gmail.com',
      to: data.username,
      subject: 'Confirm your Fouro Account',
      html: '<p> Click the link below to confirm your Fouro account and begin browsing and submitting grades!</p><a href="' + confirmationLink +'">Confirm account</a>'
    }, function(error, info) {
      if(error) {
	    reject(EMAIL_ERROR);
	  } else {
	    resolve();
	  }
    });
  });
}

module.exports = User;
