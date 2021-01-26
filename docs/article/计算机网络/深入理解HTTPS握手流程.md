# 『深入 TCP/IP 系列』 HTTPS 的通信流程

> 2020-12-19 15:12
## 一、什么是 HTTPS

HTTP + SSL/TLS = HTTPS

HTTPS 采用非对称加密和对称加密结合以及证书认证的方式，保证 HTTP 数据传输的安全。

> TLS 是 SSL 3.0 协议的升级版，3.0 之后就改为使用 TLS

## 二、HTTPS 解决了 HTTP 的哪些问题

1. 数据明文传输，通信过程被监听
2. 无法验证通信方身份，易遭受中间人攻击
3. 无法验证报文完整性，数据被中间人篡改

## 三、HTTPS 如何解决这些问题

HTTP 和 HTTPS 的不同点其实就是 SSL/TLS 这一层，SSL/TLS 到底做了些什么，可以解决上面的三个安全问题？

想要完全弄懂  HTTPS，就需要深入 openSSL、TLS/SSL 和密码学，是另外一套非常庞大的知识体系。所以这里只对 HTTPS 链接建立过程的进行探索和展开。

+ 注意：本文是基于 TLS 1.2 且密钥协商算法为 RSA 的版本，不同版本、密钥协商算法握手流程不同。

## 四、HTTPS 链接建立过程（TCP 三次握手 + SSL 握手）

### 1. TCP 三次握手

TCP 三次握手建立通信连接，这步可以不算在 HTTPS 连接建立过程中，但是要知道，它在一定在 HTTPS 建立连接之前

### 2. Client Hello

第一步，客户端向服务端发送 `Client Hello` 消息，表示请求建立 HTTPS 连接，其中包含了客户端的：

+ SSl/TLS 的版本
+ 生成的一个随机数 `Random1`
+ 支持的加密套件
+ 要访问的域名
+ 压缩算法

### **3. Server Hello**
第二步，服务端向客户端发送 `Server Hello` 消息，包含了：

1. 从 `Client Hello` 传来的加密套件中确定一份加密套件，该套件决定了后续加密和生成摘要时具体使用哪些算法，
2. 生成一个随机数 `Random2`，（`Random1` 和 `Random2` 用于后续生成对称秘钥）

### **4. Server Certificate、Server Key Exchange、Server Hello Done**

在紧接着 `Server Hello` 之后，紧接着服务端会发送这三个消息给客户端：

1. `Server Certificate`：发送一个<a href="#什么是证书链"> 证书链</a>。

2. `Server Key Exchange`（在部分加密套件下成立）：传递必要的密码信息，从而让客户端可以完成 `preMaster key` 的通信（预备主密钥）。

3. `Server Hello Done`：表示服务端发送完了所有支持密钥交换相关的消息，等待客户端响应。

+ 客户端收到`Server Hello Done`后，开始验证证书有效性：
1. 验证`证书链`是否可信
2. 证书是否吊销
3. 证书有效期、域名检验

**证书验证过程：**
从 `中间证书` 的 `TBSCertificate` 中拿到公钥（即 CA 的公钥），对 `服务器证书` 的证书签名进行解密，取其十六进制的后 64 位得到 A，用 `服务器证书` 中的签名算法，对 `服务器证书` 进行 hash 运算，得到 B，如果 A 和 B 相同，则说明 `服务器证书` 确实是由 `中间证书（CA）` 签发的，采用同样步骤使用 `根证书` 对 `中间证书` 进行验证。

+ 以上的证书链验证过程，就是`HTTPS`能够验证通信方身份的原理

### **5. Client Certificate、Client Key Exchange、Encrypted Handshake Message**
+ `Client Certificate`：客户端发送证书，服务器端可以决定是否在不验证客户端的情况下继续握手，或者回复一个错误 `handshake_failure`，通常情况下不会进行验证，请看：<a href="#TLS单/双向认证" >TLS单/双向认证</a>

+ `Client Key Exchange`：若客户端不发送证书，则这个是收到 `Server Hello Done` 后客户端发送的第一个消息，这个消息中发送了加密后的 `preMaster Key`，（客户端和服务器端协商生成 `preMaster Key` 的过程，是由选定的加密套件来决定的，根据套件的不同会有三种情况，一般情况下是由服务器端证书的公钥对随机数 `Random3` 进行加密生成）

+ `Encrypted Handshake Message`：客户端在发送 `preMaster key`后，会把之前发送给服务器的数据做一个 hash 摘要，使用 `preMaster Key` 加密发送，服务端收到后如果能解密成功，说明协商的密钥一致。 

