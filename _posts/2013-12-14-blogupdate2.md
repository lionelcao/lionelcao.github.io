---
layout: post
title: "博客功能更新（二）"
description: ""
category: "随笔"
tags: [Ubuntu, bootstrap, html, css]
---
{% include JB/setup %}
家里的机器上的`Ubuntu`一直卡死，基本上每次用半个小时就这样。一直以为是上次手动移动虚拟机文件造成的，结果重新安装了一个还是这样。今天把内存从2G改成4G就好了，于是下午改博客的时候`top`了一下，Memory果然超过了2G。光一个`Firefox`就吃掉1G多 ，汗死～

###今天更新了博客的几个小地方：

<!-- more -->

    1. 将Links页更新为_config.yml+html文件中通过ruby调用，同样的方法用在导航栏上实现了标签排序。
       之前用了一个别人开发的排序插件结果导致导航栏直接消失不见了，但在本地jekyll serve却能看到。诡异的问题，还是自己修改比较靠谱。
    2. 将Categories,Tags,Archive合并成为一个下拉菜单，并调整了css以修改默认外观。
       由于用的是bootstrap模板，在官网查了下文档，改起来还是比较方便的。修改bootstrap.min.css文件打开太容易卡死，直接怒把
       default.html中引用换成bootstrap.css。


###下一个版本准备做的事：

    1. 增加回到顶部功能。对于长篇的博客来说，鼠标滚轮实在太吃力了，所以增加一个BackTop吧！
    2. 导航栏锁定，屏幕向下滚动的时候保持导航栏锁定在屏幕顶部以方便切换。