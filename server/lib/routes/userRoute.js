/** user.js **/
/*
 * Grade routing.
**/
var User = require('../models/user');

module.exports = function (app, pool) {

    // For registering a new user.
    app.post("/users/create", function (req, res) {
      var newUser = new User(req.body.fouroData, pool);
      newUser.create().then(function(result) {
        res.json({result : true});
      }, function(err) {
        res.json({error : err});
      });
    });

    // For confirming a new user's account
    app.get("/users/confirm/:token", function (req, res) {
      var newUser = new User(null, pool);
      newUser.confirm(req.params.token).then(function(result) {
        res.json({result : true});
      }, function(err) {
        res.json({error : err});
      });
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
    app.post("/users/login", function (req, res) {
      var newUser = new User(req.body.fouroData, pool);
      newUser.login().then(function(result) {
        res.json({result : true});
      }, function(err) {
        res.json({error : err});
      });
    });

    // For logging out a user.
    app.post("/users/logout", function (req, res) {
        var newUser = new User(req.body.fouroData, pool);
        newUser.logout(pool, function(error, response) {
          res.json({error : error, response : response});
        })
    });

};
