# 关于本项目的介绍

## 本项目为个人自定的，打包vue的webpack的配置文件

### 在config目录下有三个文件

- webpack.dev.js：开发环境

- webpack.prod.js：生产环境

- webpack.config.js：开发环境和生产环境融合的版本

### 在package.json的命令之中已经配置

- npm run dev：运行webpack.dev.js

- npm run build：运行webpack.prod.js

- npm run dev:config：运行webpack.config.js 开发模式

- npm run build:config：运行webpack.config.js 生产模式



### 关于webpack的配置说明

- webpack配置了css，less，sass/scss，stylus，babel，svg，eslint配置文件
- 加入prettier husky
- 关于资源，这里只配置了图片，没有配置音频，视频，图片分为两种1，一种是png，jpg，jpeg，webp，使用的是默认的webpack的assets进行的配置，上述四种类型的图片我没有使用压缩，只是配置了小于10kb变为base64形式，因为我在webpack官网找到的imagemin的压缩图片的包我下载不下来
- svg格式图片使用了两种配置，一种是配置普通的svg，使用svg-loader进行压缩，还有一种是svg精灵图，svg精灵图的所有文件需要放在icons文件夹里面，
- 该版本为js版本
- 生产版本默认配置了cdn链接，包含vue3，vue-router，element-plus，element-plus在这里使用的是自动导入，其中关于主题的配置文件在src文件夹下面的styles/element/index.scss，我是按照element-plus官方进行配置的



