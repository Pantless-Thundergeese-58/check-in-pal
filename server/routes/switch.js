const express = require('express');

const switchController = require('../controller/switchController');

const router = express.Router();

//handles post request with middleware
router.post('/', switchController.postActivity, (req, res) => {
  res.status(200).json(res.locals.timerid);
});

//export module
module.exports = router;