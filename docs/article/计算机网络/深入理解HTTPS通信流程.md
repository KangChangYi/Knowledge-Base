## 『深入 TCP/IP 系列』 HTTPS 的通信流程

> 2020-12-19 15:12

### 什么是 HTTPS

HTTP + SSL/TLS = HTTPS

HTTPS 采用非对称加密和对称加密结合以及证书认证的方式，保证 HTTP 数据传输的安全。

> TLS 是 SSL 3.0 协议的升级版

### HTTPS 解决了 HTTP 的哪些问题

1. 数据明文传输，通信过程被监听
2. 无法验证通信方身份，易遭受中间人攻击
3. 无法验证报文完整性，数据被中间人篡改

### HTTPS 如何解决这些问题

HTTP 和 HTTPS 的不同点其实就是 SSL/TLS 这一层，SSL/TLS 到底做了些什么，可以解决上面的三个安全问题？

#### SSL 握手： 

**1. Client Hello**

第一步，客户端向服务端发送 `Client Hello` 消息，包含了客户端生成的一个随机数 `Random1`、支持的加密套件以及 `SSLVersion` 等信息。

**2. Server Hello**

第二步，服务端向客户端发送 `Server Hello` 消息，这个消息从 `Client Hello` 传来的加密套件中确定一份加密套件，该套件决定了后续加密和生成摘要时具体使用哪些算法，另外还会生成一份随机数 `Random2`，此时，`Random1` 和 `Random2` 用于后续生成对称秘钥。

**3. 发送证书（Certificate）**

第三步，在这一步服务端将自己的证书和 `Random2` 发送给客户端，让客户端验证自己的身份，客户端验证通过后取出证书中的公钥。

**4. 证书验证（Certificate Verify）**

第四步，客户端收到服务端传来的证书后，先从 `CA` 验证该证书的合法性，验证通过后取出证书中的服务端公钥，再生成一个随机数 `Random3`，再用服务端公钥非对称加密 `Random3` 生成 `PreMaster Key`。

**5. 客户端发送对称秘钥 （Client Key Exchange）**

第五步，客户端发送 `PreMaster Key` 传送给服务端，服务端使用私钥解密后，得到 `Random3`，此时，双方都拥有了 `Random1` + `Random2` + `Random3`，两边再使用同样的算法生成秘钥即可，后续应用层数据都采用这个秘钥加密。

+ 问题：为什么要用三个随机数？
这是因为 `SSL/TLS` 握手过程的数据都是明文传输的，并且多个随机数种子来生成秘钥不容易被暴力破解出来。

### HTTPS 性能问题

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

...待续（优化方法）


> 参考：[知乎 - 程序员小灰](https://zhuanlan.zhihu.com/p/57142784)
>
> 参考：[知乎 - 前端缪斯](https://zhuanlan.zhihu.com/p/158593966)