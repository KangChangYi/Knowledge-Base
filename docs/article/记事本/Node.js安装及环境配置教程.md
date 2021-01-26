# Windows 下 Node.js 安装及环境变量配置教程
每次换台电脑都要重新安装 Node.js，记性也不太好我就自己写一个吧。

## 第一步 下载 Node.js
打开 [Node.js 官网](https://nodejs.org/zh-cn/)，直接下载首页的当前稳定版安装包。

## 第二步 安装 Node.js
打开安装包，全点下一步，自选安装目录，别在 C 盘。

<img src="/images/Node初始化/node-install.png" width="300">

## 第三步 创建并设置全局依赖、依赖缓存文件夹
在 Node 根目录下，新建：

<img src="/images/Node初始化/node-dir.png" width="220" alr="node 全局文件夹">

然后命令行输入：

```sh
npm config set prefix "node_global 的文件路径"
npm config set cache "node_cache 的文件路径"
```

## 第四步 配置环境变量

1. 在系统变量中新增 NODE_PATH

<img src="/images/Node初始化/node-sys-var.png" width="400">

2. 编辑用户变量中的 path，修改 APPData/Roaming\npm，或新增一条为 node_global 文件夹的路径

<img src="/images/Node初始化/node-user-var.png" width="400">

完成









