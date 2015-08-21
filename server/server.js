var express = require('express');
var app = express();
var mySQL = require('./lib/db/mySQLWrapper');
var bodyParser = require('body-parser');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())

// Initialize routes with express and new sql wrapper
var routes = require('./lib/routes/index.js')(app, new mySQL());


var server = app.listen(3000, function () {
    
});