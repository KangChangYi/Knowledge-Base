# 自动化部署博客(docker)

> 2021-1-17 17:45

原本服务器快到期了，就重新换了一个服务器，得重新部署博客，上次没有用到 docker，这次试试。

使用 github + jenkins + docker 自动化部署博客

## 安装并运行 jenkins docker 镜像

```sh
docker run \
  -d \
  --name kcyjenkins \
  -u root \
  -p 8080:8080 \
  -p 50000:50000 \
  -v /var/jenkins-data:/var/jenkins_home \
  -v /run/docker.sock:/var/run/docker.sock \
  -v /usr/bin/docker:/usr/bin/docker \
  jenkins/jenkins
```

指令解析：
+ -d：后台运行容器
+ --name：指定容器名称
+ -u root：设置 root 权限等级
+ -p：端口映射
+ -v *：把主机目录挂载到容器指定目录下

**注意一**：上面挂载进容器的目录需要确认是否存在，docker.sock 以及二进制文件挂载进容器给容器使用，docker in docker，套娃。

**注意二**：官方的 jenkins 镜像版本太低，会有插件无法安装的问题，所以用 jenkins/jenkins 镜像，也是官方维护的。

## 配置 jenkins
浏览器打开 `服务器地址+8080` 端口，等待 jenkins 安装完成，从挂载的目录下获取初始管理员密码，输入后即可进入，之后安装插件、创建用户。

![等待 jenkins 安装](/images/devOps/watingJenkins.png)
![输入初始密码](/images/devOps/jenkinsPassword.png)
![jenkins 安装插件](/images/devOps/jenkins-installPlugins.png)
![jenkins 创建用户](/images/devOps/jenkins-createUser.png)

新建项目和使用 webhook 的过程和上次一样。

## 配置 Node 环境
首先安装 nodejs 插件，然后进入 `Manage Jenkins -> Global tool configuration`，进行如下配置：

![jenkins Nodejs 环境配置](/images/devOps/jenkins-nodeenv.png)

为任务添加 Nodejs 构建环境，否则会报 node not found。
![jenkins shell](/images/devOps/jenkins-shellnew.png)

## 编写 shell 脚本
![jenkins shell](/images/devOps/jenkins-shellnew.png)

## dockerfile
![jenkins shell](/images/devOps/jenkins-dockerfile.png)

## nginx.conf
![jenkins shell](/images/devOps/jenkins-nginxconf.png)

改完域名解析，再次大功告成 🎉🎉🎉

<!-- webhook token 4734ec8cfd803f1c5f0e6ad3698850d5f29d8b66 -->
<!-- http://JENKINS_URL/generic-webhook-trigger/invoke -->