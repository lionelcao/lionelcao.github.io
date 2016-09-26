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
	at java.io.ObjectInputStream.readClassDesc(ObjectInputStream.java:1521)
	at java.io.ObjectInputStream.readOrdinaryObject(ObjectInputStream.java:1781)
	at java.io.ObjectInputStream.readObject0(ObjectInputStream.java:1353)
	at java.io.ObjectInputStream.defaultReadFields(ObjectInputStream.java:2018)
	at java.io.ObjectInputStream.readSerialData(ObjectInputStream.java:1942)
	at java.io.ObjectInputStream.readOrdinaryObject(ObjectInputStream.java:1808)
	at java.io.ObjectInputStream.readObject0(ObjectInputStream.java:1353)
	at java.io.ObjectInputStream.readObject(ObjectInputStream.java:373)
	at org.apache.spark.serializer.JavaDeserializationStream.readObject(JavaSerializer.scala:76)
	at org.apache.spark.serializer.JavaSerializerInstance.deserialize(JavaSerializer.scala:115)
	at org.apache.spark.scheduler.ResultTask.runTask(ResultTask.scala:61)
	at org.apache.spark.scheduler.Task.run(Task.scala:89)
	at org.apache.spark.executor.Executor$TaskRunner.run(Executor.scala:213)
	at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1142)
	at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:617)
	at java.lang.Thread.run(Thread.java:745)

Driver stacktrace:
	at org.apache.spark.scheduler.DAGScheduler.org$apache$spark$scheduler$DAGScheduler$$failJobAndIndependentStages(DAGScheduler.scala:1431)
	at org.apache.spark.scheduler.DAGScheduler$$anonfun$abortStage$1.apply(DAGScheduler.scala:1419)
	at org.apache.spark.scheduler.DAGScheduler$$anonfun$abortStage$1.apply(DAGScheduler.scala:1418)
	at scala.collection.mutable.ResizableArray$class.foreach(ResizableArray.scala:59)
	at scala.collection.mutable.ArrayBuffer.foreach(ArrayBuffer.scala:47)
	at org.apache.spark.scheduler.DAGScheduler.abortStage(DAGScheduler.scala:1418)
	at org.apache.spark.scheduler.DAGScheduler$$anonfun$handleTaskSetFailed$1.apply(DAGScheduler.scala:799)
	at org.apache.spark.scheduler.DAGScheduler$$anonfun$handleTaskSetFailed$1.apply(DAGScheduler.scala:799)
	at scala.Option.foreach(Option.scala:236)
	at org.apache.spark.scheduler.DAGScheduler.handleTaskSetFailed(DAGScheduler.scala:799)
	at org.apache.spark.scheduler.DAGSchedulerEventProcessLoop.doOnReceive(DAGScheduler.scala:1640)
	at org.apache.spark.scheduler.DAGSchedulerEventProcessLoop.onReceive(DAGScheduler.scala:1599)
	at org.apache.spark.scheduler.DAGSchedulerEventProcessLoop.onReceive(DAGScheduler.scala:1588)
	at org.apache.spark.util.EventLoop$$anon$1.run(EventLoop.scala:48)
	at org.apache.spark.scheduler.DAGScheduler.runJob(DAGScheduler.scala:620)
	at org.apache.spark.SparkContext.runJob(SparkContext.scala:1832)
	at org.apache.spark.SparkContext.runJob(SparkContext.scala:1845)
	at org.apache.spark.SparkContext.runJob(SparkContext.scala:1858)
	at org.apache.spark.rdd.RDD$$anonfun$take$1.apply(RDD.scala:1328)
	at org.apache.spark.rdd.RDDOperationScope$.withScope(RDDOperationScope.scala:150)
	at org.apache.spark.rdd.RDDOperationScope$.withScope(RDDOperationScope.scala:111)
	at org.apache.spark.rdd.RDD.withScope(RDD.scala:316)
	at org.apache.spark.rdd.RDD.take(RDD.scala:1302)
	at org.apache.spark.rdd.RDD$$anonfun$first$1.apply(RDD.scala:1342)
	at org.apache.spark.rdd.RDDOperationScope$.withScope(RDDOperationScope.scala:150)
	at org.apache.spark.rdd.RDDOperationScope$.withScope(RDDOperationScope.scala:111)
	at org.apache.spark.rdd.RDD.withScope(RDD.scala:316)
	at org.apache.spark.rdd.RDD.first(RDD.scala:1341)
	at com.saic.iot.SparkJob$.main(SparkJob.scala:17)
	at com.saic.iot.SparkJob.main(SparkJob.scala)
	at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
	at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:57)
	at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
	at java.lang.reflect.Method.invoke(Method.java:606)
	at com.intellij.rt.execution.application.AppMain.main(AppMain.java:147)
