---
layout: post
title: "浅谈Hive性能调优"
description: ""
category: "Hadoop"
tags: [hql, hadoop, hive, performance]
---
{% include JB/setup %}

&#160; &#160; &#160; &#160; Hive作为Hadoop大数据平台上一种重要的数据仓库工具，由于其使用类SQL查询语言HQL，使得大部分分析人员不必花费大量精力来开发Map-Reduce程序即可进行大数据分析，因而在Hadoop生态圈占有重要的一席之地，并得到了业界广泛的应用。

  <!-- more -->

&#160; &#160; &#160; &#160; 然而由于Hadoop和HDFS本身以及MapReduce计算模型的限制，Hive查询普遍有着较大的延迟。在实践中我们应当了解Hive性能优化的一些方法，以最大化的利用好计算资源。当然Hive本身也还在不断的发展改进，如支持Tez、Spark等内存计算模型。

&#160; &#160; &#160; &#160; 本文将从以下方面简要介绍Hive性能调优的一些常用方法：
- Hive表的模式设计与存储格式优化
  - 使用分区表
  - 使用分桶表
  - 使用ORC File
- 预设参数配置优化
  - 执行引擎选择
  - 基于成本的执行计划优化
  - 使用向量模式
  - 使用并行执行模式
- HQL优化
  - Join中将大表后置
  - 使用Map-side Join
  - 使用Multi-insert
  - 避免select count(distinct field_a)
  - 在where子句中使用分区字段

### 一、Hive表的模式设计与存储格式优化

#### 1. 使用分区表(Partition Table)

&#160; &#160; &#160; &#160; 在Hive中合理使用分区表对于提高查询性能有很大帮助。Hive的分区对应到HDFS上的文件目录，当查询中的where子句使用到分区列时Hive只需要扫描相应的目录而不需要全盘扫描，这将大大减少磁盘I/O。
    
    --创建分区表
    create table table_a (userid string, birthday date, country string, gender string)
    partitioned by (country string, gender string);

&#160; &#160; &#160; &#160; 然而对于分区表来说并不是分区越多就越好的。如前文所述Hive中的分区对应到HDFS的文件目录，过多的分区会导致在HDFS上存储大量的小文件，这在Hadoop上是应该尽量避免的。因为每一个目录和文件都会在NameNode上占据一定的存储空间，虽然单个文件所占的名称空间很小（约150字节/文件），但毕竟一个Hadoop集群的NameNode资源是有限的。同时一个MapReduce Job会对应多个task，每个task都是一个 JVM实例，都需要开启和销毁。对于大量的小文件，查询时而每个文件都会对应一个task，这可能导致大量的时间浪费在不断的启动和销毁JVM，而不是真正的数据计算上。

#### 2. 使用分桶表(Bucketing Table)

&#160; &#160; &#160; &#160; 分桶表是另一种将数据分隔处理的技术。它需要用户在创建表时指定分桶字段以及分桶数，然后在往表中插入数据时会根据分桶字段对应的哈希值对分桶数取模来决定数据存放在哪个桶内。这样做的好处是当两个表需要join时，如果他们同时在join字段上分桶，那么将会大大提高join的效率。另外分桶对于提高数据抽样的效率非常有好处。

    --创建分桶表
    create table table_a (userid string, birthday date, country string, gender string)
    partitioned by (country string, gender string)
    clustered by (userid) into 90 buckets;

&#160; &#160; &#160; &#160; 需要注意的是，如果你使用分桶表，那么在插入数据的时候必须加入下面的配置
    
    set hive.enforce.bucketing=true; 
    
如果你没有这么做，那么你必须手动设置和分桶数相同的reduce个数:
    
    set mapred.reduce.tasks=90;

然后在insert select语句中增加cluster by子句。

注意：在ebay，这一配置已被加入hive-site.xml作为默认配置，那么你最好在建表时指定合适的分桶字段，否则很可能出现data skew。另外在Hive 2.x版本中该配置项已被移除并默认为true。

#### 3. 使用ORC(Optimized Row Columnar) File

&#160; &#160; &#160; &#160; ORC File是Hive在0.11版本引入的一种新的存储格式。它由Hortonworks公司开源，是对于之前的RCFile的优化。ORC File提供了高效的方式来存储Hive数据，并且能够给Hive的读、写以及数据处理带来全面的性能提升。

ORC File是一种行列混合存储格式。一个ORC File中包含若干个行级分组，称为stripes。同时在文件尾部有一个file footer包含若干辅助信息，例如stripes列表，每个stripes的行数，以及列的数据类型，同时包含一些列的预聚合信息如count, min, max, sum等。另外在文件尾部还有一个Postscript用于存储文件的压缩信息以及压缩后的footer大小。

