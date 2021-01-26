# Jenkins 自动化部署博客

使用 github + jenkins 实现自动化部署

## 安装 Java 环境
```shell
yum install java

java -version
```

## 安装 git
```shell
yum install git

git --version
```

## 安装 jenkins
我这里直接将 jenkins 安装在了本地，没有用 docker 镜像部署 jenkins。

第一次安装，需要导入 jenkins key，否则会无法找到 jenkins package。

```shell
wget -O /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat-stable/jenkins.repo
rpm --import https://pkg.jenkins.io/redhat-stable/jenkins.io.key
```

然后安装 jenkins 

```shell
yum -y install jenkins
```

## 启动 jenkins
```shell
service jenkins start
```

启动完成后，使用 ip + 8080 端口访问，若无法访问，检查 8080 端口是否被占用，或者防火墙是否开放 8080 端口。

## 配置 jenkins 权限

```shell
vi /etc/sysconfig/jenkins

编辑并保存：
JENKINS_USER="root"
```

## Github SHH
生成服务器的公钥，添加到 Github SSH 中，以便正常拉取代码。

```shell
ssh-keygen -t rsa -C "***@qq.com"
```

## 配置 jenkins
在浏览器中打开 jenkins 后，创建用户。

安装插件：
+ chinese （中文）
+ Git
+ Git server
+ Generic Webhook Trigger Plugin （用于触发 webhook 构建）

新建任务后，进入任务设置 -> 源码管理，进行配置。

### 配置 git 仓库地址
![任务源码管理](/images/devOps/jenkins-git.png)

### 从 Github 中获取 token
先上到 Github。

1. 进入 setting -> develop settings

![developSettings](/images/devOps/github-token.png)

2. 创建 token

介绍随意写，勾选 `repo` 和 `admin:repo_hook` 选项后保存即可，记得保存 token，丢了就没了。

![createToken](/images/devOps/github-token2.png)

3. 进入 jenkins 配置 token。

我这里选择的插件是 `Generic Webhook Trigger`，下方 token 中填入刚才 Github 创建的 token，这里的加粗目录，用来后面创建 webhook。

![触发构建钩子](/images/devOps/jenkins-hook2.png)

4. 进入项目仓库地址 -> settings -> webhooks
新增一个 webhook。按照要求填上链接地址即可。

![触发构建钩子](/images/devOps/github-webhook.png)

5. 测试一下， push 一个 commit，测试 webhook 是否成功发送请求，如果成功了，webhook 左边会有绿色的小勾。（还是有小概率会失败的，可能是 Github 网络问题）

### 编写jenkins 执行脚本
![jenkins shell](/images/devOps/jenkins-shell.png)

提交代码 -> 触发 webhook 请求 -> jenkins 构建，一气呵成，大功告成。

## 坑点
1. jenkins shell 脚本执行时，一直报 command not found，原因是环境变量和本机不一样。

解法就是在 jenkins 系统设置里加上环境变量：

键：PATH
值: /usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin

网上有其他一些解法，比如加上：
```
#!/bin/sh -li
<!-- 或者 -->
source /etc/profile
```
全都不行。