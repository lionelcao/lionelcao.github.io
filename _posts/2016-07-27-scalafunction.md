---
layout: post
title: "A test about option parameters in Scala function/class"
description: ""
category: "Syntax"
tags: [scala, function, Option]
---
{% include JB/setup %}


```
scala> def test(a : String, b : Option[String]) { val x = a
     | val y = b
     | println("x is: " + x)
     | println("y is: " + y)
     | }
test: (a: String, b: Option[String])Unit
```

<!-- more -->

```
scala> test("a")
<console>:13: error: not enough arguments for method test: (a: String, b: Option[String])Unit.
Unspecified value parameter b.
       test("a")
           ^

scala> test("a",)
<console>:1: error: illegal start of simple expression
test("a",)
         ^

scala> test("a",None)
x is: a
y is: None

scala> def test(a : String, b : Option[String]) { val x = a
     | val y = b
     | println("x is: " + x)
     | if(y.exists) println("y is: " + y) else println("y is not exists!")
     | }
<console>:14: error: missing argument list for method exists in class Option
Unapplied methods are only converted to functions when a function type is expected.
You can make this conversion explicit by writing `exists _` or `exists(_)` instead of `exists`.
       if(y.exists) println("y is: " + y) else println("y is not exists!")
            ^

scala> def test(a : String, b : Option[String]) { val x = a
     | val y = b
     | println("x is: " + x)
     | if(y.exists(_)) println("y is: " + y) else println("y is not exists!")
     | }
<console>:14: error: missing parameter type for expanded function ((x$1) => y.<exists: error>(x$1))
       if(y.exists(_)) println("y is: " + y) else println("y is not exists!")
                   ^

scala> def test(a : String, b : Option[String]) { val x = a
     | val y=b
     | println("x is: " + x)
     | if (y.exists(x => true)) println("y is: " + y) else println("y is not exists!")
     | }
test: (a: String, b: Option[String])Unit

scala> test("a")
<console>:13: error: not enough arguments for method test: (a: String, b: Option[String])Unit.
Unspecified value parameter b.
       test("a")
           ^

scala> test("a", None)
x is: a
y is not exists!

scala> test("a", "None")
<console>:13: error: type mismatch;
 found   : String("None")
 required: Option[String]
       test("a", "None")
                 ^

scala> test("a", Some("None"))
x is: a
y is: Some(None)

scala> def test(a : String, b : Option[String]) { val x = a
     | val y=b
     | println("x is: " + x)
     | if (y.exists(x => true)) println("y is: " + y.get) else println("y is not exists!")
     | }
test: (a: String, b: Option[String])Unit

scala> test("a",None)
x is: a
y is not exists!

scala> test("a",Some("None"))
x is: a
y is: None

scala> def test(a : String, b : Option[String]) { val x = a 
     | val y = b
     | println("x is: " + x)
     | if (y.exists(okll => true)) println("y is: " + y.get) else println("y is not exists!")
     | }
test: (a: String, b: Option[String])Unit

scala> test("a",Some("None"))
x is: a
y is: None

scala> def test(a : String, b : Option[String]=None) { val x = a 
     | val y = b
     | println("x is: " + x)
     | if (y.exists(okll => true)) println("y is: " + y.get) else println("y is not exists!")
     | }
test: (a: String, b: Option[String])Unit

scala> test("a")
x is: a
y is not exists!

scala> 
```
