const db = require('../models/activityModel');


const checkoutController = {};

//define getAllTable data method
checkoutController.getAllTableData = async (req, res, next) => {
 
  const { time_unit, activity } = req.body

  dayQuery = `tbd`;
  weekQuery = `tbd`;
  monthQuery = `tbd`;
  yearQuery = `tbd`;

  const timeTypes = {
    day: dayQuery,
    week: weekQuery,
    month: monthQuery,
    year: yearQuery,
  }

  //check data types
  if (typeof time_unit !== 'string' || !timeTypes[time_unit]) {
    return next({
      log: 'Error in checkoutController.getAllTableData, time_unit datatype is incorrect',
      message: { err : "time_unit is wrong datatype or is not an accepted time type" }
    })
  }

  //if string is defined but is not a string return next to error
  if(activity && typeof activity !== 'string'){
    return next({
      log: 'Error in checkoutController.getAllTableData, activity datatype is incorrect',
      message: { err : "activity is wrong datatype" }
    })
  }

  //create query variable
  const text = timeTypes[time_unit];

  // Execute the SQL query and store the result in the 'result' variable
  const result = await db.query(text)
    .then(data => data)
    .catch(err => next({
      log: 'An error occured when querying the database in checkoutController.getAllTableData',
      message: { err: `${err}` }
    }));
    
  console.log('result of query', result);

  // Create a property called 'timecard' on the res.locals object, assign it the rows property (which is an array of objects) of the result object on line 16
  // res.locals.timecard = result.rows;
    
  // Take the last ids endtime the first ids start time and subtract to get the total hours
  // const totalHours = res.locals.timecard[res.locals.timecard.length - 1].endtime - res.locals.timecard[0].starttime;
  //push totalHours variable into the end of the res.locals.timecard array
  // res.locals.timecard.push({ total: totalHours });

  // console.log('totalHours is: ', totalHours);
  // console.log('res.locals.timecard is: ', res.locals.timecard);
  //continue to the next middleware function
  return next();
};

//export module
module.exports = checkoutController;