/** grade.js **/
/*
 * Grade model.
**/
var schemas = require("./schemas.js");  
var _ = require("lodash");

var Grade = function (data) {  
	this.data = this.sanitize(data);
}

Grade.prototype.data = {};

User.prototype.sanitize = function(data) {  
	data = data || {};
    schema = schemas.grade;
    return _.pick(_.defaults(data, schema), _.keys(schema)); 
}

module.exports = User;