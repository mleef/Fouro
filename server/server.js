var express = require('express');
var app = express();
var mySQLWrapper = require('./lib/db/mySQLWrapper');
var bodyParser = require('body-parser');
var fs = require('fs');
var port = process.env.PORT || 3000;


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())

// New mySQL connection pool
var connectionPool = new mySQLWrapper();

// Initialize routes with express and new sql wrapper
var routes = require('./lib/routes/index.js')(app, connectionPool);


var server = app.listen(port, function () {
    console.log('Running on port ' + port);
});
