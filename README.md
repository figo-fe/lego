## 使用 LEGO 快速搭建后台

- LEGO 拥有丰富的内建模块，可在数分钟内搭建强大的后台界面
- 支持表单、列表、图表和面板四大模块，通过组合实现丰富的后台功能

## 构建和部署

1. 确保服务器已安装 Nodejs、Yarn 和 pm2
2. 在根目录执行`yarn && yarn build`安装依赖并构建
3. 在根目录执行`pm2 start server`启动服务（默认 8081 端口）

## 自定义构建

默认情况下页面以`/lego/`为前缀，静态资源以`/lego-src/`为前缀，如有需要可自行修改：

1. 修改`.env`配置
2. 执行`yarn build`，重启服务

- `REACT_APP_PRE` 页面前缀，必须以`/`开头，结尾没有
- `PUBLIC_URL` 静态资源前缀，**资源前缀不得与页面前缀冲突**

修改后执行`yarn build`进行构建，之后`pm2 start server`启动服务

## 修改服务端口

修改`server/index.js`最后一行 `app.listen(8081)`，将 8081 改为你需要的端口

## Nginx

如果使用 nginx 代理请将`/lego`转发到相应服务（比如 proxy_pass http://127.0.0.1:8081）

## 二次开发

run `yarn start` and `node server` for develop
