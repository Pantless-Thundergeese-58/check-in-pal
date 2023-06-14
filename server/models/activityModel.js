const { Pool } = require('pg');
const activityController = require('../controller/switchController');

const PG_URI = 'postgres://dygozsvp:XE02itOmtw-KZzpUCn_yXJccPjNJbJmP@mahmud.db.elephantsql.com/dygozsvp';

// create a new pool here using the connection string above
const pool = new Pool({
  connectionString: PG_URI
});

// Adding some notes about the database here will be helpful for future you or other developers.
// Schema for the database can be found below:

// We export an object that contains a property called query,
// which is a function that returns the invocation of pool.query() after logging the query
// This will be required in the controllers to be the access point to the database
module.exports = {
  query: (text, params, callback) => {
    console.log('executed query', text);
    return pool.query(text, params, callback);
  }
};
