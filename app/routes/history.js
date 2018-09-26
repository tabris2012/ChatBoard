var express = require('express');
var router = express.Router();
const fs = require('fs');

const root_path = '/data/chat_history/';
const filename = 'test_history';

/* Save history. */
router.post('/', function(req, res, next) {
  const filepath = root_path+filename;
  const data = req.body.data;

  fs.appendFile(filepath, data);
});

module.exports = router;
