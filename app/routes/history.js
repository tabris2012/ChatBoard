const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const root_path = '/data/chat_history/';

/* Rename history. */
router.post('/rename', function(req, res, next) {
  const fromPath = root_path+req.body.fromPath;
  const toPath = root_path+req.body.toPath;
  const dirname = path.dirname(fromPath);
  console.log(fromPath);
  console.log(toPath);

  try {
    fs.renameSync(fromPath, toPath);
  } catch (err) {
    if (err.code === 'ENOENT') res.status(200).send('ENOENT');
    return;
  }
  
  res.status(200).send('rename');
});

/* Delete history. */
router.post('/delete', function(req, res, next) {
  const filepath = root_path+req.body.path;
  const dirname = path.dirname(filepath);
  console.log(filepath);

  try {
    fs.statSync(filepath);
    fs.unlinkSync(filepath);
  } catch (err) {
    if (err.code === 'ENOENT') res.status(200).send('ENOENT');
    return;
  }
  
  res.status(200).send('deleted');
});

/* Load history. */
router.post('/load', function(req, res, next) {
  const filepath = root_path+req.body.path;
  const dirname = path.dirname(filepath);

  try {
    fs.statSync(dirname);// 親フォルダの存在確認
  } catch (err) {
    fs.mkdirSync(dirname); //同期作成->フォルダ作成後に書き込み
  }
  
  fs.readFile(filepath, 'utf-8', function (err,data) {
    if (err) { //ファイルが存在しなければ新規作成
      fs.writeFile(filepath,"");
      res.status(200).send("");
      return;
    }

    const text = data.replace(/\n/g, '<br>');  //brタグを変換
    res.status(200).send(text);
  });
});

/* Save history. */
router.post('/', function(req, res, next) {
  const filepath = root_path+req.body.path;
  const data = req.body.data;
  const text = data.replace(/^\s+|\s+$/g,'').replace(/ +/g,' ').replace(/(<br>|<br \/>)/gi, '\n');  // 前後の空白文字を取り除く、連続する半角スペースを１つにまとめる、brタグを変換

  fs.appendFile(filepath, text, function (err,data) {
    res.status(200).send('save');
  });
});

module.exports = router;
