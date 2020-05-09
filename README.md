## 使用 LEGO 快速搭建后台

- LEGO 拥有丰富的内建模块，可在数分钟内搭建强大的后台界面
- 支持表单、列表、图表和面板四大模块，通过组合实现丰富的后台功能

## 部署

1. 确保服务器已安装 Nodejs、Yarn 和 pm2
2. 下载 release 最新版解压到相应目录
3. 安装依赖：根目录执行`yarn --prod`
4. 启动服务：根目录执行`pm2 start server`

## 自定义构建

LEGO 默认以`/lego/`为页面前缀，`/lego-src/`为资源前缀，如有需要可自行修改：

1. 安装依赖`yarn`
2. 修改`.env`配置
3. 执行`yarn release`构建
4. 重启`pm2 restart server`

- `REACT_APP_PRE` 页面前缀，必须以`/`开头，结尾没有，如`/lego`
- `PUBLIC_URL` 静态资源前缀，**资源前缀不得与页面前缀一样**，如`/lego-src`
- `SERVER_PORT` 服务端口，默认**8081**

## Nginx

如果使用 nginx 代理请将`/lego`转发到相应服务（比如 proxy_pass http://127.0.0.1:8081）

## 二次开发

run `yarn start` and `node server` for develop
