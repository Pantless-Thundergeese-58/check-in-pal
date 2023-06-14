const express = require('express');

const loginController = require('../controller/loginController');

const router = express.Router();

//route handlers
router.post('/', loginController.checkForUser, loginController.loginUser, (req, res) => {
  return res.status(200).json(res.locals.loginStatus);
})

module.exports = router;