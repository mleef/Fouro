/** user.js **/
/*
 * Grade routing.
**/
var User = require('../models/user');

module.exports = function (app, db) {

	// For registering a new user.
    app.post("/user/register", function (req, res) {
        var newUser = new User(req.body);
        res.send(newUser);
    });

    // For logging in an already existing user.
    app.post("/user/login", function (req, res) {
        var newUser = new User(req.body);
        res.send(newUser);
    });
};