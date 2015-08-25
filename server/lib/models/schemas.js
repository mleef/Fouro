/** schemas.js **/

// Client schemas for models.
schemas = {  
  user: {
    username: null,
    password: null,
    school: null
  },
  grade: {
    grade : null,
    courseSubject : null,
    courseNumber : null,
    school: null
  },
  school : {
    name : null,
    city : null,
    state : null
  }
}

module.exports = schemas;  
