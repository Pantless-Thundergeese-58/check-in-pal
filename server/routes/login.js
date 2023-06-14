const express = require('express');

//import controller

const router = express.Router();

//route handlers
router.post('/', (req, res) => {
  return res.status(200).json('TBD');
})

module.exports = router;