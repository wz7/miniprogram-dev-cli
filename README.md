# miniprogram-dev-cli

是一个小程序跨平台工具库，同时也是小程序跨平台工具的开发脚手架。可以开发一份代码之后根据用户所需配置进行适配多端代码，并且在用户 install 小程序后会自动删除多余的其它平台代码。

## 目录划分

```
|- packages: 源码放置目录
|-- authorize: 项目目录
|--- dist: 打包后的目录，不同小程序会在对应平台名目录下
|- scripts: 脚本文件
```

## 单个包配置

配置写在 packages 目录下的项目 package.json 文件中

```
buildConfig:{
  platforms: ["wx", "tt", "my", "xhs"]
}
```

## 启动命令

```
pnpm run build [package1, [package2]]
```
