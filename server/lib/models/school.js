/** school.js **/
/*
 * School model.
**/
var schemas = require("./schemas.js");  
var _ = require("lodash");


var GET_SCHOOL_BY_NAME = 'SELECT * FROM schools WHERE name = ?';
var GET_SCHOOL_ID_ERROR = "Could not find school.";

/**
 * Constructor for grade model.
 * @param {Object} data - Contains properties of new grade.
**/
var School = function (data, pool) {  
  this.data = this.sanitize(data);
  this.pool = pool;
}

// Initialize grade data to empty
School.prototype.data = {};
School.prototype.pool = {};

/**
 * Ensures fields of the grade are only set if they are a part of the schema.
 * @param {Object} data - Contains properties of new user.
 * @return {Object} Sanitized data.
**/
School.prototype.sanitize = function(data) {  
  data = data || {};
  schema = schemas.school;
  return _.pick(_.defaults(data, schema), _.keys(schema)); 
}

School.prototype.getByName = function() {
  var curSchool = this;
  return new Promise(function(resolve, reject) {
  	this.pool.query(GET_SCHOOL_BY_NAME, this.data.name, function(error, rows) {
      // Error or couldn't find school
      if(error || rows.length === 0) {
        reject(GET_SCHOOL_ID_ERROR);
      } else {
  	    resolve(rows[0]);
      }
  	});
  }.bind(curSchool));
}

module.exports = School;
