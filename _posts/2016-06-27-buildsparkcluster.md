---
layout: post
title: "搭建Spark集群"
description: ""
category: "Spark"
tags: [spark, yarn]
---
{% include JB/setup %}
手动搭建Spark集群，已使用Ambari安装HDFS和YARN（2.7.1.2.4）

1. Install JDK, set $JAVA_HOME and add to $PATH

<!-- more -->

2. Put spark-2.0.0-preview-bin-hadoop2.7 under /opt/, set $SPARK_HOME and add to $PATH

3. $SPARK_HOME/conf/spark-env.sh
    HADOOP_CONF_DIR=$HADOOP_HOME/conf
    SPARK_MASTER_IP=<HOSTNAME OF YOUR MASTER NODE>

4. $SPARK_HOME/conf/spark-defaults.conf
    spark.master            spark://<HOSTNAME OF YOUR MASTER NODE>:7077
    spark.serializer        org.apache.spark.serializer.KryoSerializer
    spark.driver.extraJavaOptions -Dhdp.version=current    #For HDP
    spark.yarn.am.extraJavaOptions -Dhdp.version=current    #For HDP

5. $SPARK_HOME/conf/slaves
    <HOSTNAME OF YOUR MASTER NODE>
    <HOSTNAME OF YOUR SLAVE NODE 1>
    ...
    ...
    <HOSTNAME OF YOUR SLAVE NODE n>

6. Create java_opts file under $SPARK_HOME/conf
    -Dhdp.version=current
    
7. Set passwordless between all nodes

8. $SPARK_HOME/sbin/start-all.sh

### 运行sample程序验证：

    spark-submit --class org.apache.spark.examples.SparkPi \
                 --master yarn  \
                 --deploy-mode cluster \
                 /opt/spark-2.0.0-preview-bin-hadoop2.7/examples/jars/spark-examples_2.11-2.0.0-preview.jar \
                 1000
