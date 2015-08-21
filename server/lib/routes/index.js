// export a function that accepts `app` as a param
module.exports = function (app, db) {
    require("./gradeRoute")(app, db);
    require("./userRoute")(app, db);
    // add new lines for each other module, or use an array with a forEach
};