Caused by: java.io.InvalidClassException: org.apache.spark.rdd.MapPartitionsRDD; local class incompatible: stream classdesc serialVersionUID = 6732270565076291202, local class serialVersionUID = -1059539896677275380
	at java.io.ObjectStreamClass.initNonProxy(ObjectStreamClass.java:616)
	at java.io.ObjectInputStream.readNonProxyDesc(ObjectInputStream.java:1630)
	at java.io.ObjectInputStream.readClassDesc(ObjectInputStream.java:1521)
	at java.io.ObjectInputStream.readOrdinaryObject(ObjectInputStream.java:1781)
	at java.io.ObjectInputStream.readObject0(ObjectInputStream.java:1353)
	at java.io.ObjectInputStream.defaultReadFields(ObjectInputStream.java:2018)
	at java.io.ObjectInputStream.readSerialData(ObjectInputStream.java:1942)
	at java.io.ObjectInputStream.readOrdinaryObject(ObjectInputStream.java:1808)
	at java.io.ObjectInputStream.readObject0(ObjectInputStream.java:1353)
	at java.io.ObjectInputStream.readObject(ObjectInputStream.java:373)
	at org.apache.spark.serializer.JavaDeserializationStream.readObject(JavaSerializer.scala:76)
	at org.apache.spark.serializer.JavaSerializerInstance.deserialize(JavaSerializer.scala:115)
	at org.apache.spark.scheduler.ResultTask.runTask(ResultTask.scala:61)
	at org.apache.spark.scheduler.Task.run(Task.scala:89)
	at org.apache.spark.executor.Executor$TaskRunner.run(Executor.scala:213)
	at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1142)
	at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:617)
	at java.lang.Thread.run(Thread.java:745)
16/09/26 09:38:42 INFO SparkContext: Invoking stop() from shutdown hook
16/09/26 09:38:42 INFO SparkUI: Stopped Spark web UI at http://10.100.56.197:4040
16/09/26 09:38:42 INFO SparkDeploySchedulerBackend: Shutting down all executors
16/09/26 09:38:42 INFO SparkDeploySchedulerBackend: Asking each executor to shut down
16/09/26 09:38:42 INFO MapOutputTrackerMasterEndpoint: MapOutputTrackerMasterEndpoint stopped!
16/09/26 09:38:42 INFO MemoryStore: MemoryStore cleared
16/09/26 09:38:42 INFO BlockManager: BlockManager stopped
16/09/26 09:38:42 INFO BlockManagerMaster: BlockManagerMaster stopped
16/09/26 09:38:42 INFO OutputCommitCoordinator$OutputCommitCoordinatorEndpoint: OutputCommitCoordinator stopped!
16/09/26 09:38:42 INFO RemoteActorRefProvider$RemotingTerminator: Shutting down remote daemon.
16/09/26 09:38:42 INFO SparkContext: Successfully stopped SparkContext
16/09/26 09:38:42 INFO ShutdownHookManager: Shutdown hook called
16/09/26 09:38:42 INFO RemoteActorRefProvider$RemotingTerminator: Remote daemon shut down; proceeding with flushing remote transports.
16/09/26 09:38:42 INFO ShutdownHookManager: Deleting directory C:\Users\lucao\AppData\Local\Temp\spark-021b758e-c5c4-4a7a-9b1d-fba55e247125


```
