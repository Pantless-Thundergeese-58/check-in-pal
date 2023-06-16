const db = require('../models/activityModel');

const checkoutController = {};

//define getAllTable data method
checkoutController.getAllTableData = async (req, res, next) => {
  const { user_id, time_unit, activity } = req.body;

  //beginning of queries that DO NOT take activity arguments
  const dayQuery = `WITH day_table AS
  (
    SELECT
    to_char(startime, 'Day') AS day,
    startime,
    user_id,
    activity,
    endtime,
    EXTRACT(EPOCH FROM (endtime - startime)) / 60 AS duration_minutes,
    duration
    FROM time_card
    WHERE startime >= DATE(now()) - interval '7 days' 
      AND startime <= now() 
      AND user_id = ${user_id}
    )
    
    SELECT day,
    activity,
    sum(duration_minutes) AS duration
    FROM day_table
    GROUP BY day, activity;`;

  const weekQuery = `WITH week_table AS
    (
    SELECT
    EXTRACT(week FROM now()) - EXTRACT(week FROM startime) AS weeksAgo,
    startime,
    user_id,
    activity,
    endtime,
    EXTRACT(EPOCH FROM (endtime - startime)) / 60 AS duration_minutes,
    duration
    FROM time_card
    WHERE startime >= DATE(now()) - interval '4 weeks' - (DATE_PART('isodow', NOW()) || ' ' || 'days')::interval
      AND startime <= now() 
      AND user_id = ${user_id}
    )    

    
    SELECT weeksAgo,
    activity,
    sum(duration_minutes) AS duration
    FROM week_table
    GROUP BY weeksAgo, activity;`;

  const monthQuery = `WITH month_table AS
    (
    SELECT
    to_char(startime, 'Month') AS month,
    startime,
    user_id,
    activity,
    endtime,
    EXTRACT(EPOCH FROM (endtime - startime)) / 60 AS duration_minutes,
    duration
    FROM time_card
    WHERE startime >= DATE_TRUNC('year', NOW()) 
      AND startime <= now() 
      AND user_id = ${user_id}
    )

    SELECT month,
    activity,
    sum(duration_minutes) AS duration
    FROM month_table
    GROUP BY month, activity`;

  const yearQuery = `WITH year_table AS
    (
    SELECT
    EXTRACT(year FROM startime) AS year,
    startime,
    user_id,
    activity,
    endtime,
    EXTRACT(EPOCH FROM (endtime - startime)) / 60 AS duration_minutes,
    duration
    FROM time_card
    WHERE startime <= now() 
      AND user_id = ${user_id}
    )

    SELECT year,
    activity,
    sum(duration_minutes) AS duration
    FROM year_table
    GROUP BY year, activity`;

  //beginning of queries that DO take activity arguments
  const dayActQuery = `WITH day_table AS
    (
      SELECT
      to_char(startime, 'Day') AS day,
      startime,
      user_id,
      activity,
      endtime,
      EXTRACT(EPOCH FROM (endtime - startime)) / 60 AS duration_minutes,
      duration
      FROM time_card
      WHERE startime >= DATE(now()) - interval '7 days' 
        AND startime <= now() 
        AND user_id = ${user_id}
        AND activity = '${activity}'
      )
      
      SELECT day,
      activity,
      sum(duration_minutes) AS duration
      FROM day_table
      GROUP BY day, activity;`;

  const weekActQuery = `WITH week_table AS
    (
    SELECT
    EXTRACT(week FROM now()) - EXTRACT(week FROM startime) AS weeksAgo,
    startime,
    user_id,
    activity,
    endtime,
    EXTRACT(EPOCH FROM (endtime - startime)) / 60 AS duration_minutes,
    duration
    FROM time_card
    WHERE startime >= DATE(now()) - interval '4 weeks' - (DATE_PART('isodow', NOW()) || ' ' || 'days')::interval
      AND startime <= now() 
      AND user_id = ${user_id}
      AND activity = '${activity}'
    )    

    
    SELECT weeksAgo,
    activity,
    sum(duration_minutes) AS duration
    FROM week_table
    GROUP BY weeksAgo, activity;`;

  const monthActQuery = `WITH month_table AS
    (
    SELECT
    to_char(startime, 'Month') AS month,
    startime,
    user_id,
    activity,
    endtime,
    EXTRACT(EPOCH FROM (endtime - startime)) / 60 AS duration_minutes,
    duration
    FROM time_card
    WHERE startime >= DATE_TRUNC('year', NOW()) 
      AND startime <= now() 
      AND user_id = ${user_id}
      AND activity = '${activity}'
    )

    SELECT month,
    activity,
    sum(duration_minutes) AS duration
    FROM month_table
    GROUP BY month, activity`;

  const yearActQuery = `WITH year_table AS
    (
    SELECT
    EXTRACT(year FROM startime) AS year,
    startime,
    user_id,
    activity,
    endtime,
    EXTRACT(EPOCH FROM (endtime - startime)) / 60 AS duration_minutes,
    duration
    FROM time_card
    WHERE startime <= now() 
      AND user_id = ${user_id}
      AND activity = '${activity}'
    )

    SELECT year,
    activity,
    sum(duration_minutes) AS duration
    FROM year_table
    GROUP BY year, activity`;

  //reference when activity is undefined
  const timeTypes = {
    day: dayQuery,
    week: weekQuery,
    month: monthQuery,
    year: yearQuery,
  };

  //reference when activity is defined
  const timeTypesAct = {
    day: dayActQuery,
    week: weekActQuery,
    month: monthActQuery,
    year: yearActQuery,
  };

  //check data types
  if (typeof time_unit !== 'string' || !timeTypes[time_unit]) {
    return next({
      log: 'Error in checkoutController.getAllTableData, time_unit datatype is incorrect',
      message: {
        err: 'time_unit is wrong datatype or is not an accepted time type',
      },
    });
  }

  //if string is defined but is not a string return next to error
  if (activity && typeof activity !== 'string') {
    return next({
      log: 'Error in checkoutController.getAllTableData, activity datatype is incorrect',
      message: { err: 'activity is wrong datatype' },
    });
  }

  if (typeof user_id !== 'number' || !user_id) {
    return next({
      log: 'Error in checkoutController.getAllTableData, username is incorrect',
      message: { err: 'username is wrong datatype or undefined' },
    });
  }

  //create query variable
  let text;
  if (activity) {
    text = timeTypesAct[time_unit];
  } else {
    text = timeTypes[time_unit];
  }

  // Execute the SQL query and store the result in the 'result' variable
  const result = await db
    .query(text)
    .then((data) => data.rows)
    .catch((err) =>
      next({
        log: 'An error occured when querying the database in checkoutController.getAllTableData',
        message: { err: `${err}` },
      })
    );

  res.locals.stats = result;

  return next();
};

//export module
module.exports = checkoutController;
