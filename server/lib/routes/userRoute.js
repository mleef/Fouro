/** user.js **/
/*
 * Grade routing.
**/
var User = require('../models/user');

module.exports = function (app, pool) {

    // For registering a new user.
    app.post("/user/register", function (req, res) {
        var newUser = new User(req.body);
        newUser.save(pool, function(error, response) {
            if(error) {
                res.send(error);
            } else {
                res.send(response);
            }
        })
    });

    // For logging in an already existing user.
    app.post("/user/login", function (req, res) {
        var newUser = new User(req.body);
        res.send(newUser);
    });
};
