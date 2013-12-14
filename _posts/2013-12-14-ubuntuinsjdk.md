---
layout: post
title: "Ubuntu下安装JDK"
description: ""
category: "Java"
tags: [Ubuntu, JDK, Java, Install]
---
{% include JB/setup %}
###Ubuntu : 12.04
###JDK: jdk-7u45-linux-x64.tar.gz

1. 从Oracle官网下载JDK。将jdk-7u45-linux-x64.tar.gz拷贝到/usr/lib/jdk/目录下面，这里如果没有jdk文件夹，则创建该文件夹:
   
   <!-- more -->

   创建文件夹jdk

        $ cd /usr/lib
        $ sudo mkdir jdk

   把下载的文件拷贝到新创建的目录下面

        $ sudo mv  ~/Downloads/jdk-7u45-linux-x64.tar.gz  /usr/lib/jdk/

   解压缩文件

        $ sudo tar -zxvg jdk-7u45-linux-x64.tar.gz

2. 设置环境变量

        $ sudo gedit /etc/profile

   在文件的最后加上：

        export JAVA_HOME=/usr/lib/jdk/jdk1.7.0_45
        export JRE_HOME=/usr/lib/jdk/jdk1.7.0_45/jre
        export PATH=$JAVA_HOME/bin:$JAVA_HOME/jre/bin:$PATH
        export CLASSPATH=$CLASSPATH:.:$JAVA_HOME/lib:$JAVA_HOME/jre/lib

3. 将系统默认的jdk修改过来

        $ sudo update-alternatives --install /usr/bin/java java /usr/lib/jdk/jdk1.7.0_45/bin/java 300

        $ sudo update-alternatives --install /usr/bin/javac javac /usr/lib/jdk/jdk1.7.0_45/bin/javac 300

        $ sudo update-alternatives --config java
    
        $ sudo update-alternatives --config javac

4. 验证Java版本

        $ java -version
        java version "1.7.0_45"
        Java(TM) SE Runtime Environment (build 1.7.0_45-b18)
        Java HotSpot(TM) 64-Bit Server VM (build 24.45-b08, mixed mode)
