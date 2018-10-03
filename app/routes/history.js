var express = require('express');
var router = express.Router();
const fs = require('fs');

const root_path = '/data/chat_history/';
const filename = 'test_history';

/* Load history. */
router.post('/load', function(req, res, next) {
  const filepath = root_path+filename;
  
  fs.readFile(filepath, 'utf-8', function (err,data) {
    const text = data.replace(/\n/g, '<br>');  //brタグを変換
    res.status(200).send(text);
  });
});

/* Save history. */
router.post('/', function(req, res, next) {
  const filepath = root_path+filename;
  const data = req.body.data;
  const text = data.replace(/^\s+|\s+$/g,'').replace(/ +/g,' ').replace(/(<br>|<br \/>)/gi, '\n');  // 前後の空白文字を取り除く、連続する半角スペースを１つにまとめる、brタグを変換

  fs.appendFile(filepath, text, function (err,data) {
    res.status(200).send('save');
  });
});

module.exports = router;
