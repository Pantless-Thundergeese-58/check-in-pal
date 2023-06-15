const db = require('../models/activityModel');


const activityController = {};

// Updates 'endtime' column of a particular row in the table
activityController.updateEndtime = async (req, res, next) => {
  // Get the endtime from the req object that is sent from the client/front end
  const { timer_id, endTime } = req.body;
  
  if (typeof timer_id !== 'number' || typeof endTime !== 'string') {
    return next({
      log: 'Error in activityController.updateEndtime destructuring data',
      message: { err: `wrong data types passed in` }
    })
  }

  // SQL query string for the patch request
  //create endtime query
  const text1 = 
  `UPDATE time_card
  SET endtime = $1
  WHERE id = $2;`;

  //create duration query
  const text2=
  `UPDATE time_card
  SET duration = (endtime - startime)
  WHERE id = ${timer_id}`;
    
  // Array params that dynamically assigns the value on line 15 for the SET part of the SQL query
  const params = [endTime, timer_id];

  // Store the result of the db query asynchronously in the result constant.
  const query1 = await db.query(text1, params)
    .then(data => data)
    .catch(err => next({
      log: 'Error in activityController.updateEndtime when creating data entry',
      message: { err: `${err}` }
    }))

  const query2 = await db.query(text2)
    .then(data => data)
    .catch(err => next({
      log: 'Error in activityController.updateEndtime when creating data entry',
      message: { err: `${err}` }
    }))

  return next();
 };
  

module.exports = activityController;