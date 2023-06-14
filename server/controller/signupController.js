//require bcrypt
const bcrypt = require('bcrypt');
const saltRounds = 10;

//require database
const db = require('../models/activityModel');

const signupController = {};

//Check if user exists in database before committing to creating a new user
signupController.checkForUser = async (req, res, next) => {

  //destructure request body
  const { email } = req.body;

  //check data types of passed in information
  if(typeof email !== 'string') return next({
    log: 'Error in signupController.checkForUser, email needs to be a string',
    message: { err: 'email not a string' }
  });
  
  //prep query
  const query = `SELECT email FROM user_info WHERE email = '${email}';`

  //check database for passed in email
  const check = await db.query(query)
    .then(data => data)
    .catch(err => next({
      log: 'An error occurred in the query in signupController.checkForUser',
      message: { err: `${ err }` }
    }))
  
  //if there are no emails of the same name set check var to true
  if(check.rows.length === 0) {
    res.locals.checkStatus = true;
  } else {
    res.locals.checkStatus = false;
  }

  //invoke next middleware
  return next();
}

//If checkForUser returns true create a new user in the database and return user information
signupController.createUser = async (req, res, next) => {
  
  //check results from checkForUser and if false invoke next middleware
  if(res.locals.checkStatus === false) {
    res.locals.signupStatus = { result: false}
    return next()
  }
  
  //destructure body
  const { email, password } = req.body;

  //check data type of password
  if(typeof password !== 'string') return next({
    log: 'Error in signupController.checkForUser, password needs to be a string',
    message: { err: 'password not a string' }
  })

  //create salt for hash
  const newSalt = await bcrypt.genSalt(saltRounds)
    .then(salt => salt)
    .catch(err => new ({
      log: 'An error occurred generating salt in signupController.createUser',
      message: { err: `${err}` }
    }));

  //hash password
  const newHash = await bcrypt.hash(password, newSalt)
    .then(hash => hash)
    .catch(err => new ({
      log: 'An error occurred generating the hash in signupController.createUser',
      message: { err: `${err}` }
    }));


    //prep query
    const query = `INSERT INTO user_info (email, password) VALUES ('${email}', '${newHash}') RETURNING _id;`

    //add new user to query
    const addUser = db.query(query)
      .then(data => {
        //return new user info -> currently set to user _id pending future features
        res.locals.signupStatus = { result: data.rows[0]._id };
        return next();
      })
      .catch(err => next({
        log: 'An error occurred adding the new user',
        message: { err: `${err}` } 
      }))
}

//export module
module.exports = signupController;