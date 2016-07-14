---
layout: post
title: "How to check oracle version"
description: ""
category: "Oracle"
tags: [version, oracle, database]
---
{% include JB/setup %}

    SELECT * FROM V$VERSION;
    or
    SELECT version FROM V$INSTANCE;
    or
    select * from PRODUCT_COMPONENT_VERSION;
