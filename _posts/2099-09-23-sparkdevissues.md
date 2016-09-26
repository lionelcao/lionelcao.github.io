---
layout: post
title: "Spark开发踩坑记录"
description: ""
category: "Spark"
tags: [spark]
---
{% include JB/setup %}
### 问题1：Initial job has not accepted any resources; ......
环境：在windows下Intellij直接启动spark app进行调试
分析：该异常可能由多种原因导致

<!-- more -->

```
 host配置不正确    --符合。由于在windows环境下开发，spark集群无法识别lucao-notepad ip导致worker无法连接client
 worker内存不足    --一开始由于自己临时搭的server确实存在内存不足问题，导致这个问题排查颇具迷惑性，后想办法增加内存以后问题依然存在，故排除
 相关端口号被占用   --排除该可能
```
报错信息：
WARNYarnClientClusterScheduler: Initial job has not accepted any resources;check your cluster UI to ensure that workers are registered and havesufficient memory

解决方法：

    1. 修改本机hosts文件，在修改第一行，添加自己的hostName，如：

    127.0.0.1   lucao-notepad    localhsot
    
    2.在spark集群的所有节点的hosts中添加本地提交任务的windows节点的ip和hostname，如：

    10.0.1.76   lucao-notepad

### 问题2：local class incompatible: stream classdesc serialVersionUID = ......

分析：client端类版本与server端不一致，server端是自己搭建的普通版Hadoop和Spark，而客户端是CDH版本

```

Exception in thread "main" org.apache.spark.SparkException: Job aborted due to stage failure: Task 0 in stage 0.0 failed 4 times, most recent failure: Lost task 0.3 in stage 0.0 (TID 3, 10.100.56.197): java.io.InvalidClassException: org.apache.spark.rdd.MapPartitionsRDD; local class incompatible: stream classdesc serialVersionUID = 6732270565076291202, local class serialVersionUID = -1059539896677275380
	at java.io.ObjectStreamClass.initNonProxy(ObjectStreamClass.java:616)
	at java.io.ObjectInputStream.readNonProxyDesc(ObjectInputStream.java:1630)
	.
	.
	.
Driver stacktrace:
	at org.apache.spark.scheduler.DAGScheduler.org$apache$spark$scheduler$DAGScheduler$$failJobAndIndependentStages(DAGScheduler.scala:1431)
	at org.apache.spark.scheduler.DAGScheduler$$anonfun$abortStage$1.apply(DAGScheduler.scala:1419)
	at org.apache.spark.scheduler.DAGScheduler$$anonfun$abortStage$1.apply(DAGScheduler.scala:1418)
	.
	.
	.
Caused by: java.io.InvalidClassException: org.apache.spark.rdd.MapPartitionsRDD; local class incompatible: stream classdesc serialVersionUID = 6732270565076291202, local class serialVersionUID = -1059539896677275380
	at java.io.ObjectStreamClass.initNonProxy(ObjectStreamClass.java:616)
	
