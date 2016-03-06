---
layout: post
title: "Hadoop安装问题总结"
description: ""
category: "Hadoop"
tags: [linux, hadoop, jdk]
---
{% include JB/setup %}

### 一、ssh 无密码登录问题

  需注意的是authorized_keys这个文件生成以后需要chmod 600，否则ssh localhost仍然需要密码
  
  <!-- more -->  
  
### 二、WARN util.NativeCodeLoader: Unable to load native-hadoop library for your platform... using builtin-java classes where applicable

  这个问题出现在启动start-dfs.sh的时候，后面namenode也解析为一长串乱七八糟的字符串而不是预期中的的localhost
  
#### HADOOP的本地库（NATIVE LIBRARIES）介绍
  
  Hadoop是使用Java语言开发的，但是有一些需求和操作并不适合使用java，所以就引入了本地库（Native Libraries）的概念，通过本地库，Hadoop可以更加高效地执行某一些操作。

  搜索资料以后看到一种说法是因为系统位数导致，这个case里是RHEL 64位系统，而Hadoop官方下载的包里面默认是32位的，因此需要下载一个64位的Native lib包
  
  [Native Lib 2.4.0下载地址](http://dl.bintray.com/sequenceiq/sequenceiq-bin/hadoop-native-64-2.4.0.tar)
  
  `cd /opt/hadoop-2.4.1/lib/native`
  
  `tar -xvf hadoop-native-64-2.4.0.tar`
  
  *补记：当时解压缩完貌似没在出现这个问题了，但第二天登陆后又报WARN，但文件确实已经替换成了64位文件。
  
  `export LD_LIBRARY_PATH=$HADOOP_HOME/lib/native/Linux-amd64-64` 也不管用
  
  检查.bashrc中添加过这样两行：
  
  `export HADOOP_COMMON_LIB_NATIVE_DIR=$HADOOP_HOME/lib/native/Linux-amd64-64/`
  
  `export HADOOP_OPTS="-Djava.library.path=$HADOOP_HOME/lib/"`
  
  把第二行改为`export HADOOP_OPTS="-Djava.library.path=$HADOOP_HOME/lib/native"`，退出hadoop用户再重新登陆，问题解决！
  
    [hadoop@lionelhd-6353 ~]$ hadoop checknative -a
    15/08/24 03:36:29 WARN bzip2.Bzip2Factory: Failed to load/initialize native-bzip2 library system-native, will use pure-Java version
    15/08/24 03:36:29 INFO zlib.ZlibFactory: Successfully loaded & initialized native-zlib library
    Native library checking:
    hadoop: true /opt/hadoop-2.4.1/lib/native/libhadoop.so.1.0.0
    zlib:   true /lib64/libz.so.1
    snappy: false 
    lz4:    true revision:99
    bzip2:  false 
    15/08/24 03:36:29 INFO util.ExitUtil: Exiting with status 1
  
### 三、JAVA_HOME is not set and could not be found

  这个问题有点诡异，因为我已经在`/etc/profile`里面设置了系统变量JAVA_HOME，而且`hadoop-env.sh`中也已经export JAVA_HOME，但是启动start-dfs.sh仍然报错找不到JAVA_HOME。
  
  网上看到有两种说法，一种是在`libexec/hadoop-config.sh`中再配置一遍，另一种是在`hadoop-env.sh`中应该写绝对地址，而不是`export JAVA_HOME=$JAVA_HOME`
  
  个人选择后面一种方法，即在`hadoop-env.sh`中`export JAVA_HOME=/opt/jdk1.7.0_60/`


### Reference

[Setting up a Single Node Cluster](http://hadoop.apache.org/docs/r2.4.1/hadoop-project-dist/hadoop-common/SingleCluster.html)
  
