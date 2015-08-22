/** user.js **/
/*
 * Grade routing.
**/
var User = require('../models/user');

module.exports = function (app, pool) {

    // For registering a new user.
    app.post("/users/create", function (req, res) {
        var newUser = new User(req.body.data);
        newUser.save(pool, function(error, response) {
          res.json({error : error, response : response});
        })
    });

    // For updating the info of an already existing user.
    app.put("/users/update/:username", function (req, res) {
        var username = req.params.username;
        res.send(username);
    });

    // For deleting an already existing user.
    app.delete("/users/:username", function (req, res) {
        var username = req.params.username;
        res.send(username);
    });

    // For logging in an already existing user.
    app.post("/users/login/:username", function (req, res) {
        var username = req.params.username;
        res.send(username);
    });

    // For authenticating a user
    app.get("/users/auth/:username", function (req, res) {
        var username = req.params.username;
        res.send(username);
    });

};
