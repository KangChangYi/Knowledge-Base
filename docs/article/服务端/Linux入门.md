# Linux 基础

## SSH 安装
为了方便的连接远程服务器，先安装一个 SSH，没有 Mac，Windows 推荐这个 [Mobaxterm](https://mobaxterm.mobatek.net/)。功能强大，也不花钱。

## 在 CentOS 中 安装 node.js

### 1. 下载 node.js 安装包
+ 根目录新建一个 app 文件夹，用来存放应用程序。
+ 进入 node.js 官网，复制 node.js 的 Linux x64 位下载链接，在 shell 中输入：
```sh
wget https://npm.taobao.org/mirrors/node/v12.16.1/node-v12.16.1-linux-x64.tar.xz
```

<!-- wget 详解  -->


![下载 node 安装包](/images/Linux/install-node.png)

### 2. 解压 node.js 安装包
+ 下在完成后目录中多了一个 tar.xz 文件，下一步进行解压。
+ 解压 tar.xz 的压缩包分为两步
```sh 
 // 第一步，解压 xz：
 xz -d node-v12.16.1-linux-x64.tar.xz 

 // 第二步，解压 tar：
 tar -xvf node-v12.16.1-linux-x64.tar
```
<img src="/images/tar-node.jpg" width = "50%" alt="解压 node 安装包" />

<!-- xz 压缩文件解压详解  gz 压缩文件解压详解 -->


### 3.  建立软连接
这里遇到个血坑，在使用`ln -s` 建立软连接的时候，目标路径如果和源路径不同，则需要使用绝对路径，否则无法生效，所以建议在建立软连接的时候，总是使用绝对路径进行创建。

+ 建立软件列命令：
```sh
// node
ln -s /app/node-v12.16.1-linux-x64/bin/node /usr/local/bin
// npm
ln -s /app/node-v12.16.1-linux-x64/bin/npm /usr/local/bin
```
建立完成后使用查看对应版本，出现版本号表示安装成功。
![查看 node & npm 版本](/image/Linux/node-npm-version.png)


<!-- ln -s 详解 -->


## 在 Linux 中安装 nginx 
### 安装 nginx 的依赖

+ 安装 pcre
1. 在网上找到 pcre 安装包，下载并解压到目录中。
```sh
wget ...
tar -xvf ...
```
2. 进入 pcre 目录，使用 ./configure 检查必要文件依赖，若出现 error，则安装对应依赖。
3. 然后使用 make ** make install 进行编译安装。
4. 安装之后使用 pcre-config --version 查看版本号


+ 安装 zlib
1. 方便起见直接使用 yum 命令：
```sh
yum -y install zlib zlib-devel
```

+ 安装 gcc gcc-c++ 
```sh
yum -y install gcc gcc-c++ 
```

+ 安装 openssl
```sh
yum -y install openssl openssl-devel
```

+ 安装 nginx
1. 下载并解压安装文件。
2. 执行 ./configue 检查完整性
3. 使用 make && make install 安装
```sh
# 相关命令如下：
wget
tar -xvf
./configue
make && make install
```



### 防火墙相关命令
```sh
// 查看防火墙是否运行
firewall-cmd --state
// 查看/关闭/启动/禁止开机启动 防火墙
systemctl (status/stop/start/disable) firewalld.service
// 防火墙开放 8001 端口
firewall-cmd --add-port=端口号/tcp --permanent

命令含义为：
// –add-port=8001/tcp #添加端口，格式为：端口/通讯协议
// –permanent #永久生效，没有此参数重启后失效
// 开启端口后，重启防火墙生效
firewall-cmd --reload
```