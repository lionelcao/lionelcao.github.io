---
layout: post
title: "Ubuntu下配置免密码登录本机（ssh localhost）"
description: ""
category: "Linux"
tags: [ssh, ubuntu, linux, hadoop]
---
{% include JB/setup %}
###Ubuntu下配置免密码登录本机方法如下:

   <!-- more -->
1. 生成密钥

        $ ssh-keygen -t rsa

   全部默认回车

2. 将公钥添加到信任列表

        $ cd .ssh/
        $ cat id_rsa.pub >> authorized_keys

3. 验证无密码登录

        $ ssh localhost

   a) 出现报错`ssh : connect to host localhost port 22:Connection refused`

      错误原因：
      1. `sshd` 未安装
      2. `sshd` 未启动
      3. 防火墙

        $ ps aux|grep ssh
        $ ssh net start sshd

      此处为发现没有安装sshd，因此需要安装openssh-server

        $ sudo apt-get install openssh-server

      安装完再次验证ssh localhost返回正确信息。

   b) 正确信息

        Welcome to Ubuntu 12.04.3 LTS (GNU/Linux 3.8.0-29-generic x86_64)
        
        * Documentation:  https://help.ubuntu.com/
        
        200 packages can be updated.
        104 updates are security updates.

        Last login: Tue Dec 17 22:57:25 2013 from localhost

注：本文部分内容参考网络资料
