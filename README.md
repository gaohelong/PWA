## PWA
#### 资料
[PWA](https://segmentfault.com/a/1190000014639473)<br>
[Service Worker进阶](https://www.villainhr.com/page/2017/01/08/Service%20Worker%20%E5%85%A8%E9%9D%A2%E8%BF%9B%E9%98%B6)<br>
[web Worker](https://www.villainhr.com/page/2016/08/22/Web%20Worker)

#### 本地搭建https
```javascript
openssl生成证书文件
  只要安装了git客户端就会有openssl
　
  检测openssl是否安装
    openssl version -a

接下来开始生成证书：
  #1、生成私钥key文件：
    openssl genrsa -out privatekey.pem 1024
  #2、通过私钥生成CSR证书签名  （需要填一些信息、可直接回车）
    openssl req -new -key privatekey.pem -out certrequest.csr
  #3、通过私钥和证书签名生成证书文件 
    openssl x509 -req -in certrequest.csr -signkey privatekey.pem -out certificate.pem

执行完第三条命令会看到：
Signature ok
表示生成成功，最终看到如下三个文件
privatekey.pem: 私钥
certrequest.csr: CSR证书签名
certificate.pem: 证书文件

常见问题：
1、Failed to load resource: net::ERR_INSECURE_RESPONSE
　这个是因为你用的证书不正规，让浏览器给拦截掉了，打开你的控制台并点击里面的URL。它将带你进入API页面，然后在页面中接受SSL证书，返回你的应用页面并重新加载。
```

#### PWA 进阶
##### 基于 HTTPS
```javascript
现在，开发一个网站没用 HTTPS，估计都没好意思放出自己的域名（太 low）。HTTPS 不仅仅可以保证你网页的安全性，还可以让一些比较敏感的 API 完美的使用。值得一提的是，SW 是基于 HTTPS 的，所以，如果你的网站不是 HTTPS，那么基本上你也别想了 SW。这估计造成了一个困难，即，我调试 SW 的时候咋办？ 解决办法也是有的，使用 charles 或者 fildder 完成域名映射即可。

下面，我们仔细介绍下，SW 的基本使用。
```
##### Register
```javascript
SW 实际上是挂载到 navigator 下的对象。在使用之前，我们需要先检查一下是否可用：

if ('serviceWorker' in navigator) {
  // ....
}

如果可用，我们就要使用 SW 进行路由的注册缓存文件了。不过，这里有点争议。啥时候开始执行 SW 的注册呢？上面说过，SW 就是一个网络代理，用来捕获你网页的所有 fetch 请求。那么，是不是可以这么写？

  window.addEventListener('DOMContentLoaded', function() {
    // 执行注册
    navigator.serviceWorker.register('/sw.js').then(function(registration) {
      
    }).catch(function(err) {
      
    });
  });

现在，开发一个网站没用 HTTPS，估计都没好意思放出自己的域名（太 low）。HTTPS 不仅仅可以保证你网页的安全性，还可以让一些比较敏感的 API 完美的使用。值得一提的是，SW 是基于 HTTPS 的，所以，如果你的网站不是 HTTPS，那么基本上你也别想了 SW。这估计造成了一个困难，即，我调试 SW 的时候咋办？ 解决办法也是有的，使用 charles 或者 fildder 完成域名映射即可。下面，我们仔细介绍下，SW 的基本使用。

  window.addEventListener('DOMContentLoaded', function() {
    // 执行注册
    navigator.serviceWorker.register('/example/sw.js').then(function(registration) {
      
    }).catch(function(err) {
      
    });
  });
那么，SW 后面只会监听 /example 路由下的所有 fetch 请求，而不会去监听其他，比如 /jimmy,/sam 等路径下的。
```
##### Install
```javascript
从这里开始，我们就正式进入 SW 编程。记住，下面的部分是在另外一个 js 中的脚本，使用的是 worker 的编程方法。如果，有同学还不理解 worker 的话，可以先去学习一下，这样在后面的学习中才不会踩很深的坑。 监听安装 SW 的代码也很简单：

  self.addEventListener('install', function(event) {
    // Perform install steps
  });

当安装成功后，我们能使用 SW 做什么呢？ 那就开始缓存文件了呗。简单的例子为：
  self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open('mysite-static-v1').then(function(cache) {
        return cache.addAll([
          '/css/whatever-v3.css',
          '/css/imgs/sprites-v6.png',
          '/css/fonts/whatever-v8.woff',
          '/js/all-min-v4.js'
        ]);
      })
    );
});

此时，SW 会检测你制定文件的缓存问题，如果，已经都缓存了，那么 OK，SW 安装成功。如果查到文件没有缓存，则会发送请求去获取，并且会带上 cache-bust 的 query string，来表示缓存的版本问题。当然，这只针对于第一次加载的情况。当所有的资源都已经下载成功，那么恭喜你可以进行下一步了。大家可以参考一下 google demo。 这里，我简单说一下上面的过程，首先 event.waitUntil 你可以理解为 new Promise，它接受的实际参数只能是一个 promise，因为,caches 和 cache.addAll 返回的都是 Promise，这里就是一个串行的异步加载，当所有加载都成功时，那么 SW 就可以下一步。另外，event.waitUntil 还有另外一个重要好处，它可以用来延长一个事件作用的时间，这里特别针对于我们 SW 来说，比如我们使用 caches.open 是用来打开指定的缓存，但开启的时候，并不是一下就能调用成功，也有可能有一定延迟，由于系统会随时睡眠 SW，所以，为了防止执行中断，就需要使用 event.waitUntil 进行捕获。另外，event.waitUntil 会监听所有的异步 promise，如果其中一个 promise 是 reject 状态，那么该次 event 是失败的。这就导致，我们的 SW 开启失败。
```
