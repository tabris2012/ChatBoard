# ChatBoard
チャットウィンドウと履歴保存

## React環境づくり
- https://loner.jp/nodejs-express-react-materialui-develop#webcreate-react-api
```
# npm install -g create-react-app
# create-react-app web
```
- `web`フォルダからコピー
    - `src`,`public`フォルダ
    - `package.json`の内容をコピー
    - `node_modules/.bin`フォルダ（react-scriptsを呼び出すのに必要？）
- MaterialUIインストール
```
# npm install --save @material-ui/core @material-ui/icons
```

## Memo
- windowsローカルではパス長制限に引っ掛かりnpm installが失敗する
    - コンテナ内にフォルダを作り、node_modulesの代わりに使う
    - http://jjtake.hatenablog.jp/entry/2017/10/22/004650
    ```
    # mount --bind [コンテナ内フォルダ] ./node_modules/
    # npm install
    # umount ./node_moduels/ # Invalid argumentエラーは無視できる
    # cp -r [コンテナ内フォルダ]/* ./node_modules/ #マウント解除後に中身をコピー