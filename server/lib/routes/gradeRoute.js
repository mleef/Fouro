/** grade.js **/
/*
 * Grade routing.
**/
var Grade = require('../models/grade');

module.exports = function (app, pool) {
    
  // For adding new grades.
  app.post("/grade", function (req, res) {
    var newGrade = new Grade(req.body);
    res.send(newGrade);
  });

  // For getting grade results.
  app.get("/grade", function (req, res) {
    var newGrade = new Grade(req.body);
    res.send(newGrade);
  });
};
