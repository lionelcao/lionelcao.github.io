---
layout: post
title: "hive安装问题"
description: ""
category: "Hive"
tags: [hive]
---
{% include JB/setup %}

最近测试carbondata过程中需要在本地安装spark进行调试，公司新发了Mac Pro，总算不用在没有管理员权限的windows上做开发了。

但安装hive的时候明明已经按照官方wiki配好mysql driver，竟然还是一直报错找不到derby的driver，偶然间在网上看到hive配置文件是hive-site.xml，但我装的这个1.1.1版本下面只有hive-default.xml.

<!-- more -->

于是尝试

    cp hive-default.xml hive-site.xml

果然不再报这个错了，但又报另一个错误

```
Exception in thread "main" java.lang.RuntimeException: java.lang.IllegalArgumentException: java.net.URISyntaxException: Relative path in absolute URI: ${system:java.io.tmpdir%7D/$%7Bsystem:user.name%7D
	at org.apache.hadoop.hive.ql.session.SessionState.start(SessionState.java:472)
	at org.apache.hadoop.hive.cli.CliDriver.run(CliDriver.java:671)
	at org.apache.hadoop.hive.cli.CliDriver.main(CliDriver.java:615)
	at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
	at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
	at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
	at java.lang.reflect.Method.invoke(Method.java:498)
	at org.apache.hadoop.util.RunJar.run(RunJar.java:221)
	at org.apache.hadoop.util.RunJar.main(RunJar.java:136)
Caused by: java.lang.IllegalArgumentException: java.net.URISyntaxException: Relative path in absolute URI: ${system:java.io.tmpdir%7D/$%7Bsystem:user.name%7D
	at org.apache.hadoop.fs.Path.initialize(Path.java:206)
	at org.apache.hadoop.fs.Path.<init>(Path.java:172)
	at org.apache.hadoop.hive.ql.session.SessionState.createSessionDirs(SessionState.java:515)
	at org.apache.hadoop.hive.ql.session.SessionState.start(SessionState.java:458)
	... 8 more
Caused by: java.net.URISyntaxException: Relative path in absolute URI: ${system:java.io.tmpdir%7D/$%7Bsystem:user.name%7D
	at java.net.URI.checkPath(URI.java:1823)
	at java.net.URI.<init>(URI.java:745)
	at org.apache.hadoop.fs.Path.initialize(Path.java:203)
	... 11 more
```

原来是hive-site.xml中没有指定绝对路径，找到${system:java.io.tmpdir%7D/$%7Bsystem:user.name%7D并修改为绝对路径就OK了。

另外由于使用了mysql5.7+，需要设置useSSL=false, 注意`&`在xml中以`&amp;`代替否则报错。

```
16/12/08 16:33:45 ERROR conf.Configuration: error parsing conf file:/Users/lucao/MyDev/hive-1.1.1/conf/hive-site.xml
org.xml.sax.SAXParseException; systemId: file:/Users/lucao/MyDev/hive-1.1.1/conf/hive-site.xml; lineNumber: 386; columnNumber: 76; The reference to entity "useSSL" must end with the ';' delimiter.
	at org.apache.xerces.parsers.DOMParser.parse(Unknown Source)
	at org.apache.xerces.jaxp.DocumentBuilderImpl.parse(Unknown Source)
	at javax.xml.parsers.DocumentBuilder.parse(DocumentBuilder.java:150)
	at org.apache.hadoop.conf.Configuration.parse(Configuration.java:2352)
	at org.apache.hadoop.conf.Configuration.parse(Configuration.java:2340)
	at org.apache.hadoop.conf.Configuration.loadResource(Configuration.java:2408)
	at org.apache.hadoop.conf.Configuration.loadResources(Configuration.java:2374)
	at org.apache.hadoop.conf.Configuration.getProps(Configuration.java:2281)
	at org.apache.hadoop.conf.Configuration.get(Configuration.java:1108)
	at org.apache.hadoop.hive.conf.HiveConf.getVar(HiveConf.java:2458)
	at org.apache.hadoop.hive.conf.HiveConf.getVar(HiveConf.java:2479)
	at org.apache.hadoop.hive.conf.HiveConf.initialize(HiveConf.java:2548)
	at org.apache.hadoop.hive.conf.HiveConf.<init>(HiveConf.java:2494)
	at org.apache.hadoop.hive.common.LogUtils.initHiveLog4jCommon(LogUtils.java:74)
	at org.apache.hadoop.hive.common.LogUtils.initHiveLog4j(LogUtils.java:58)
	at org.apache.hadoop.hive.cli.CliDriver.run(CliDriver.java:631)
	at org.apache.hadoop.hive.cli.CliDriver.main(CliDriver.java:615)
	at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
	at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
	at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
	at java.lang.reflect.Method.invoke(Method.java:498)
	at org.apache.hadoop.util.RunJar.run(RunJar.java:221)
	at org.apache.hadoop.util.RunJar.main(RunJar.java:136)
Exception in thread "main" java.lang.RuntimeException: org.xml.sax.SAXParseException; systemId: file:/Users/lucao/MyDev/hive-1.1.1/conf/hive-site.xml; lineNumber: 386; columnNumber: 76; The reference to entity "useSSL" must end with the ';' delimiter.
	at org.apache.hadoop.conf.Configuration.loadResource(Configuration.java:2517)
	at org.apache.hadoop.conf.Configuration.loadResources(Configuration.java:2374)
	at org.apache.hadoop.conf.Configuration.getProps(Configuration.java:2281)
	at org.apache.hadoop.conf.Configuration.get(Configuration.java:1108)
	at org.apache.hadoop.hive.conf.HiveConf.getVar(HiveConf.java:2458)
	at org.apache.hadoop.hive.conf.HiveConf.getVar(HiveConf.java:2479)
	at org.apache.hadoop.hive.conf.HiveConf.initialize(HiveConf.java:2548)
	at org.apache.hadoop.hive.conf.HiveConf.<init>(HiveConf.java:2494)
	at org.apache.hadoop.hive.common.LogUtils.initHiveLog4jCommon(LogUtils.java:74)
	at org.apache.hadoop.hive.common.LogUtils.initHiveLog4j(LogUtils.java:58)
	at org.apache.hadoop.hive.cli.CliDriver.run(CliDriver.java:631)
	at org.apache.hadoop.hive.cli.CliDriver.main(CliDriver.java:615)
	at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
	at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
	at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
	at java.lang.reflect.Method.invoke(Method.java:498)
	at org.apache.hadoop.util.RunJar.run(RunJar.java:221)
	at org.apache.hadoop.util.RunJar.main(RunJar.java:136)
Caused by: org.xml.sax.SAXParseException; systemId: file:/Users/lucao/MyDev/hive-1.1.1/conf/hive-site.xml; lineNumber: 386; columnNumber: 76; The reference to entity "useSSL" must end with the ';' delimiter.
	at org.apache.xerces.parsers.DOMParser.parse(Unknown Source)
	at org.apache.xerces.jaxp.DocumentBuilderImpl.parse(Unknown Source)
	at javax.xml.parsers.DocumentBuilder.parse(DocumentBuilder.java:150)
	at org.apache.hadoop.conf.Configuration.parse(Configuration.java:2352)
	at org.apache.hadoop.conf.Configuration.parse(Configuration.java:2340)
	at org.apache.hadoop.conf.Configuration.loadResource(Configuration.java:2408)
	... 17 more
```





