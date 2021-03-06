---
layout: post
title: "Regular Expression"
description: ""
category: "Syntax"
tags: [syntax, regular expression, teradata, function]
---
{% include JB/setup %}

最近改写Data Retention的SQL，需要用到正则表达式来匹配querytext中的Date Condition。

Teradata中也有正则表达式的系统函数，如REGEXP_SUBSTR等。

<!-- more -->
##REGEXP_SUBSTR
###Purpose
Extracts a substring from source_string that matches a regular expression specified by regexp_string. 
Regular Expression Tool [http://gskinner.com/RegExr/](http://gskinner.com/RegExr/)

###Syntax
REGEXP_SUBSTR(Source_String,REGEXP_String,position_arg,occurrence_arg,match_arg)

Source_String

    a character argument.
    If source_string is NULL, NULL is returned.

REGEXP_String

    a character argument.
    If regexp_string is NULL, NULL is returned.

position_arg

    a numeric argument.
    The position_arg specifies the position in the source_string from which to start searching (default is 1).
    If the position_arg is greater than the input string length, NULL is returned.
    If the position_arg is NULL, the default value (1) is used.

occurrence_arg

    a numeric argument.
    The occurrence_arg specifies the number of the occurrence to be returned (default is 1). For example, if the occurrence_arg is 2, the function matches the first occurrence in source_string and starts searching from the character following the first occurrence in source_string for the second occurrence in source_string.
    If the occurrence_arg is greater than the number of matches found, NULL is returned.
    If occurrence_arg is NULL, the default value (1) is used.

match_arg

    a character argument.
    Valid values are:
    'i' = case-insensitive matching.
    'c' = case sensitive matching.
    'n' = the period character (match any character) can match the newline character.
    'm' = source_string is treated as multiple lines instead of as a single line. With this option, the '^' and '$' characters apply to each line in source_string instead of the entire source_string.
    'l' = if source_string exceeds the current maximum allowed source_string size (currently 16 MB), a NULL is returned instead of an error. This is useful for long-running queries where you do not want long strings causing an error that would make the query fail.
    If the match_arg is not specified:
    • The match is case sensitive.
    • A period does not match the newline character.
    • source_string is treated as a single line.
    If there is no match, NULL is returned.
    If match_arg is not valid, an error is returned.

前两个参数必需，后三个可以缺省，缺省值依次为1，1，'c'. 简单解释一下就是源字符串，正则表达式，从第几位字符起，取第几次出现的匹配字符串，以及大小写是否敏感等选项。

###Argument Types and Rules
Expressions passed to this function must have the following data types:

    • source_string = CHAR, VARCHAR, or CLOB
    • regexp_string = CHAR or VARCHAR (maximum size of 512 B)
    • position_arg = NUMBER
    • occurrence_arg = NUMBER
    • match_arg = VARCHAR

###Result Type
REGEXP_SUBSTR is a scalar function whose return value data type depends on the data type associated with source_string input parameter that is passed into the function.

A source_string of:

    • CHAR, VARCHAR returns VARCHAR in the same character set as source_string.
    • CLOB returns CLOB in the same character set as source_string.

###Example1
The following query:

    SELECT REGEXP_SUBSTR('mint chocolate chip', 'ch(i|o)p', 1, 1, 'c');

returns 'chip'.

###Example2
The following query:

    SELECT REGEXP_SUBSTR('mint chocolate chip chop', ' ch(i|o)p', 1, 2, 'i');

returns 'chop' because it is the second occurrence of the match.

****************************************************************

以下语法解释参考于维基百科

****************************************************************

##譯名問題

Regular Expression的「Regular」一般被譯為「正则」、「正規」、「常規」。此處的「Regular」即是「規則」、「規律」的意思，Regular Expression即「描述某種規則的表達式」之意。

##历史

最初的正则表达式出现于理论计算机科学的自动控制理论和形式化语言理论中。在这些领域中有对计算（自动控制）的模型和对形式化语言描述与分类的研究。 1940年，Warren McCulloch与Walter Pitts将神经系统中的神经元描述成小而简单的自动控制元。 1950年代，数学家斯蒂芬·科尔·克莱尼利用称之为「正则集合」的数学符号来描述此模型。肯·汤普逊将此符号系统引入编辑器QED，然后是Unix上的编辑器ed，并最终引入grep。自此，正則表达式被广泛地使用于各种Unix或者类似Unix的工具，例如Perl。

Perl的正则表达式源自于Henry Spencer写的regex，它已经演化成了pcre（Perl兼容正则表达式，Perl Compatible Regular Expressions），一个由Philip Hazel开发的，为很多现代工具所使用的库。

各计算机语言之间的正則表达式的整合目前开展的很差。未来的Perl6的子项目Apocalypse的设计中已考虑到了这点。

##理论

正则表达式可以用形式化语言理论的方式来表达。正则表达式由常量和算子组成，它们分别指示字符串的集合和在这些集合上的运算。给定有限字母表Σ定义了下列常量：

    (“空集”) ∅指示集合∅
    (“空串”) ε指示集合{ε}
    (“文字字符”)在Σ中的a指示集合{a}

定义了下列运算：

    (“串接”) RS指示集合{ αβ | α ∈ R，β ∈ S }。例如：{"ab","c"}{"d","ef"} = {"abd", "abef", "cd", "cef"}。
    (“选择”) R|S指示R和S的并集。例如：{"ab", "c"}|{"ab", "d", "ef"}= {"ab", "c", "d", "ef"}
    (“Kleene星号”) R* 指示包含ε并且闭包在字符串串接下的R的最小超集。这是可以通过R中的零或多个字符串的串接得到所有字符串的集合。例如，{"ab", "c"}* = {ε, "ab", "c", "abab", "abc", "cab", "cc", "ababab", ... }。

上述常量和算子形成了克莱尼代数。

很多课本使用对选择使用符号∪, +或∨替代竖杠。

为了避免括号，假定Kleene星号有最高优先级，接着是串接，接着是并集。如果没有歧义则可以省略括号。例如，(ab)c可以写为abc而a|(b(c*))可以写为a|bc*。

例子：

    a|b*指示{ε, a, b, bb, bbb, ...}。

    (a|b)*指示由包括空串、任意数目个a或b字符组成的所有字符串的集合。

    ab*(c|ε)指示开始于一个a接着零或多个b和最终可选的一个c的字符串的集合。

正则表达式的定义非常精简，避免多余的量词?和+，它们可以被表达为：a+ = aa*和a? = (a|ε)。有时增加补算子~；~R指示在Σ* 上的不在R中的所有字符串的集合。补算子是多余的，因为它使用其他算子来表达（尽管计算这种表示的过程是复杂的，而结果可能以指数增大）。

这种意义上的正则表达式可以表达正则语言，精确的是可被有限状态自动机接受的语言类。但是在简洁性上有重要区别。某类正则语言只能用大小指数增长的自动机来描述，而要求的正则表达式的长度只线性的增长。

正则表达式对应于乔姆斯基层级的类型-3文法。在另一方面，在正则表达式和不导致这种大小上的爆炸的非确定有限状态自动机（NFA）之间有简单的映射；为此NFA经常被用作正则表达式的替代表示。

我们还要在这种形式化中研究表达力。如下面例子所展示的，不同的正则表达式可以表达同样的语言：这种形式化中存在着冗余。

有可能对两个给定正则表达式写一个算法来判定它们所描述的语言是否本质上相等，简约每个表达式到极小确定有限自动机，确定它们是否同构（等价）。

这种冗余可以消减到什么程度?我们可以找到仍有完全表达力的正则表达式的有趣的子集吗? Kleene星号和并集明显是需要的，但是我们或许可以限制它们的使用。这提出了一个令人惊奇的困难问题。因为正则表达式如此简单，没有办法在语法上把它重写成某种规范形式。过去公理化的缺乏导致了星号高度问题。最近Dexter Kozen用克莱尼代数公理化了正则表达式。

很多现实世界的“正则表达式”引擎实现了不能用正则表达式代数表达的特征。

##基本语法

一個正则表达式通常被稱為一個模式（pattern），為用来描述或者匹配一系列符合某个句法规则的字符串。例如：Handel、Händel和Haendel這三个字符串，都可以由「Ha|ä|(ae)ndel」这个模式来描述。大部分正则表达式的形式都有如下的结构：

###选择
    |竖直分隔符代表选择。例如「gray|grey」可以匹配grey或gray。

###数量限定
    某个字符后的数量限定符用来限定前面这个字符允许出现的个数。最常见的数量限定符包括“+”、“?”和“*”（不加数量限定则代表出现一次且仅出现一次）：

    +加号代表前面的字符必须至少出现一次。（1次、或多次）。例如，「goo+gle」可以匹配google、gooogle、goooogle等;

    ?问号代表前面的字符最多只可以出现一次。（0次、或1次）。例如，「colou?r」可以匹配color或者colour;

    *星号代表前面的字符可以不出现，也可以出现一次或者多次。（0次、或1次、或多次）。例如，「0*42」可以匹配42、042、0042、00042等。

###匹配
    圆括号可以用来定义操作符的范围和优先度。例如，「gr(a|e)y」等价于「gray|grey」，「(grand)?father」匹配father和grandfather。

上述这些构造子都可以自由组合，因此，「H(ae?|ä)ndel」和「H(a|ae|ä)ndel」是相同的。

精确的语法可能因不同的工具或程序而异。

##表达式全集

正则表达式有多種不同的风格。下表是在PCRE中元字符及其在正则表达式上下文中的行为的一个完整列表，适用于Perl或者Python编程语言（grep或者egrep的正则表达式文法是PCRE的子集）：

<table border="2" bordercolor="#CCCCCC" cellspacing="0">
<tr>
<th>字符</th>
<th>描述</th>
</tr>

<tr>
<th style="text-align:center;">\</th>
<td>将下一个字符标记为一个特殊字符、或一个原义字符、或一个向后引用、或一个八进制转义符。例如，「<code>n</code>」匹配字符「<code>n</code>」。「<code>\n</code>」匹配一个换行符。序列「<code>\\</code>」匹配「<code>\</code>」而「<code>\(</code>」则匹配「<code>(</code>」。</td>
</tr>

<tr>
<th style="text-align:center;">^</th>
<td>匹配输入字符串的开始位置。如果设置了RegExp对象的Multiline属性，^也匹配「<code>\n</code>」或「<code>\r</code>」之后的位置。</td>
</tr>

<tr>
<th style="text-align:center;">$</th>
<td>匹配输入字符串的结束位置。如果设置了RegExp对象的Multiline属性，$也匹配「<code>\n</code>」或「<code>\r</code>」之前的位置。</td>
</tr>

<tr>
<th style="text-align:center;">*</th>
<td>匹配前面的子表达式零次或多次。例如，zo*能匹配「<code>z</code>」以及「<code>zoo</code>」。*等价于{0,}。</td>
</tr>

<tr>
<th style="text-align:center;">+</th>
<td>匹配前面的子表达式一次或多次。例如，「<code>zo+</code>」能匹配「<code>zo</code>」以及「<code>zoo</code>」，但不能匹配「<code>z</code>」。+等价于{1,}。</td>
</tr>

<tr>
<th style="text-align:center;">?</th>
<td>匹配前面的子表达式零次或一次。例如，「<code>do(es)?</code>」可以匹配「<code>do</code>」或「<code>does</code>」中的「<code>do</code>」。?等价于{0,1}。</td>
</tr>

<tr>
<th style="text-align:center;">{<span style="font-family:Times New Roman; font-style:italic;">n</span>}</th>
<td><span style="font-family:Times New Roman; font-style:italic;">n</span>是一个非负整数。匹配确定的<span style="font-family:Times New Roman; font-style:italic;">n</span>次。例如，「<code>o{2}</code>」不能匹配「<code>Bob</code>」中的「<code>o</code>」，但是能匹配「<code>food</code>」中的两个o。</td>
</tr>

<tr>
<th style="text-align:center;">{<span style="font-family:Times New Roman; font-style:italic;">n</span>,}</th>
<td><span style="font-family:Times New Roman; font-style:italic;">n</span>是一个非负整数。至少匹配<span style="font-family:Times New Roman; font-style:italic;">n</span>次。例如，「<code>o{2,}</code>」不能匹配「<code>Bob</code>」中的「<code>o</code>」，但能匹配「<code>foooood</code>」中的所有o。「<code>o{1,}</code>」等价于「<code>o+</code>」。「<code>o{0,}</code>」则等价于「<code>o*</code>」。</td>
</tr>

<tr>
<th style="text-align:center;">{<span style="font-family:Times New Roman; font-style:italic;">n</span>,<span style="font-family:Times New Roman; font-style:italic;">m</span>}</th>
<td><span style="font-family:Times New Roman; font-style:italic;">m</span>和<span style="font-family:Times New Roman; font-style:italic;">n</span>均为非负整数，其中<span style="font-family:Times New Roman; font-style:italic;">n</span>&lt;=<span style="font-family:Times New Roman; font-style:italic;">m</span>。最少匹配<span style="font-family:Times New Roman; font-style:italic;">n</span>次且最多匹配<span style="font-family:Times New Roman; font-style:italic;">m</span>次。例如，「<code>o{1,3}</code>」将匹配「<code>fooooood</code>」中的前三个o。「<code>o{0,1}</code>」等价于「<code>o?</code>」。请注意在逗号和两个数之间不能有空格。</td>
</tr>

<tr>
<th style="text-align:center;">?</th>
<td>当该字符紧跟在任何一个其他限制符（*,+,?，{<span style="font-family:Times New Roman; font-style:italic;">n</span>}，{<span style="font-family:Times New Roman; font-style:italic;">n</span>,}，{<span style="font-family:Times New Roman; font-style:italic;">n</span>,<span style="font-family:Times New Roman; font-style:italic;">m</span>}）后面时，匹配模式是非贪婪的。非贪婪模式尽可能少的匹配所搜索的字符串，而默认的贪婪模式则尽可能多的匹配所搜索的字符串。例如，对于字符串「<code>oooo</code>」，「<code>o+?</code>」将匹配单个「<code>o</code>」，而「<code>o+</code>」将匹配所有「<code>o</code>」。</td>
</tr>

<tr>
<th style="text-align:center;">.</th>
<td>匹配除「<code>\</code><span style="font-family:Times New Roman; font-style:italic;"><code>n</code></span>」之外的任何单个字符。要匹配包括「<code>\</code><span style="font-family:Times New Roman; font-style:italic;"><code>n</code></span>」在内的任何字符，请使用像「<code>(.|\n)</code>」的模式。</td>
</tr>

<tr>
<th style="text-align:center;">(pattern)</th>
<td>匹配pattern并获取这一匹配的子字符串。该子字符串用于向后引用。所获取的匹配可以从产生的Matches集合得到，在VBScript中使用SubMatches集合，在JScript中则使用$0…$9属性。要匹配圆括號字符，请使用「<code>\(</code>」或「<code>\)</code>」。</td>
</tr>

<tr>
<th style="text-align:center;">(?:pattern)</th>
<td>匹配pattern但不获取匹配的子字符串，也就是说这是一个非获取匹配，不存储匹配的子字符串用于向后引用。这在使用或字符「<code>(|)</code>」来组合一个模式的各个部分是很有用。例如「<code>industr(?:y|ies)</code>」就是一个比「<code>industry|industries</code>」更简略的表达式。</td>
</tr>

<tr>
<th style="text-align:center;">(?=pattern)</th>
<td>正向肯定预查，在任何匹配pattern的字符串开始处匹配查找字符串。这是一个非获取匹配，也就是说，该匹配不需要获取供以后使用。例如，「<code>Windows(?=95|98|NT|2000)</code>」能匹配「<code>Windows2000</code>」中的「<code>Windows</code>」，但不能匹配「<code>Windows3.1</code>」中的「<code>Windows</code>」。预查不消耗字符，也就是说，在一个匹配发生后，在最后一次匹配之后立即开始下一次匹配的搜索，而不是从包含预查的字符之后开始。</td>
</tr>

<tr>
<th style="text-align:center;">(?!pattern)</th>
<td>正向否定预查，在任何不匹配pattern的字符串开始处匹配查找字符串。这是一个非获取匹配，也就是说，该匹配不需要获取供以后使用。例如「<code>Windows(?!95|98|NT|2000)</code>」能匹配「<code>Windows3.1</code>」中的「<code>Windows</code>」，但不能匹配「<code>Windows2000</code>」中的「<code>Windows</code>」。预查不消耗字符，也就是说，在一个匹配发生后，在最后一次匹配之后立即开始下一次匹配的搜索，而不是从包含预查的字符之后开始</td>
</tr>

<tr>
<th style="text-align:center;">(?&lt;=pattern)</th>
<td>反向肯定预查，与正向肯定预查类似，只是方向相反。例如，「<code>(?&lt;=95|98|NT|2000)Windows</code>」能匹配「<code>2000Windows</code>」中的「<code>Windows</code>」，但不能匹配「<code>3.1Windows</code>」中的「<code>Windows</code>」。</td>
</tr>

<tr>
<th style="text-align:center;">(?&lt;!pattern)</th>
<td>反向否定预查，与正向否定预查类似，只是方向相反。例如「<code>(?&lt;!95|98|NT|2000)Windows</code>」能匹配「<code>3.1Windows</code>」中的「<code>Windows</code>」，但不能匹配「<code>2000Windows</code>」中的「<code>Windows</code>」。</td>
</tr>

<tr>
<th style="text-align:center;">x|y</th>
<td>匹配x或y。例如，「<code>z|food</code>」能匹配「<code>z</code>」或「<code>food</code>」。「<code>(z|f)ood</code>」则匹配「<code>zood</code>」或「<code>food</code>」。</td>
</tr>

<tr>
<th style="text-align:center;">[xyz]</th>
<td>字符集合（character class）。匹配所包含的任意一个字符。例如，「<code>[abc]</code>」可以匹配「<code>plain</code>」中的「<code>a</code>」。特殊字符仅有反斜线\保持特殊含义，用于转义字符。其它特殊字符如星号、加号、各种括号等均作为普通字符。脱字符^如果出现在首位则表示负值字符集合；如果出现在字符串中间就仅作为普通字符。连字符 - 如果出现在字符串中间表示字符范围描述；如果如果出现在首位则仅作为普通字符。</td>
</tr>

<tr>
<th style="text-align:center;">[^xyz]</th>
<td>排除型（negate）字符集合。匹配未列出的任意字符。例如，「<code>[^abc]</code>」可以匹配「<code>plain</code>」中的「<code>plin</code>」。</td>
</tr>

<tr>
<th style="text-align:center;">[a-z]</th>
<td>字符范围。匹配指定范围内的任意字符。例如，「<code>[a-z]</code>」可以匹配「<code>a</code>」到「<code>z</code>」范围内的任意小写字母字符。</td>
</tr>

<tr>
<th style="text-align:center;">[^a-z]</th>
<td>排除型的字符范围。匹配任何不在指定范围内的任意字符。例如，「<code>[^a-z]</code>」可以匹配任何不在「<code>a</code>」到「<code>z</code>」范围内的任意字符。</td>
</tr>

<tr>
<th style="text-align:center;">\b</th>
<td>匹配一个单词边界，也就是指单词和空格间的位置。例如，「<code>er\b</code>」可以匹配「<code>never</code>」中的「<code>er</code>」，但不能匹配「<code>verb</code>」中的「<code>er</code>」。</td>
</tr>

<tr>
<th style="text-align:center;">\B</th>
<td>匹配非单词边界。「<code>er\B</code>」能匹配「<code>verb</code>」中的「<code>er</code>」，但不能匹配「<code>never</code>」中的「<code>er</code>」。</td>
</tr>

<tr>
<th style="text-align:center;">\cx</th>
<td>匹配由x指明的控制字符。例如，\cM匹配一个Control-M或回车符。x的值必须为A-Z或a-z之一。否则，将c视为一个原义的「<code>c</code>」字符。</td>
</tr>

<tr>
<th style="text-align:center;">\d</th>
<td>匹配一个数字字符。等价于[0-9]。</td>
</tr>

<tr>
<th style="text-align:center;">\D</th>
<td>匹配一个非数字字符。等价于[^0-9]。</td>
</tr>
<tr>
<th style="text-align:center;">\f</th>
<td>匹配一个换页符。等价于\x0c和\cL。</td>
</tr>

<tr>
<th style="text-align:center;">\n</th>
<td>匹配一个换行符。等价于\x0a和\cJ。</td>
</tr>

<tr>
<th style="text-align:center;">\r</th>
<td>匹配一个回车符。等价于\x0d和\cM。</td>
</tr>

<tr>
<th style="text-align:center;">\s</th>
<td>匹配任何空白字符，包括空格、制表符、换页符等等。等价于[ \f\n\r\t\v]。</td>
</tr>

<tr>
<th style="text-align:center;">\S</th>
<td>匹配任何非空白字符。等价于[^ \f\n\r\t\v]。</td>
</tr>

<tr>
<th style="text-align:center;">\t</th>
<td>匹配一个制表符。等价于\x09和\cI。</td>
</tr>

<tr>
<th style="text-align:center;">\v</th>
<td>匹配一个垂直制表符。等价于\x0b和\cK。</td>
</tr>

<tr>
<th style="text-align:center;">\w</th>
<td>匹配包括下划线的任何单词字符。等价于「<code>[A-Za-z0-9_]</code>」。</td>
</tr>

<tr>
<th style="text-align:center;">\W</th>
<td>匹配任何非单词字符。等价于「<code>[^A-Za-z0-9_]</code>」。</td>
</tr>

<tr>
<th style="text-align:center;">\x<span style="font-family:Times New Roman; font-style:italic;">n</span></th>
<td>匹配<span style="font-family:Times New Roman; font-style:italic;">n</span>，其中<span style="font-family:Times New Roman; font-style:italic;">n</span>为十六进制转义值。十六进制转义值必须为确定的两个数字长。例如，「<code>\x41</code>」匹配「<code>A</code>」。「<code>\x041</code>」则等价于「<code>\x04&amp;1</code>」。正則表达式中可以使用ASCII编码。.</td>
</tr>

<tr>
<th style="text-align:center;">\<span style="font-family:Times New Roman; font-style:italic;">num</span></th>
<td>向后引用（back-reference）一个子字符串（substring），该子字符串与正则表达式的第num个用括号围起来的子表达式（subexpression）匹配。其中num是从1开始的正整数，其上限可能是99。例如：「<code>(.)\1</code>」匹配两个连续的相同字符。</td>
</tr>

<tr>
<th style="text-align:center;">\<span style="font-family:Times New Roman; font-style:italic;">n</span></th>
<td>标识一个八进制转义值或一个向后引用。如果\<span style="font-family:Times New Roman; font-style:italic;">n</span>之前至少<span style="font-family:Times New Roman; font-style:italic;">n</span>个获取的子表达式，则<span style="font-family:Times New Roman; font-style:italic;">n</span>为向后引用。否则，如果<span style="font-family:Times New Roman; font-style:italic;">n</span>为八进制数字（0-7），则<span style="font-family:Times New Roman; font-style:italic;">n</span>为一个八进制转义值。</td>
</tr>

<tr>
<th style="text-align:center;">\<span style="font-family:Times New Roman; font-style:italic;">nm</span></th>
<td>标识一个八进制转义值或一个向后引用。如果\<span style="font-family:Times New Roman; font-style:italic;">nm</span>之前至少有<span style="font-family:Times New Roman; font-style:italic;">nm</span>个获得子表达式，则<span style="font-family:Times New Roman; font-style:italic;">nm</span>为向后引用。如果\<span style="font-family:Times New Roman; font-style:italic;">nm</span>之前至少有<span style="font-family:Times New Roman; font-style:italic;">n</span>个获取，则<span style="font-family:Times New Roman; font-style:italic;">n</span>为一个后跟文字<span style="font-family:Times New Roman; font-style:italic;">m</span>的向后引用。如果前面的条件都不满足，若<span style="font-family:Times New Roman; font-style:italic;">n</span>和<span style="font-family:Times New Roman; font-style:italic;">m</span>均为八进制数字（0-7），则\<span style="font-family:Times New Roman; font-style:italic;">nm</span>将匹配八进制转义值<span style="font-family:Times New Roman; font-style:italic;">nm</span>。</td>
</tr>

<tr>
<th style="text-align:center;">\<span style="font-family:Times New Roman; font-style:italic;">nml</span></th>
<td>如果<span style="font-family:Times New Roman; font-style:italic;">n</span>为八进制数字（0-3），且<span style="font-family:Times New Roman; font-style:italic;">m和l</span>均为八进制数字（0-7），则匹配八进制转义值<span style="font-family:Times New Roman; font-style:italic;">nm</span>l。</td>
</tr>

<tr>
<th style="text-align:center;">\u<span style="font-family:Times New Roman; font-style:italic;">n</span></th>
<td>匹配<span style="font-family:Times New Roman; font-style:italic;">n</span>，其中<span style="font-family:Times New Roman; font-style:italic;">n</span>是一个用四个十六进制数字表示的Unicode字符。例如，\u00A9匹配版权符号（©）。</td>
</tr>
</table>

注：

参考资料 1.[Teradata Documentations](http://www.info.teradata.com/HTMLPubs/DB_TTU_14_00/index.html)

参考资料 2.[维基百科](http://zh.wikipedia.org/wiki/%E6%AD%A3%E5%88%99%E8%A1%A8%E8%BE%BE%E5%BC%8F)
