import express from 'express';
// var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('index');
});

export default router;
// module.exports = router;