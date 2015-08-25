/** schoolRoute.js **/
/*
 * School routing.
**/

module.exports = function (app, db) {
  // Get all class departments
  app.get("/:schoolName/classes", function (req, res) {
    var school = req.params.schoolName;
    res.send(school);
  });

  // Get all classes in given department
  app.get("/:schoolName/classes/:classDepartment", function (req, res) {
    var school = req.params.schoolName;
    var classDepartment = req.params.classDepartment;
    res.send(school + '/' + classDepartment);
  });

  // Get all grades for course
  app.get("/:schoolName/classes/:classDepartment/:classNumber", function (req, res) {
    var school = req.params.schoolName;
    var classDepartment = req.params.classDepartmenvt;
    var classNumber = req.params.classNumber;
    res.send(school + '/' + classDepartment + '/' + classNumber);
  });

};
