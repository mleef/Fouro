/** grade.js **/
/*
 * Grade model.
**/
var schemas = require("./schemas.js");  
var _ = require("lodash");

/**
 * Constructor for grade model.
 * @param {Object} data - Contains properties of new grade.
**/
var Grade = function (data) {  
  this.data = this.sanitize(data);
}

// Initialize grade data to empty
Grade.prototype.data = {};

/**
 * Ensures fields of the grade are only set if they are a part of the schema.
 * @param {Object} data - Contains properties of new user.
 * @return {Object} Sanitized data.
**/
Grade.prototype.sanitize = function(data) {  
  data = data || {};
  schema = schemas.grade;
  return _.pick(_.defaults(data, schema), _.keys(schema)); 
}

module.exports = Grade;
