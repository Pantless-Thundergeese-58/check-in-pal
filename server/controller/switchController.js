const db = require('../models/activityModel');

//create empty controller object
const switchController = {};

//create postActivity function
switchController.postActivity = async (req, res, next) => {

  const { activity, startTime, user_id } = req.body;

  if (typeof activity !== 'string' || typeof startTime !== 'string' || typeof user_id !== 'number') {
    return next({
      log: 'Error in switchController.postActivity destructuring data',
      message: { err: `wrong data types passed in` }
    })
  }

 //Try & catch block
  try {
//  SQL method to insert data into the time_card table   
    const text = `
    INSERT INTO time_card (user_id, activity, startime)
    VALUES ($1, $2, $3)
    RETURNING id;
    `;

//create a variable that holds the params values
    const params = [user_id, activity, startTime];
    //Query the result
    const result = await db.query(text, params)
      .then(data => data.rows[0].id)
      .catch(err => next({
        log: 'Error in switchController.postActivity when creating data entry',
        message: { err: `${err}` }
      }));


    //extract row id from result
    res.locals.timerid = { result: result }

    //allow for the middleware function to continue to next function/middleware
    next();
  }
  //catch error handler
  catch(err) {
    next({
      log: 'Express error handler caught in switchController.postActivity middleware',
      status: 400,
      message: { err: 'Failed to insert to database' }
    });
  }

};

//export module
module.exports = switchController;
