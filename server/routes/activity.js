const express = require('express');

const activityController = require('../controller/activityController');

const router = express.Router();


// Route that handles patch request to the SQL database, updating the end time of an activity before switching to a new one
router.patch('/', activityController.updateEndtime, (req, res) => {
  res.status(200).json("entry complete");
});

module.exports = router;