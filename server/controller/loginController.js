//require bcrypt
const bcrypt = require('bcrypt');
const saltRounds = 10;

//require database
const db = require('../models/activityModel');

const loginController = {};

loginController.checkForUser = async (req, res, next) => {

  //destructure req.body
  const { email } = req.body;

   //check data types of passed in information
   if(typeof email !== 'string') return next({
    log: 'Error in loginController.checkForUser, email needs to be a string',
    message: { err: 'email not a string' }
  });

  //prep query
  const query = `SELECT email FROM user_info WHERE email = '${email}';`;

  //check database for passed in email
  const check = await db.query(query)
    .then(data => data)
    .catch(err => next({
      log: 'An error occurred in the query in loginController.checkForUser',
      message: { err: `${ err }` }
    }));
  
  //if there are no emails of the same name set check var to false
  if(check.rows.length === 0) {
    res.locals.checkStatus = false;
  } else {
    res.locals.checkStatus = true;
  }
  
  return next();
};

loginController.loginUser = async (req, res, next) => {

  //check results from checkForUser and if false invoke next middleware
  if(res.locals.checkStatus === false) {
    res.locals.loginStatus = { result: "signup"}
    return next()
  };

  //destructure body
  const { email, password } = req.body;
  
  //check data type of password
  if(typeof password !== 'string') return next({
    log: 'Error in signupController.checkForUser, password needs to be a string',
    message: { err: 'password not a string' }
  });

  //create query to get hashed password
  const query = `SELECT _id, password FROM user_info WHERE email = '${email}'`;

  //retrieve hashed password and _id
  const userInfo = await db.query(query)
    .then(data => data.rows[0])
    .catch(err => next({
      log: 'An error occurred in the query in loginController.loginUser',
      message: { err: `${ err }` }
    }));

  //compare entered password and hashed password
  const testPass = await bcrypt.compare(password, userInfo.password)
    .then(data => data)
    .catch(err => next({
      log: 'An error occurred when checking the password in loginController.loginUser',
      message: { err: `${ err }` }
    }));

  if(testPass) {
    res.locals.loginStatus = { result: userInfo._id };
  } else {
    res.locals.loginStatus = { result: false };
  };
  
  return next();
};



module.exports = loginController;