# ベースイメージを指定
# alpine は 軽量の linux OS
FROM node:8.12.0-alpine

# node.js の環境変数を定義する
# 本番環境では production
ENV NODE_ENV=development

# ディレクトリを移動する
WORKDIR /app

