---
layout: post
title: "LIBNAME Statement Specifics for Teradata"
description: ""
category: "tools"
tags: [sas, libname, syntax, teradata ]
---
{% include JB/setup %}
Via [http://support.sas.com](http://support.sas.com)

****************************
##Overview

This section describes the LIBNAME statement that SAS/ACCESS Interface to Teradata supports and includes examples. For a complete description of this feature, see LIBNAME statement.

<!-- more -->
Here is the LIBNAME statement syntax for accessing Teradata.

    LIBNAME libref teradata <connection-options> <LIBNAME-options>;

****************************
##Arguments
**libref**

specifies any SAS name that serves as an alias to associate SAS with a database, schema, server, or group of tables and views.

**teradata**

specifies the SAS/ACCESS engine name for the Teradata interface.

**connection-options**

provide connection information and control how SAS manages the timing and concurrence of the connection to the DBMS. Here are the connection options for the Teradata interface.

###USER=<'>Teradata-user-name<'> | <">ldapid@LDAP<"> | <">ldapid@LDAPrealm-name<">

specifies a required connection option that specifies a Teradata user name. If the name contains blanks or national characters, enclose it in quotation marks. For LDAP authentication with either a NULL or single realm, append only the @LDAP token to the Teradata user name. In this case, no realm name is needed. If you append a realm name, the LDAP authentication server ignores it and authentication proceeds. However, if multiple realms exist, you must append the realm name to the @LDAP token. In this case, an LDAP server must already be configured to accept authentication requests from the Teradata server.

###PASSWORD=<'>Teradata-password<'>

specifies a required connection option that specifies a Teradata password. The password that you specify must be correct for your USER= value. If the password contains spaces or nonalphanumeric characters, you must enclose it in quotation marks. If you do not want to enter your Teradata password in clear text on this statement, see PROC PWENCODE in the Base SAS Procedures Guide for a method for encoding it. For LDAP authentication, you use this password option to specify the authentication string or password. If the authentication string or password includes an embedded @ symbol, a backslash (\) is required and it must precede the @ symbol. See Teradata LIBNAME Statement Examples.

###ACCOUNT=<'>account_ID<'>

is an optional connection option that specifies the account number that you want to charge for the Teradata session.

###TDPID=<'>dbcname<'>
    
   `Alias: SERVER=`

specifies a required connection option if you run more than one Teradata server. TDPID= operates differently for network-attached and channel-attached systems, as described below.

For NETWORK-ATTACHED systems (PC and UNIX), dbcname specifies an entry in your (client) HOSTS file that provides an IP address for a database server connection.

By default, SAS/ACCESS connects to the Teradata server that corresponds to the dbccop1 entry in your HOSTS file. When you run only one Teradata server and your HOSTS file defines the dbccop1 entry correctly, you do not need to specify TDPID=.

However, if you run more than one Teradata server, you must use the TDPID= option to specifying a dbcname of eight characters or less. SAS/ACCESS adds the specified dbcname to the login string that it submits to Teradata. (Teradata documentation refers to this name as the tdpid component of the login string.)

After SAS/ACCESS submits a dbcname to Teradata, Teradata searches your HOSTS file for all entries that begin with the same dbcname. For Teradata to recognize the HOSTS file entry, the dbcname suffix must be COPx (x is a number). If there is only one entry that matches the dbcname, x must be 1. If there are multiple entries for the dbcname, x must begin with 1 and increment sequentially for each related entry. (See the example HOSTS file entries below.)

When there are multiple, matching entries for a dbcname in your HOSTS file, Teradata does simple load balancing by selecting one of the Teradata servers specified for login. Teradata distributes your queries across these servers so that it can return your results as fast as possible.

The TDPID= examples below assume that your HOSTS file contains these dbcname entries and IP addresses.

        * Example 1: The TDPID= option is not specified, establishing a login to the Teradata server that runs at 10.25.20.34.dbccop1 10.25.20.34
        * Example 2: Using TDPID= myserver or SERVER=myserver, you specify a login to the Teradata server that runs at 130.96.8.207.myservercop1 130.96.8.207
        * Example 3: Using TDPID=xyz or SERVER=xyz, you specify a login to a Teradata server that runs at 11.22.33.44 or to a Teradata server that runs at 33.44.55.66.xyzcop1 33.44.55.66 or xyzcop2 11.22.33.44

For CHANNEL-ATTACHED systems (z/OS), TDPID= specifies the subsystem name. This name must be TDPx, where x can be 0–9, A–Z (not case sensitive), or $, # or @. If there is only one Teradata server, and your z/OS system administrator has set up the HSISPB and HSHSPB modules, you do not need to specify TDPID=. For further information, see your Teradata TDPID documentation for z/OS.

###DATABASE=<'>database-name<'>

   `Alias: DB=`

specifies an optional connection option that specifies the name of the Teradata database that you want to access. This option enables you to view or modify a different user's Teradata DBMS tables or views, if you have the required privileges. (For example, to read another user's tables, you must have the Teradata privilege SELECT for that user's tables.) If you do not specify DATABASE=, the libref points to your default Teradata database, which is often named the same as your user name. If the database value that you specify contains spaces or nonalphanumeric characters, you must enclose it in quotation marks.

###SCHEMA=<'>database-name<'>

specifies an optional connection option that specifies the database name to use to qualify any database objects that the LIBNAME can reference.


##LIBNAME-options

define how SAS processes DBMS objects. Some LIBNAME options can enhance performance, and others determine locking or naming behavior. The following table describes the LIBNAME options for SAS/ACCESS Interface to Teradata, with the applicable default values. For more detail about these options, see LIBNAME Options for Relational Databases.

SAS/ACCESS LIBNAME Options for Teradata


<TABLE border="1" bordercolor="#333333" cellspacing="0">
 <TR>
    <TH>
       <DIV><A></A>Option
       </DIV>
    </TH>
    <TH>
       <DIV><A></A>Default Value
       </DIV>
    </TH>
 </TR>
 <TR>
    <TD class="firstRow" style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="n05764k5zha7vmn1o5jdawotulb2"></A><SPAN class="xrefSee"><A>ACCESS=</A></SPAN></DIV>
    </TD>
    <TD class="firstRow" style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="n159pibn1z2n3cn1idoq4m6lnosl"></A>none
       </DIV>
    </TD>
 </TR>
 <TR>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="p04thgkccdvuzpn10uqmbaqhv71e"></A><SPAN class="xrefSee"><A>AUTHDOMAIN=</A></SPAN></DIV>
    </TD>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="p0k8ug9swejmqqn1wwew04s9etb1"></A>none
       </DIV>
    </TD>
 </TR>
 <TR>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="n0z7rjsa56bdurn1qiugsoc1w5fj"></A><SPAN class="xrefSee"><A>BULKLOAD=</A></SPAN></DIV>
    </TD>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="n1mwcwh1ehyrutn18crjkfjwqcgr"></A>NO
       </DIV>
    </TD>
 </TR>
 <TR>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="n0xymhulmvfx0gn10od8y1s85ax2"></A><SPAN class="xrefSee"><A>CAST=</A></SPAN></DIV>
    </TD>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="n0r2eh74fh3f9gn1lu12l81747t2"></A>none
       </DIV>
    </TD>
 </TR>
 <TR>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="n0qdvvcr2stqkan0zxm38p7fgs4i"></A><SPAN class="xrefSee"><A>CAST_OVERHEAD_MAXPERCENT=</A></SPAN></DIV>
    </TD>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="p1jesfu37mzhk8n1f6622nbbiwaj"></A>20%
       </DIV>
    </TD>
 </TR>
 <TR>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="n1oo2kaka2oas9n19l7lwuwzk4gz"></A><SPAN class="xrefSee"><A>CONNECTION=</A></SPAN></DIV>
    </TD>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="n12i0w0js77c1qn1o0yyw2s6fulu"></A>SHAREDREAD for channel-attached
          systems (<NOBR>z/OS</NOBR>); UNIQUE for network attached systems (UNIX and PC platforms)
       </DIV>
    </TD>
 </TR>
 <TR>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="p02ybusidxgybxn1me6aj22c7wb7"></A><SPAN class="xrefSee"><A>CONNECTION_GROUP=</A></SPAN></DIV>
    </TD>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="n08th4dyizgk8xn1sltrqxr6g8co"></A>none
       </DIV>
    </TD>
 </TR>
 <TR>
    <TD style="text-align: left" valign="top">
       <DIV ><A></A>DATABASE= (see <SPAN class="xrefSee"><A>SCHEMA=</A></SPAN>)
       </DIV>
    </TD>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="n0xq80qssa4kcxn1vf1hl076mbsw"></A>none
       </DIV>
    </TD>
 </TR>
 <TR>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="p0xy3up1eow6i9n1jq9zvo95b6ia"></A><SPAN class="xrefSee"><A>DBCOMMIT=</A></SPAN></DIV>
    </TD>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="n08cn7l3d1r3lxn1lzmelep86eut"></A>1000 when inserting
          rows; 0 when updating rows
       </DIV>
    </TD>
 </TR>
 <TR>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="n1cs45i0jjgzi3n1mink44ngoma6"></A><SPAN class="xrefSee"><A>DBCONINIT=</A></SPAN></DIV>
    </TD>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="p1af5t2uccgeajn16md7ijxbe49l"></A>none
       </DIV>
    </TD>
 </TR>
 <TR>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="n0namyl2zihpcon1s9b6poi8zrbv"></A><SPAN class="xrefSee"><A>DBCONTERM=</A></SPAN></DIV>
    </TD>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="p1jnvz1of6wj8on1i5ormdv5fcr6"></A>none
       </DIV>
    </TD>
 </TR>
 <TR>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="n1iazm2vn71n0dn1f71wrdo6vrpb"></A><SPAN class="xrefSee"><A>DBCREATE_TABLE_OPTS=</A></SPAN></DIV>
    </TD>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="p0zixt1051tro0n0za9bhik42xn1"></A>none
       </DIV>
    </TD>
 </TR>
 <TR>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="p1wak7nryeed7cn1bxtf8z98t7i9"></A><SPAN class="xrefSee"><A>DBGEN_NAME=</A></SPAN></DIV>
    </TD>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="n16p7fs2inkiwln1gxoki35i8tgv"></A>DBMS
       </DIV>
    </TD>
 </TR>
 <TR>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="n1g87xuya1s575n1q8cm9y6cs7ru"></A><SPAN class="xrefSee"><A>DBINDEX=</A></SPAN></DIV>
    </TD>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="p0xffoorzjo6hjn1rxhp6n6weawr"></A>NO
       </DIV>
    </TD>
 </TR>
 <TR>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="n0ydlawoa7n1han15kt49tatd64z"></A><SPAN class="xrefSee"><A>DBLIBINIT=</A></SPAN></DIV>
    </TD>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="n015g55d63l01cn1clrluw5mt0x9"></A>none
       </DIV>
    </TD>
 </TR>
 <TR>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="p0cbefs3pkyex9n1s4x12okrhvkv"></A><SPAN class="xrefSee"><A>DBLIBTERM=</A></SPAN></DIV>
    </TD>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="p0zuc7cnt2s4jzn13g7r9j0p9c5m"></A>none
       </DIV>
    </TD>
 </TR>
 <TR>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="n1dsjqnbad2cq7n162x6pjh0cuep"></A><SPAN class="xrefSee"><A>DBMSTEMP=</A></SPAN></DIV>
    </TD>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="n1gpbpy0r1eh54n1pmb4zydoouz7"></A>NO
       </DIV>
    </TD>
 </TR>
 <TR>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="p07uz46ts55fl1n0zvty9ph1mc1w"></A><SPAN class="xrefSee"><A>DBPROMPT=</A></SPAN></DIV>
    </TD>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="p1u506kke3v4tjn1plev9gdw6qaf"></A>NO
       </DIV>
    </TD>
 </TR>
 <TR>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="p05c33q85ro00xn0zx1emeylqa82"></A><SPAN class="xrefSee"><A>DBSASLABEL=</A></SPAN></DIV>
    </TD>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="p08z4k3gsjx8mqn1jwisiymrogza"></A>COMPAT
       </DIV>
    </TD>
 </TR>
 <TR>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="p1s2wla9zvshlwn15z1g4ijnyebd"></A><SPAN class="xrefSee"><A>DBSLICEPARM=</A></SPAN></DIV>
    </TD>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="p12vpxsmirfz2en13vetbgfgsh8e"></A>THREADED_APPS,2
       </DIV>
    </TD>
 </TR>
 <TR>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="p17tpp9asfmhgnn15zw0g4ng0gui"></A><SPAN class="xrefSee"><A>DEFER=</A></SPAN></DIV>
    </TD>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="p00u7vo9jvz748n1d5fuuylhsype"></A>NO
       </DIV>
    </TD>
 </TR>
 <TR>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="n0ooadnft4qlkpn1drmhgikdyo1s"></A><SPAN class="xrefSee"><A>DIRECT_EXE=</A></SPAN></DIV>
    </TD>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="p1p8u8whcw3d79n1pdhxo4fqnq3r"></A></DIV>
    </TD>
 </TR>
 <TR>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="n1p0x258ry7e3gn1n9mn1ceijtht"></A><SPAN class="xrefSee"><A>DIRECT_SQL=</A></SPAN></DIV>
    </TD>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="n0ny6mm1yyxq4vn1w017yqauzsiy"></A>YES
       </DIV>
    </TD>
 </TR>
 <TR>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="n1t5j3eynzk5lgn1r30b5e1jka09"></A><SPAN class="xrefSee"><A>ERRLIMIT=</A></SPAN></DIV>
    </TD>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="n0uuwcwbopb6j3n1l71cqnzp1e4c"></A>1 million
       </DIV>
    </TD>
 </TR>
 <TR>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="n0n3liw9gv20han1vabvlrls7lsw"></A><SPAN class="xrefSee"><A>FASTEXPORT=</A></SPAN></DIV>
    </TD>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="n1qtbqoakwbhxen1xim87tn0dlg9"></A>NO
       </DIV>
    </TD>
 </TR>
 <TR>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="p1v7zvniu4kkqxn1x0g5icd8revq"></A><SPAN class="xrefSee"><A>LOGDB=</A></SPAN></DIV>
    </TD>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="n0uz4z24witoi9n1sh2dg2wk7opv"></A>Default Teradata database
          for the libref
       </DIV>
    </TD>
 </TR>
 <TR>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="p1ou8oc2zbuop2n1xbu2z1npq8n1"></A><SPAN class="xrefSee"><A>MODE=</A></SPAN></DIV>
    </TD>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="p059eyvz169q7bn1f2cudtsrcgnd"></A>ANSI
       </DIV>
    </TD>
 </TR>
 <TR>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="n13m2v7iioilifn0zvr8gfhhtsvo"></A><SPAN class="xrefSee"><A>MULTISTMT=</A></SPAN></DIV>
    </TD>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="p0maqasjudow9dn1239cgfw4q9dn"></A>NO
       </DIV>
    </TD>
 </TR>
 <TR>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="n02z5rj1vxeg77n1d1u572hpqw70"></A><SPAN class="xrefSee"><A>MULTI_DATASRC_OPT=</A></SPAN></DIV>
    </TD>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="p0whyrkxd4br9zn1t41pptomywzh"></A>IN_CLAUSE
       </DIV>
    </TD>
 </TR>
 <TR>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="p1d3f5xmymtitpn19r9m7dzohv8n"></A><SPAN class="xrefSee"><A>PREFETCH=</A></SPAN></DIV>
    </TD>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="n09ra3fbud6ul2n1l2ak78qn4qk0"></A>not enabled
       </DIV>
    </TD>
 </TR>
 <TR>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="n1953u6lq6okn1n12918vrrxommk"></A><SPAN class="xrefSee"><A>PRESERVE_COL_NAMES=</A></SPAN></DIV>
    </TD>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="n1bvo5m0kuiz93n1nh8o1jrft7sk"></A>YES
       </DIV>
    </TD>
 </TR>
 <TR>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="n1fv0x5twixip4n15ooervnrh5ry"></A><SPAN class="xrefSee"><A>PRESERVE_TAB_NAMES=</A></SPAN></DIV>
    </TD>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="p1j7gath667iwln18n66oa4566tq"></A>YES
       </DIV>
    </TD>
 </TR>
 <TR>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="n19tqfynmyefjin174lkyg2vjjiz"></A><SPAN class="xrefSee"><A>QUERY_BAND=</A></SPAN></DIV>
    </TD>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="n1rw1xdqvlf43gn1hqnconzh8s6x"></A>none
       </DIV>
    </TD>
 </TR>
 <TR>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="p0o3a7j4g3tnw0n1vttljf3ir8xk"></A><SPAN class="xrefSee"><A>READ_ISOLATION_LEVEL=</A></SPAN></DIV>
    </TD>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="p1uhqvxaf4ehffn1r1bnv28nimxi"></A>see <SPAN class="xrefSee"><A>Locking in the Teradata Interface</A></SPAN></DIV>
    </TD>
 </TR>
 <TR>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="n1mf0qk6b7rzj9n1bnlpnc5y336v"></A><SPAN class="xrefSee"><A>READ_LOCK_TYPE=</A></SPAN></DIV>
    </TD>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="n1nfy3ct8o6lqen167pq29vxj3ma"></A>none
       </DIV>
    </TD>
 </TR>
 <TR>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="n0mdc49xmyckohn1hq7v6p2xydst"></A><SPAN class="xrefSee"><A>READ_MODE_WAIT=</A></SPAN></DIV>
    </TD>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="n1jyatir45qeg6n14ozhwdslvx41"></A>none
       </DIV>
    </TD>
 </TR>
 <TR>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="n13hep1c1oe1vwn1cfw3m6am1egz"></A><SPAN class="xrefSee"><A>REREAD_EXPOSURE=</A></SPAN></DIV>
    </TD>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="p1vxg2q05iin7in1dj1931j3cj7k"></A>NO
       </DIV>
    </TD>
 </TR>
 <TR>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="n02hgwka1a09kon1exf7dh6q1km0"></A><SPAN class="xrefSee"><A>SCHEMA=</A></SPAN></DIV>
    </TD>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="p0kzhizymixo7an1eacrsoo0rk71"></A>your default Teradata
          database
       </DIV>
    </TD>
 </TR>
 <TR>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="p15xjlnfnkzgxcn11c3vz3lnjx24"></A><SPAN class="xrefSee"><A>SESSIONS=</A></SPAN></DIV>
    </TD>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="n1lpbyhx22dtuvn1tstrnw41z10c"></A>none
       </DIV>
    </TD>
 </TR>
 <TR>
    <TD style="text-align: left">
       <DIV class="paraTableFirst"><A name="n15zo8cx2uu8b2n1blqc9hf52oh8"></A><SPAN class="xrefSee"><A>SLEEP=</A></SPAN></DIV>
    </TD>
    <TD style="text-align: left">
       <DIV class="paraTableFirst"><A name="n1ggidfblrcfiqn1fsw2m8plnv8q"></A>6
       </DIV>
    </TD>
 </TR>
 <TR>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="p1vpmrub4a4idmn1fm71l8aej6en"></A><SPAN class="xrefSee"><A>SPOOL=</A></SPAN></DIV>
    </TD>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="p1j25qsbv5yjmkn1hxi9ee1m0edf"></A>YES
       </DIV>
    </TD>
 </TR>
 <TR>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="p1pt58gk0fuay5n1ey9i602n1yr3"></A><SPAN class="xrefSee"><A>SQL_FUNCTIONS=</A></SPAN></DIV>
    </TD>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="p1e1clxw1g0gugn19hefh6bdhzo4"></A>none
       </DIV>
    </TD>
 </TR>
 <TR>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="n0e2zg18u1be44n1uofv0drtom3f"></A><SPAN class="xrefSee"><A>SQL_FUNCTIONS_COPY=</A></SPAN></DIV>
    </TD>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="p1mjek46z8zs60n1vk0lopz9y6t1"></A>none
       </DIV>
    </TD>
 </TR>
 <TR>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="p17byu2ejgvvatn1f0lqe1jzdayb"></A><SPAN class="xrefSee"><A>SQLGENERATION=</A></SPAN></DIV>
    </TD>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="n096nff715dosln1cc2fhupm1o0d"></A>DBMS
       </DIV>
    </TD>
 </TR>
 <TR>
    <TD style="text-align: left">
       <DIV class="paraTableFirst"><A name="n0ybaqwwpn1rsqn17jpogamji8ot"></A><SPAN class="xrefSee"><A>TEMPORAL_QUALIFIER=</A></SPAN></DIV>
    </TD>
    <TD style="text-align: left">
       <DIV class="paraTableFirst"><A name="p1sjzszzk30vycn1v1eqw9z36wee"></A>CURRENT VALIDTIME for
          valid-time column; CURRENT TRANSACTIONTIME for transaction-time column
       </DIV>
    </TD>
 </TR>
 <TR>
    <TD style="text-align: left">
       <DIV class="paraTableFirst"><A name="p0xeyfrddyp9yen10gc18sh9rqwi"></A><SPAN class="xrefSee"><A>TENACITY=</A></SPAN></DIV>
    </TD>
    <TD style="text-align: left">
       <DIV class="paraTableFirst"><A name="p1hao6h1a0yh03n1lz3p93d5mpv8"></A>0 for FastLoad; 4 for
          FASTEXPORT= and MultiLoad
       </DIV>
    </TD>
 </TR>
 <TR>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="p1fu0x74em7qapn1t0h4yajb6g4l"></A><SPAN class="xrefSee"><A>TPT=</A></SPAN></DIV>
    </TD>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="p0kl8q7my6g9jin17e6y7i6ns7jo"></A>YES
       </DIV>
    </TD>
 </TR>
 <TR>
    <TD style="text-align: left">
       <DIV class="paraTableFirst"><A name="n1i8eb6x75dd5nn1vgjnwgpn1my1"></A><SPAN class="xrefSee"><A>TR_ENABLE_INTERRUPT=</A></SPAN></DIV>
    </TD>
    <TD style="text-align: left">
       <DIV class="paraTableFirst"><A name="p0y4i9u6j3ac90n1ruuerhxpascr"></A>NO
       </DIV>
    </TD>
 </TR>
 <TR>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="p0phqtcbiwqk2yn1mfp8yvprgp9v"></A><SPAN class="xrefSee"><A>UPDATE_ISOLATION_LEVEL=</A></SPAN></DIV>
    </TD>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="p1k591s6p5j9lmn1k4e3p39kuyp5"></A>see <SPAN class="xrefSee"><A >Locking in the Teradata Interface</A></SPAN></DIV>
    </TD>
 </TR>
 <TR>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="p14y1a50swckx1n1x9v1u4mygdjk"></A><SPAN class="xrefSee"><A>UPDATE_LOCK_TYPE= LIBNAME Option</A></SPAN></DIV>
    </TD>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="n1ud17uh6dfoe8n1l5rxexidzswb"></A>none
       </DIV>
    </TD>
 </TR>
 <TR>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="p0f9ikxt2l823ln1b9ssf75ujxfn"></A><SPAN class="xrefSee"><A >UPDATE_MODE_WAIT=</A></SPAN></DIV>
    </TD>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="n0vypcgdhtrr2on1ax5tbb6eqtxy"></A>none
       </DIV>
    </TD>
 </TR>
 <TR>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="n070psk70999qin167hupbp0a24m"></A><SPAN class="xrefSee"><A>UTILCONN_TRANSIENT=</A></SPAN></DIV>
    </TD>
    <TD style="text-align: left" valign="top">
       <DIV class="paraTableFirst"><A name="p047pnwd1a4yqrn1emjq3byouzzw"></A>NO
       </DIV>
    </TD>
 </TR>
 </TABLE>

*******************************************

##Teradata LIBNAME Statement Examples

These examples show how to make the proper connection by using the USER= and PASSWORD= connection options. Teradata requires these options, and you must use them together.

This example shows how to connect to a single or NULL realm.

    libname x teradata user=”johndoe@LDAP” password=”johndoeworld”;

Here is an example of how to make the connection to a specific realm where multiple realms are configured.

    libname x teradata user=”johndoe@LDAPjsrealm” password=”johndoeworld”;

Here is an example of a configuration with a single or NULL realm that contains a password with an embedded @ symbol. The password must contain a required backslash (\), which must precede the embedded @ symbol.

    libname x teradata user="johndoe@LDAP" password="johndoe\@world"
