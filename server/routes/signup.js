const express = require('express');

const signupController = require('../controller/signupController');

const router = express.Router();

//route handlers
router.post('/', signupController.checkForUser, signupController.createUser, (req, res) => {
  return res.status(200).json(res.locals.signupStatus);
})

module.exports = router;