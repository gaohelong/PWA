### PWA
```javascript
pwa example
```

#### 资料
[参考资料](https://segmentfault.com/a/1190000014639473)
[参考资料](https://www.villainhr.com/page/2017/01/08/Service%20Worker%20%E5%85%A8%E9%9D%A2%E8%BF%9B%E9%98%B6)

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
```
