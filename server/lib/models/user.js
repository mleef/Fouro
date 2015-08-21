/** user.js **/
/*
 * User model.
**/
var schemas = require("./schemas.js");  
var _ = require("lodash");
var mysql = require('mysql');

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


	
}

module.exports = User;