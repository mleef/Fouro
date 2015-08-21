/** grade.js **/
/*
 * Grade routing.
**/
var Grade = require('../models/grade');

module.exports = function (app, db) {
    // set up the routes themselves
    app.post("/grade", function (req, res) {
        var newGrade = new Grade(req.body);
        res.send(newGrade);
    });

    app.get("/grade", function (req, res) {
        var newGrade = new Grade(req.body);
        res.send(newGrade);
    });
};