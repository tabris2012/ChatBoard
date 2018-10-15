const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const root_file = '/data/favorite/favorite.json';

/* Save favorite json. */
router.post('/save', function(req, res, next) {
  const data = req.body.data;

  fs.writeFile(root_file, JSON.stringify(data), function (err,data) {
    res.status(200).send('save');
  });
});

/* Get favorite list */
router.post('/', function(req, res, next) {
  const dirname = path.dirname(root_file);

  try {
    fs.statSync(dirname);// 親フォルダの存在確認
  } catch (err) {
    fs.mkdirSync(dirname); //同期作成->フォルダ作成後に書き込み
  }

  fs.readFile(root_file, 'utf-8', function (err,data) {
    if (err) { //ファイルが存在しなければ新規作成
      fs.writeFile(root_file,"");
      res.status(200).json("[]");
      return;
    }

    res.status(200).json(JSON.parse(data || "[]"));
  });
});

module.exports = router;
