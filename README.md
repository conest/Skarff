# Skarff

| 当前版本 |
| --- |
| 0.2.3 |

Skarff是一个基于Nodejs, koa的Web服务器框架。

提供了基础常用的设置。独立出了路由，模版。默认配置好了简单的log输出，以此可以快速地开始对于网站的建设。

包含的基础组件：

  - 路由 router
  - body解析 bodyparser
  - 静态文件解析 static
  - 日志 morgan
  - 基础安全防护 helmet
  - 压缩 compress
  - session

## 安装

### 安装nodejs

官网: https://nodejs.org

### 克隆skarff文件

```sh
$ git clone git@github.com:Corvusnest/skarff.git
```

### 安装app所需求的包

```sh
$ cd server
$ npm install
```

## 运行

```sh
$ node server/app.js
```

生产环境请使用持久化方式，比如screen或者pm2。

## 配置

配置文件为: setting.yml