![](https://cwiki.apache.org/confluence/download/attachments/31818911/OrcFileLayout.png?version=1&modificationDate=1366430304000&api=v2)

如上图所示，每个stripe包含Index Data, Row Data, Stripe Footer三个部分。stripe footer包含流位置的目录，Row Data即你存储的数据，在查询时会用到，而Index data则包含了每列的最大最小值以及在每一列中行的位置信息（也可能包含一个位域或者bloom filter）。行级索引提供了位移量可以准确的找到目标压缩块，当然它并不能直接用于你的查询，而是用于stripes的选择。

虽然Stripe很大，但相对频密的行级索引可以在stripe的快速读取中跳过大量的行，默认情况下每次可以跳过10,000行。由于具备了这种基于过滤谓词来跳过大量行的能力，你可以把你的表基于次级键排序，从而大大减少查询的执行时间。例如，某表的主分区字段是交易日期trans_date, 那么你可以把它按照state,zip_code等字段排序，这样当你查询某个州的数据的时候就会跳过其他州的数据。

总之，ORC已经成为了Hive推荐使用的数据存储格式。

    --创建ORC表
    create table table_a (
      userid string, 
      birthday date, 
      country string, 
      gender string
    ) stored as orc 
    tblproperties(
    "orc.compress"="snappy"
    );
    
常用的压缩格式有zlib和snappy, zlib是默认压缩格式，两种压缩格式差别不是很大，本文不作过多引申。通过下图的对比我们可以看出ORC File的压缩效果确实相当明显：
![](http://hortonworks.com/wp-content/uploads/2013/10/ORCFile.png)

### 二、预设参数配置优化

#### 1. 执行引擎选择

Hive目前除了默认支持的Map-Reduce计算框架，还扩展了对Tez和Spark的支持，使得用户可以充分利用这两种计算框架的优势来提升查询性能。默认hive.execution.engine=MR;

    --使用其他执行引擎
    Set hive.execution.engine=tez;
    Set hive.execution.engine=spark;

相比于MR模型，这两种计算框架都可以使数据在计算过程中不需要把中间结果写到HDFS而是利用内存进行计算，这大大减少了数据读取和写入磁盘的时间。就目前来说Hive on Tez和Hive on Spark的性能差距并不明显，但由于Hortonworks已经宣布将全力支持Spark，未来二者是否会发生差别我们还需要进一步观察。对于这两种计算框架本文不做过多阐述，请自行查阅相关文档。

#### 2. 基于成本的执行计划优化(Cost Based Optimization)

Hive在0.14.0及之前的版本中这一参数默认值是false, 但在1.1.0之后的版本已经改为true
开启方式：

    set hive.cbo.enable=true;

我们知道在数据库中通过Join可以把两张表的相关行通过某一个（或多个）字段连接起来，而在多个表join的情况下，join的顺序将对使用到的数据集的大小产生重大影响。当然随着参与join的表数量的增加，可能的join顺序的也会急剧增加。
使用CBO可以让Hive的查询优化器基于表的统计信息选择更为合理的Join顺序，从而大大减少查询执行时间。因此，及时的更新统计信息对于使用CBO来优化查询至关重要。在Hive 0.14中，收集统计信息的语句性能已经经过优化：

    --收集表和字段的统计信息
    analyze table table_a compute statistics;
    analyze table table_a compute statistics for columns userid, country;

#### 3. 使用向量模式

向量模式允许Hive一次处理一个包含1024行数据的数据块(block)而标准的SQL执行引擎每次只处理一行。开启向量模式将大大减少扫描、过滤、聚合以及连接等操作的CPU消耗。在数据块内部每一列被存储为一个向量（即一个由原始数据组成的数组），像简单的算术运算和比较会通过向量在紧密循环内快速的迭代完成，而在循环内部没有（或很少）使用函数调用或者条件分支。这些循环以一种精简的方式编译，使用相对较少的指令并且这些指令基本上会在更短的时钟周期内完成，因为它们更高效的利用了处理器流水线和高速缓存。

    --开启向量模式
    set hive.vectorized.execution.enabled = true; --默认false

需要注意的是，向量模式仅支持以下数据类型，使用其他数据类型将导致Hive仍然使用标准的一次处理一行方式来执行：
- tinyint
- smallint
- int
- bigint
- boolean
- float
- double
- decimal
- date
- timestamp
- string

注意：对于timestamp类型有一个限制即仅支持1677-09-20~2262-04-11之间的时间。这是由于向量化的timestamp类型数据实际是存储为long类型值，这意味着可以表示的时间区间为Unix系统起始时间1970-01-01 00:00:00 UTC ± (2^32-1)纳秒。

#### 4. 使用并行执行模式

使用并行执行可以让Hive同时处理多个job/task（无依赖关系的情况下），例如应用到多个MR Job 上，join多个表之前分别处理每个表的数据，或者在multi-insert的时候移动数据文件插入target table。 当然这在你的计算资源足够的情况下肯定会减少查询的执行时间。

    --开启并行执行
    Set hive.exec.parallel=true;
    
### 三、HQL优化

HQL即Hive自己的SQL，和所有的SQL方言一样，它并不完全符合SQL-92标准。HQL看起来更像是SQL-92，MySQL和Oracle SQL的混合。当然它也在不断的改进以更好的支持SQL-92。HQL支持窗口函数（分析函数），当然它也有一些特有的语法，如Multi-insert。关于HQL语法这里不作过多阐述，这里简要提几点HQL中应该注意的书写规则，写出好的SQL对于查询性能会有所帮助：

#### 1. join中将大表后置

Hive默认假设join中的最后一张表是最大的，它会试图把其他表存入缓存，然后流过最后一张表。
假设我们有一张大表table_a和一张小表table_b, 当你join它们时应该这样写：

    select l.userid, l.country, s.username, s.mail 
      from table_b s 
      join table_a l 
        on s.user_id=l.user_id

当然，你并不是必须这么写，Hive还提供了另一种方式，即使用hint：

    select /*+ STREAMTABLE(l) */ l.userid, l.country, s.username, s.mail 
      from table_a l 
      join table_b s 
        on l.user_id=s.user_id

#### 2. 使用Map-Side Join

如果参与Join的表中只有一张表是小表，那么使用Map-side join将对于提高你的查询性能非常有帮助。Hive会将小表直接读入内存，然后在Map的时候就可以完成连接，从而省去了reduce的步骤。即使你的数据集不是很大，当你使用Map-Side join的时候你也会感到明显比普通的join快很多。这样做不仅仅可以省去Reduce，有时候也可以减少Map步骤的数量。

    --使用Map-Side Join
    set hive.auto.convert.join=true;

你可以设置当表具体有多小的时候可以让Hive自动使用Map-Side join，默认值是25MB

    --设置小表默认大小
    Set hive.mapjoin.smalltable.filesize=25000000;
    
注意：这个优化不能用在右外连接和全外连接的查询中。

#### 3. 使用Multi-insert

前面我们提到Hive有一种独有的语法即Multi-insert, 可以从一张表查询数据然后同时插入到多张表，这在其他的SQL语法中是没有的。
    
    --同一源表插入多个target table
    FROM staged_employees se
    INSERT OVERWRITE TABLE employees
    PARTITION (country = 'US', state = 'OR')
    SELECT * WHERE se.cnty = 'US' AND se.st = 'OR'
    INSERT OVERWRITE TABLE employees
    PARTITION (country = 'US', state = 'CA')
    SELECT * WHERE se.cnty = 'US' AND se.st = 'CA'
    INSERT OVERWRITE TABLE employees
    PARTITION (country = 'US', state = 'IL')
    SELECT * WHERE se.cnty = 'US' AND se.st = 'IL';

因此我们在改写其他平台的SQL往Hive上做迁移的时候，也许可以利用这一特性减少对同一源表的重复读取，从而减少执行时间。

#### 4. 避免select count(distinct field_a)

这种写法在很多SQL中都非常常见，然而请不要在HiveQL中这样书写，因为这样将只能启动一个reducer来处理数据，你可以通过子查询来改写：

    select count(1) 
    from (
    select distinct field_a from table_a
    ) t;

这样会启动2个MR job，第一个MR job中会有多个reducer来处理数据。当你的数据量不是很大的时候，这样做的好处并不明显，有时候可能还会适得其反，因为启动和销毁JVM也需要耗费时间，但是当你的数据量非常大的时候，你会明显的感受到这个优化带来的好处。

注意：在count这样的全局聚合操作中，即使你手动修改reducer个数，Hive也还是会强制把reducer设为1，因此只有通过改写子查询才能使用多个reducer。

#### 5. 在where子句中使用分区字段

最后，如果你建了分区表，别忘了在你的查询中使用分区字段来提高查询效率！

### 编后语
虽然Hadoop生态圈中SQL on Hadoop的产品层出不穷，但目前Hive已经相对成熟和稳定。Hive性能优化需要从多方面入手，从实践中总结经验。本文仅仅是针对较为常用的一些方法做了一些总结，如有不正确的地方欢迎批评指正。另外不同的硬件性能，集群规模和可使用资源（CPU、内存）等也会对查询最终的执行和等待时间造成较大影响，如需做性能测试需要保证外部条件一致的情况下做对比才有意义。最后希望本文的总结能给各位刚接触Hive的朋友带来帮助，感谢阅读。

### 参考资料
1. 《Programming Hive》by Edward Capriolo, Dean Wampler, and Jason Rutherglen, First Edition.
2. [《Hive User Documentation》](https://cwiki.apache.org/confluence/display/Hive/Home#Home-UserDocumentation)
3. [《5 Ways to Make Your Hive Queries Run Faster》](http://zh.hortonworks.com/blog/5-ways-make-hive-queries-run-faster/)
4. [《10 Best Practices for Apache Hive》](https://www.qubole.com/blog/big-data/hive-best-practices/)