### **6. Certificate Verify**
这个消息用于对客户端证书进行显示验证，只有在客户端具有证书签名能力时才能发送（跳过）

### **7. Change Cipher Spec、Encrypted Handshake Message**

1. `Change Cipher Spec`：服务端对客户端发送的 `preMaster Key` 使用自己的私钥解密得到 `Random3`，然后使用之前的 `Random1`、`Random2`，加上 `Random3`，计算出协商到的 `Master Key`（对称密钥），然后将客户端发来相关安全参数进行 hash，生成摘要，如果两边摘要相同，则握手合法。

2. `Encrypted Handshake Message`：服务端也将自己已经发送给客户端的数据经过 hash 后加密发送给客户端，让客户端验证有效性。

### **8. Application Data**
客户端使用对称密钥解密摘要后，验证如果有效，则后续数据都将使用对称密钥加密。

至此 TLS/SSL 握手流程结束


## 五、HTTPS 性能问题

HTTP 的握手过程：

![](/images/NetWork/http握手.jpg)

HTTPS 的握手过程：

![](/images/NetWork/https握手.jpg)


可以看到 HTTPS 比 HTTP 多了 7 个 `RTT`：
先一步步解释一下HTTPS传输的每一步：
+ step1：正常的 `TCP` 连接三次握手
+ step2：如果用户打开的是 `http` 网站，会重定向到 `HTTPS` 的网站
+ step3：又是 `TCP` 连接，接上一步跳转后，又需要 `TCP` 连接是因为 `HTTPS` 的传输端口不同，`http` 是 80，`https` 是 443
+ step4：完成加密套件的协商和证书的身份确认，这次交互客户端和服务端会协商出相同的密钥交换算法、对称加密算法、内容一致性校验算法、证书签名算法等等。浏览器获取到证书之后，也要验证证书的有效性，是否过期是否撤销。
+ step5：浏览器获取 `CA 域名`，如果没有命中 `CA 域名` 的缓存，还需要进行 `DNS` 解析，又需要多一次交互。
+ step6：解析成功解析 `IP` 之后，需要和 `CA` 网站进行 `TCP` 三次握手。
+ step7：这里 `OCSP` 请求，全称是 `Online Certificate Status Protocol`，在线证书状态协议，顾名思义用来获取证书状态的请求，这里的状态包括有效、过期、未知。并且可以宽限一段客户端访问证书的时间。
+ step8：主要进行密钥协商。

...待续 （优化方法）

## 六、名词解释

### 什么是证书链

`证书链`是一个用链式结构存储的多个证书，`证书链`中包含了【站点证书】——【中间证书】——【根证书】。

`证书链`中，发送者（即服务器）的证书必须在 `第一个位置`，每个随后的证书都能证明它前面的证书。

`根证书`通常是内置在操作系统或者支持 HTTPS 的应用当（包含浏览器）中的，攻击者无法修改证书的公钥所以是可信的，此外为了减少开销一般不会将根证书返回。

![](/images/NetWork/certificate2.png)

### 证书包含哪些内容

1. TBSCertificate 

`TBS` 是 `To-Be-Signed` 缩写，待签名的意思，`TBSCertificate`即待签名证书，其中包含了：`证书签发者`、`证书有效期`、`证书域公用名`、`证书公钥`

![](/images/NetWork/tbscertificate.jpg)

2. 证书签名算法
3. 证书签名

![](/images/NetWork/certificate.png)

### TLS单/双向认证

`TLS` 分为单向认证和双向认证两种，顾名思义单向认证就是只需要客户端去验证服务端的身份，而双向认证需要服务端也要验证客户端的请求，但是十分消耗资源，导致性能低下，所以一般都不会开启双向认证。如果开启了双向认证，服务端还需要在 `Server Hello Done` 之前发送一个 `CertificateRequest` 数据包，然后客户端在收到 `Server Hello Done` 数据包之后需要向服务端发送一个 `Certificate` 数据包，让服务端验证自己的证书。


测试题:

+ 客户端具体是如何判断证书合法性的？
+ 客户端如何检测数字证书是合法的并是所要请求的公司的？
+ 操作系统为什么会有证书发布机构的证书？
+ 在通信的过程中，黑客可以截获加密内容，虽不能理解具体内容，但可以捣乱，修改内容或重复发送该内容，如何解决？


> 参考：
>
> [知乎 - 程序员小灰](https://zhuanlan.zhihu.com/p/57142784)
>
> [知乎 - 前端缪斯](https://zhuanlan.zhihu.com/p/158593966)
>
> [HTTPS 温故知新（三） —— 直观感受 TLS 握手流程(上)](https://halfrost.com/https_tls1-2_handshake/)
>
> [霜菜](https://halfrost.com/)