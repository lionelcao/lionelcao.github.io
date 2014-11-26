---
layout: post
title: "在Linux中修改MySQL root用户的密码"
description: ""
category: "Linux"
tags: [linux, mysql]
---
{% include JB/setup %}
###一、有MySQL的root密码

####方法一：

在Linux系统，使用mysqladmin

<!-- more -->

    mysqladmin -u root -p password "test123"
    Enter password: 【输入原来的密码】

####方法二：

登录mysql，

    > mysql -uroot -p
    > Enter password: 【输入原来的密码】
    mysql> use mysql;
    mysql> update user set password=passworD("test") where user='root';
    mysql> flush privileges;
    mysql> exit;      

###二、没有MySQL的root密码

需有操作系统的root权限，安全模式登录系统

先停掉当前正在运行的mysqld

    > /etc/init.d/mysqld stop
    > mysqld_safe --skip-grant-tables &   --&表示在后台运行
    >mysql
    mysql> use mysql;
    mysql> UPDATE user SET password=password("test123") WHERE user='root';   
    mysql> flush privileges; *(1)
    mysql> exit;

*(1) flush privileges 命令本质上的作用是将当前user和privilige表中的用户信息/权限设置从mysql库(MySQL数据库的内置库)中提取到内存里。MySQL用户数据和权限有修改后，希望在"不重启MySQL服务"的情况下直接生效，那么就需要执行这个命令。通常是在修改ROOT帐号的设置后，怕重启后无法再登录进来，那么直接flush之后就可以看权限设置是否生效。而不必冒太大风险。
