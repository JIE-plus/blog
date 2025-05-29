---
title: spring
description: spring
date: 2025-05-23
tags:
  - spring
---

# Spring

## IoC：是Inversion of Control 控制反转

- Spring通过 **`IoC容器`**来管理
- **`1、所有Java对象的实例化和初始化，2、控制对象与对象之间的依赖关系`**
- IoC容器管理的Java对象称为 **`Spring Bean`**，它与使用关键字new创建的Java对象没有任何区别

## IoC的实例化和初始化工作过程

1. xml配置文件 (Bean定义信息  BeanDefinition)
2. 抽象（接口 BeanDefinitionReader）通过接口读取配置文件信息加载到IoC容器中
3. IoC容器 （BeanFactory工厂+反射）
   1. 获取到Bean定义信息
   2. 实例化（BeanFactory工厂+反射）
   3. 初始化
   4. 得到最终对象 
4. 获取对象： context.getBean("xxx");

### User实体类

```java
public class User {

    public User() {
        System.out.println("0、调用无参构造方法！");
    }

    public void add() {
        System.out.println("add().....");
    }
}

```

### xml配置文件 

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <!-- user对象创建
        bean标签
            id属性：唯一标识
            class属性：要创建对象所在类的全路径（包名+类名）
      -->
    <bean id="user" class="com.joker.spring6.User"></bean>

</beans>
```

### 反射

```java
/**
* 反射创建对象
*/
@Test
public void testUserObject1() throws Exception {
    // 获取class对象
    Class clazz = Class.forName("com.joker.spring6.User");
    // 调用方法创建对象
    //Object o = clazz.newInstance();
    User o = (User)clazz.getDeclaredConstructor().newInstance();
    System.out.println("o = " + o);
}
```

### 获取对象

```java
/**
* 如何使用返回创建的对象
* 1、加载bean.xml配置文件
* 2、对xml文件进行解析操作
* 3、获取xml文件bean标签属性值 - id属性值和class属性值
* 4、使用反射根据类全路径创建对象
* 5、创建对象放在Map<String, BeanDefinition> beanDefinitionMap
*      key: 唯一标识  value：类的定义（描述信息）
*/
@Test
public void testUserObject() {
    // 加载spring配置文件，对象创建
    ApplicationContext context = new ClassPathXmlApplicationContext("bean.xml");
    // 获取创建的对象
    User user = (User)context.getBean("user");
    System.out.println("1、" + user);
    // 使用对象调用方法进行测试
    System.out.print("2、");
    user.add();
}
```

```verilog
0、调用无参构造方法！
1、com.joker.spring6.User@5c48c0c0
2、add().....
```

## 获取Bean

- 方式一：根据id获取bean
- 方式二：根据类型获取bean
- 方式三：根据id和类型获取bean

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="user" class="com.joker.spring6.iocxml.User"></bean>

</beans>
```

```java
@Test
public void testGetBean() {
    ApplicationContext context = new ClassPathXmlApplicationContext("bean.xml");
    // 1、根据id获取bean
    User user1 = (User)context.getBean("user");
    System.out.println("1、根据id获取bean: " + user1);
    // 2、根据类型获取bean
    User user2 = context.getBean(User.class);
    System.out.println("2、根据类型获取bean" + user2);
    // 3、根据id和类型获取bean
    User user3 = context.getBean("user", User.class);
    System.out.println("3、根据id和类型获取bean" + user3);
}
```

```verilog
2025-05-22 10:36:44 802 [main] DEBUG org.springframework.context.support.ClassPathXmlApplicationContext - Refreshing org.springframework.context.support.ClassPathXmlApplicationContext@68fa0ba8
2025-05-22 10:36:44 880 [main] DEBUG org.springframework.beans.factory.xml.XmlBeanDefinitionReader - Loaded 1 bean definitions from class path resource [bean.xml]
2025-05-22 10:36:44 900 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'user'
1、根据id获取bean: com.joker.spring6.iocxml.User@681aad3b
2、根据类型获取beancom.joker.spring6.iocxml.User@681aad3b
3、根据id和类型获取beancom.joker.spring6.iocxml.User@681aad3b
```

### 根据类型获取bean，当IOC容器中一共配置了两个即配置文件xml中配置两个实体类（id不同，但类相同即类的路径相同）是会报错的

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="user" class="com.joker.spring6.iocxml.User"></bean>
    <bean id="user1" class="com.joker.spring6.iocxml.User"></bean>

</beans>
```

```java
@Test
public void testGetBean() {
    ApplicationContext context = new ClassPathXmlApplicationContext("bean.xml");
    // 2、根据类型获取bean
    User user2 = context.getBean(User.class);
    System.out.println("2、根据类型获取bean" + user2);
}
```

```verilog
2025-05-22 11:01:43 047 [main] DEBUG org.springframework.context.support.ClassPathXmlApplicationContext - Refreshing org.springframework.context.support.ClassPathXmlApplicationContext@5dcb4f5f
2025-05-22 11:01:43 156 [main] DEBUG org.springframework.beans.factory.xml.XmlBeanDefinitionReader - Loaded 2 bean definitions from class path resource [bean.xml]
2025-05-22 11:01:43 177 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'user'
2025-05-22 11:01:43 186 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'user1'

org.springframework.beans.factory.NoUniqueBeanDefinitionException: No qualifying bean of type 'com.joker.spring6.iocxml.User' available: expected single matching bean but found 2: user,user1
```

### 根据类型获取bean，当类型为接口时，实现类只配置在IoC容器（配置在xml中只有一个）时可以的，前提是bean唯一

```java
public interface UserDao {
    public void run();
}
```

```java
public class UserDaoImpl implements UserDao{
    public void run() {
        System.out.println("UserDaoImpl run......");
    }
}
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="userDaoImpl" class="com.joker.spring6.iocxml.bean.UserDaoImpl"></bean>

</beans>
```

```java
@Test
public void testUserDao() {
    ApplicationContext context = new ClassPathXmlApplicationContext("bean.xml");
    UserDao userDao = context.getBean(UserDao.class);
    userDao.run();
}
```

```verilog
2025-05-22 11:15:48 252 [main] DEBUG org.springframework.context.support.ClassPathXmlApplicationContext - Refreshing org.springframework.context.support.ClassPathXmlApplicationContext@68fa0ba8
2025-05-22 11:15:48 359 [main] DEBUG org.springframework.beans.factory.xml.XmlBeanDefinitionReader - Loaded 1 bean definitions from class path resource [bean.xml]
2025-05-22 11:15:48 384 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'userDaoImpl'
UserDaoImpl run......
```

### 根据类型获取bean，当类型为接口时，实现类有多个配置在IoC容器（配置在xml中多个）时不可以的

```java
public interface UserDao {
    public void run();
}
```

```java
public class UserDaoImpl implements UserDao{
    public void run() {
        System.out.println("UserDaoImpl run......");
    }
}
```

```java
public class PersonDaoImpl implements UserDao{
    public void run() {
        System.out.println("PersonDaoImpl run......");
    }
}
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="userDaoImpl" class="com.joker.spring6.iocxml.bean.UserDaoImpl"></bean>
    <bean id="personDaoImpl" class="com.joker.spring6.iocxml.bean.PersonDaoImpl"></bean>

</beans>
```

```java
@Test
public void testUserDao() {
    ApplicationContext context = new ClassPathXmlApplicationContext("bean.xml");
    UserDao userDao = context.getBean(UserDao.class);
    userDao.run();
}
```

```verilog
2025-05-22 11:20:54 637 [main] DEBUG org.springframework.context.support.ClassPathXmlApplicationContext - Refreshing org.springframework.context.support.ClassPathXmlApplicationContext@289710d9
2025-05-22 11:20:54 748 [main] DEBUG org.springframework.beans.factory.xml.XmlBeanDefinitionReader - Loaded 2 bean definitions from class path resource [bean.xml]
2025-05-22 11:20:54 777 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'userDaoImpl'
2025-05-22 11:20:54 785 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'personDaoImpl'

org.springframework.beans.factory.NoUniqueBeanDefinitionException: No qualifying bean of type 'com.joker.spring6.iocxml.bean.UserDao' available: expected single matching bean but found 2: userDaoImpl,personDaoImpl
```

### 结论

- 根据类型来获取bean时，在满足bean唯一性的前提下，其实只是看：『对象 **instanceof** 指定的类型』的返回结果，只要返回的是true就可以认定为和类型匹配，能够获取到。
- java中，instanceof运算符用于判断前面的对象是否是后面的类，或其子类、实现类的实例。如果是返回true，否则返回false。也就是说：用instanceof关键字做判断时， instanceof 操作符的左右操作必须有继承或实现关系

## 依赖注入

- **指Spring创建对象的过程中，将对象依赖属性通过配置进行注入**
- **类有属性，创建对象过程中，向属性设置值**

### 依赖注入常见的实现方式包括两种：

- 第一种：set注入
- 第二种：构造注入

**所以结论是：IOC 就是一种控制反转的思想， 而 DI 是对IoC的一种具体实现。**

**Bean管理说的是：Bean对象的创建，以及Bean对象中属性的赋值（或者叫做Bean对象之间关系的维护）。**

- 基于XML管理bean
- 基于注解管理bean

### 原生依赖注入（属性的赋值）Set注入和构造注入

```java
public class Book {
    private String bname;
    private String author;
    
    public Book(String bname, String author) {
        this.bname = bname;
        this.author = author;
    }
    public Book() {
    }
    public String getBname() {
        return bname;
    }
    public void setBname(String bname) {
        this.bname = bname;
    }
    public String getAuthor() {
        return author;
    }
    public void setAuthor(String author) {
        this.author = author;
    }
    @Override
    public String toString() {
        return "Book{" +
                "bname='" + bname + '\'' +
                ", author='" + author + '\'' +
                '}';
    }
    public static void main(String[] args) {
        Book book1 = new Book();
        // Set注入
        book1.setBname("java");
        book1.setAuthor("joker");
        System.out.println("book1 = " + book1);
        // 构造注入
        Book book2 = new Book("python", "小杰");
        System.out.println("book2 = " + book2);
    }
}
```

```log
book1 = Book{bname='java', author='joker'}
book2 = Book{bname='python', author='小杰'}
```

### 基于XML管理bean使用Set方法依赖注入方式

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <!-- 1、Set方法   -->
    <bean id="book1" class="com.joker.spring6.iocxml.di.Book">
        <property name="bname" value="java"></property>
        <property name="author" value="joker"></property>
    </bean>
</beans>
```

```java
package com.joker.spring6.iocxml.di;

public class Book {

    private String bname;
    private String author;

    public Book(String bname, String author) {
        this.bname = bname;
        this.author = author;
    }

    public Book() {
        System.out.println("Book的无参构造run...");
    }

    public String getBname() {
        return bname;
    }
    public void setBname(String bname) {
        this.bname = bname;
    }
    public String getAuthor() {
        return author;
    }
    public void setAuthor(String author) {
        this.author = author;
    }
    @Override
    public String toString() {
        return "Book{" +
                "bname='" + bname + '\'' +
                ", author='" + author + '\'' +
                '}';
    }
}

```

```java
@Test
public void testBook1() {
    ApplicationContext context = new ClassPathXmlApplicationContext("bean-di.xml");
    Book book1 = context.getBean("book1", Book.class);
    System.out.println("book1 = " + book1);
}
```

```log
2025-05-23 10:16:17 786 [main] DEBUG org.springframework.context.support.ClassPathXmlApplicationContext - Refreshing org.springframework.context.support.ClassPathXmlApplicationContext@5812f68b
2025-05-23 10:16:17 905 [main] DEBUG org.springframework.beans.factory.xml.XmlBeanDefinitionReader - Loaded 1 bean definitions from class path resource [bean-di.xml]
2025-05-23 10:16:17 928 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'book1'
Book的无参构造run...
book1 = Book{bname='java', author='joker'}
```

**注意：set方法使用了无参构造参数进行实例时被调用**

### 基于XML管理bean使用构造方法依赖注入方式

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <!-- 2、构造方法注入   -->
    <bean id="book2" class="com.joker.spring6.iocxml.di.Book">
        <constructor-arg name="bname" value="c++" />
        <constructor-arg name="author" value="小杰" />
    </bean>
</beans>
```

```java
package com.joker.spring6.iocxml.di;

public class Book {

    private String bname;
    private String author;

    public Book(String bname, String author) {
        System.out.println("Book的有参构造run...");
        this.bname = bname;
        this.author = author;
    }
    public Book() {
        System.out.println("Book的无参构造run...");
    }
    public String getBname() {
        return bname;
    }
    public void setBname(String bname) {
        this.bname = bname;
    }
    public String getAuthor() {
        return author;
    }
    public void setAuthor(String author) {
        this.author = author;
    }
    @Override
    public String toString() {
        return "Book{" +
                "bname='" + bname + '\'' +
                ", author='" + author + '\'' +
                '}';
    }
}

```

```java
@Test
public void testBook2() {
    ApplicationContext context = new ClassPathXmlApplicationContext("bean-di.xml");
    Book book2 = context.getBean("book2", Book.class);
    System.out.println("book2 = " + book2);
}
```

```java
2025-05-23 10:32:49 519 [main] DEBUG org.springframework.context.support.ClassPathXmlApplicationContext - Refreshing org.springframework.context.support.ClassPathXmlApplicationContext@503ecb24
2025-05-23 10:32:49 635 [main] DEBUG org.springframework.beans.factory.xml.XmlBeanDefinitionReader - Loaded 1 bean definitions from class path resource [bean-di.xml]
2025-05-23 10:32:49 657 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'book2'
2025-05-23 10:32:49 681 [main] WARN org.springframework.core.LocalVariableTableParameterNameDiscoverer - Using deprecated '-debug' fallback for parameter name resolution. Compile the affected code with '-parameters' instead or avoid its introspection: com.joker.spring6.iocxml.di.Book
Book的有参构造run...
book2 = Book{bname='c++', author='小杰'}
```

### 基于XML管理bean构造方法和Set方法依赖注入方式的属性为引用类型，属性值为null处理（String类型直接使用value="null"）

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <!-- 1、Set方法注入   -->
    <bean id="book1" class="com.joker.spring6.iocxml.di.Book">
        <property name="bname" value="java" />
        <property name="author" value="joker"/>
        <property name="othors">
            <null />
        </property>
    </bean>

    <!-- 2、构造方法注入   -->
    <bean id="book2" class="com.joker.spring6.iocxml.di.Book">
        <constructor-arg name="bname" value="c++" />
        <constructor-arg name="author" value="小杰" />
        <constructor-arg name="othors">
            <null />
        </constructor-arg>
    </bean>
</beans>
```

```java
public class Book {
    private String bname;
    private String author;
    private String othors;
    public Book(String bname, String author, String othors) {
        System.out.println("Book的有参构造run...");
        this.bname = bname;
        this.author = author;
        this.othors = othors;
    }
    public Book() {
        System.out.println("Book的无参构造run...");
    }
    public String getOthors() {
        return othors;
    }
    public void setOthors(String othors) {
        this.othors = othors;
    }
    public String getBname() {
        return bname;
    }
    public void setBname(String bname) {
        this.bname = bname;
    }
    public String getAuthor() {
        return author;
    }
    public void setAuthor(String author) {
        this.author = author;
    }
    @Override
    public String toString() {
        return "Book{" +
                "bname='" + bname + '\'' +
                ", author='" + author + '\'' +
                ", othors='" + othors + '\'' +
                '}';
    }
    public static void main(String[] args) {
        Book book1 = new Book();
        // Set注入
        book1.setBname("java");
        book1.setAuthor("joker");
        book1.setOthors(null);
        System.out.println("book1 = " + book1);
        // 构造注入
        Book book2 = new Book("python", "小杰", null);
        System.out.println("book2 = " + book2);
    }
}
```

```java
@Test
public void testBook1and2() {
    ApplicationContext context = new ClassPathXmlApplicationContext("bean-di.xml");
    Book book1 = context.getBean("book1", Book.class);
    System.out.println("book1 = " + book1);

    Book book2 = context.getBean("book2", Book.class);
    System.out.println("book2 = " + book2);
}
```

```verilog
2025-05-23 10:50:04 963 [main] DEBUG org.springframework.context.support.ClassPathXmlApplicationContext - Refreshing org.springframework.context.support.ClassPathXmlApplicationContext@45312be2
2025-05-23 10:50:05 062 [main] DEBUG org.springframework.beans.factory.xml.XmlBeanDefinitionReader - Loaded 2 bean definitions from class path resource [bean-di.xml]
2025-05-23 10:50:05 080 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'book1'
Book的无参构造run...
2025-05-23 10:50:05 113 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'book2'
2025-05-23 10:50:05 122 [main] WARN org.springframework.core.LocalVariableTableParameterNameDiscoverer - Using deprecated '-debug' fallback for parameter name resolution. Compile the affected code with '-parameters' instead or avoid its introspection: com.joker.spring6.iocxml.di.Book
Book的有参构造run...
book1 = Book{bname='java', author='joker', othors='null'}
book2 = Book{bname='c++', author='小杰', othors='null'}
```

### 基于XML管理bean构造方法和Set方法依赖注入方式的属性值包含xml实体（<>）

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <!-- 1、Set方法注入   -->
    <!-- 小于号在XML文档中用来定义标签的开始，不能随便使用 -->
    <!-- 解决方案一：使用XML实体来代替 -->
    <bean id="book1" class="com.joker.spring6.iocxml.di.Book">
        <property name="bname" value="java" />
        <property name="author" value="joker"/>
        <property name="othors" value="&lt;&gt;"/>
    </bean>

    <!-- 2、构造方法注入   -->
    <!-- 小于号在XML文档中用来定义标签的开始，不能随便使用 -->
    <!-- 解决方案一：使用XML实体来代替 -->
    <bean id="book2" class="com.joker.spring6.iocxml.di.Book">
        <constructor-arg name="bname" value="c++" />
        <constructor-arg name="author" value="小杰" />
        <constructor-arg name="othors" value="&lt;&gt;"/>
    </bean>
</beans>
```

```java
@Test
public void testBook1and2() {
    ApplicationContext context = new ClassPathXmlApplicationContext("bean-di.xml");
    Book book1 = context.getBean("book1", Book.class);
    System.out.println("book1 = " + book1);

    Book book2 = context.getBean("book2", Book.class);
    System.out.println("book2 = " + book2);
}
```

```verilog
2025-05-23 15:09:02 480 [main] DEBUG org.springframework.context.support.ClassPathXmlApplicationContext - Refreshing org.springframework.context.support.ClassPathXmlApplicationContext@3cdf2c61
2025-05-23 15:09:02 598 [main] DEBUG org.springframework.beans.factory.xml.XmlBeanDefinitionReader - Loaded 2 bean definitions from class path resource [bean-di.xml]
2025-05-23 15:09:02 628 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'book1'
Book的无参构造run...
2025-05-23 15:09:02 661 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'book2'
2025-05-23 15:09:02 671 [main] WARN org.springframework.core.LocalVariableTableParameterNameDiscoverer - Using deprecated '-debug' fallback for parameter name resolution. Compile the affected code with '-parameters' instead or avoid its introspection: com.joker.spring6.iocxml.di.Book
Book的有参构造run...
book1 = Book{bname='java', author='joker', othors='<>'}
book2 = Book{bname='c++', author='小杰', othors='<>'}

```

### 基于XML管理bean构造方法和Set方法依赖注入方式的属性值包含特殊字符使用CDATA节

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <!-- 1、Set方法注入   -->
    <!-- 解决方案二：使用CDATA节 -->
    <!-- CDATA中的C代表Character，是文本、字符的含义，CDATA就表示纯文本数据 -->
    <!-- XML解析器看到CDATA节就知道这里是纯文本，就不会当作XML标签或属性来解析 -->
    <!-- 所以CDATA节中写什么符号都随意 -->
    <bean id="book1" class="com.joker.spring6.iocxml.di.Book">
        <property name="bname" value="java" />
        <property name="author" value="joker"/>
        <property name="othors">
            <value><![CDATA[/\a < b/\"]]></value>
        </property>
    </bean>

    <!-- 2、构造方法注入   -->
    <!-- 解决方案二：使用CDATA节 -->
    <!-- CDATA中的C代表Character，是文本、字符的含义，CDATA就表示纯文本数据 -->
    <!-- XML解析器看到CDATA节就知道这里是纯文本，就不会当作XML标签或属性来解析 -->
    <!-- 所以CDATA节中写什么符号都随意 -->
    <bean id="book2" class="com.joker.spring6.iocxml.di.Book">
        <constructor-arg name="bname" value="c++" />
        <constructor-arg name="author" value="小杰" />
        <constructor-arg name="othors">
            <value><![CDATA[/\a < b/\"]]></value>
        </constructor-arg>
    </bean>
</beans>
```

```verilog
2025-05-23 15:19:05 168 [main] DEBUG org.springframework.context.support.ClassPathXmlApplicationContext - Refreshing org.springframework.context.support.ClassPathXmlApplicationContext@673be18f
2025-05-23 15:19:05 318 [main] DEBUG org.springframework.beans.factory.xml.XmlBeanDefinitionReader - Loaded 2 bean definitions from class path resource [bean-di.xml]
2025-05-23 15:19:05 349 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'book1'
Book的无参构造run...
2025-05-23 15:19:05 387 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'book2'
2025-05-23 15:19:05 399 [main] WARN org.springframework.core.LocalVariableTableParameterNameDiscoverer - Using deprecated '-debug' fallback for parameter name resolution. Compile the affected code with '-parameters' instead or avoid its introspection: com.joker.spring6.iocxml.di.Book
Book的有参构造run...
book1 = Book{bname='java', author='joker', othors='/\a < b/\"'}
book2 = Book{bname='c++', author='小杰', othors='/\a < b/\"'}
```

### 基于XML管理bean构造方法和Set方法依赖注入----为对象类型属性赋值

#### 方式一：引用外部bean -- ref

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="dept1" class="com.joker.spring6.iocxml.idtest.Dept">
        <property name="dname" value="技术部门" />
    </bean>

    <bean id="emp1" class="com.joker.spring6.iocxml.idtest.Emp">
        <property name="ename" value="joker"/>
        <property name="age" value="18"/>
        <property name="dept" ref="dept1"/>
    </bean>

    <bean id="emp2" class="com.joker.spring6.iocxml.idtest.Emp">
        <constructor-arg name="ename" value="zard"/>
        <constructor-arg name="age" value="20"/>
        <constructor-arg name="dept" ref="dept1"/>
    </bean>
</beans>
```

```java
// 部门类
public class Dept {
    private String dname;
    public Dept() {
    }
    public Dept(String dname) {
        this.dname = dname;
    }
    public String getDname() {
        return dname;
    }
    @Override
    public String toString() {
        return "Dept{" +
                "dname='" + dname + '\'' +
                '}';
    }
    public void setDname(String dname) {
        this.dname = dname;
    }
    public void info() {
        System.out.println("部门名称：" + dname);
    }
}
```

```java
public class Emp {
    // 用工属于某个部门
    private Dept dept;
    private String ename;
    private Integer age;
    public void work() {
        System.out.println(ename + "emp work...." + age);
        dept.info();
    }
    public Emp() {
    }
    public Emp(Dept dept, String ename, Integer age) {
        this.dept = dept;
        this.ename = ename;
        this.age = age;
    }
    public Dept getDept() {
        return dept;
    }
    public void setDept(Dept dept) {
        this.dept = dept;
    }
    public String getEname() {
        return ename;
    }
    public void setEname(String ename) {
        this.ename = ename;
    }
    public Integer getAge() {
        return age;
    }
    public void setAge(Integer age) {
        this.age = age;
    }
    @Override
    public String toString() {
        return "Emp{" +
                "dept=" + dept +
                ", ename='" + ename + '\'' +
                ", age=" + age +
                '}';
    }
}
```

```java
@Test
public void testRefObject1() {
    ApplicationContext context = new ClassPathXmlApplicationContext("bean-ditest.xml");
    Emp emp1 = context.getBean("emp1", Emp.class);
    Emp emp2 = context.getBean("emp2", Emp.class);
    emp1.work();
    emp2.work();
}
```

```verilog
2025-05-26 09:57:54 193 [main] DEBUG org.springframework.context.support.ClassPathXmlApplicationContext - Refreshing org.springframework.context.support.ClassPathXmlApplicationContext@32c726ee
2025-05-26 09:57:54 302 [main] DEBUG org.springframework.beans.factory.xml.XmlBeanDefinitionReader - Loaded 3 bean definitions from class path resource [bean-ditest.xml]
2025-05-26 09:57:54 320 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'dept1'
2025-05-26 09:57:54 354 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'emp1'
2025-05-26 09:57:54 358 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'emp2'
2025-05-26 09:57:54 366 [main] WARN org.springframework.core.LocalVariableTableParameterNameDiscoverer - Using deprecated '-debug' fallback for parameter name resolution. Compile the affected code with '-parameters' instead or avoid its introspection: com.joker.spring6.iocxml.idtest.Emp
jokeremp work....18
部门名称：技术部门
zardemp work....20
部门名称：技术部门
```

- 如果错把ref属性写成了value属性，会抛出异常： Caused by: java.lang.IllegalStateException: Cannot convert value of type 'java.lang.String' to required type 'com.atguigu.spring6.bean.Clazz' for property 'clazz': no matching editors or conversion strategy found 
- 意思是不能把String类型转换成我们要的Clazz类型，说明我们使用value属性时，Spring只把这个属性看做一个普通的字符串，不会认为这是一个bean的id，更不会根据它去找到bean来赋值

#### 方式二：引用内部bean 

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">
    <!-- 内部引用 -->
    <bean id="emp3" class="com.joker.spring6.iocxml.idtest.Emp">
        <property name="ename" value="嘻嘻" />
        <property name="age" value="18" />
        <property name="dept">
            <bean class="com.joker.spring6.iocxml.idtest.Dept">
                <property name="dname" value="销售部"/>
            </bean>
        </property>
    </bean>

    <bean id="emp4" class="com.joker.spring6.iocxml.idtest.Emp">
        <constructor-arg name="ename" value="哈哈" />
        <constructor-arg name="age" value="20" />
        <constructor-arg name="dept">
            <bean class="com.joker.spring6.iocxml.idtest.Dept">
                <property name="dname" value="销售部"/>
            </bean>
        </constructor-arg>
    </bean>

    <bean id="emp5" class="com.joker.spring6.iocxml.idtest.Emp">
        <property name="ename" value="嗯嗯" />
        <property name="age" value="28" />
        <property name="dept">
            <bean class="com.joker.spring6.iocxml.idtest.Dept">
                <constructor-arg name="dname" value="销售部"/>
            </bean>
        </property>
    </bean>
</beans>
```

```java
@Test
public void testRefObject2() {
    ApplicationContext context = new ClassPathXmlApplicationContext("bean-ditest.xml");
    Emp emp3 = context.getBean("emp3", Emp.class);
    Emp emp4 = context.getBean("emp4", Emp.class);
    Emp emp5 = context.getBean("emp5", Emp.class);
    emp3.work();
    emp4.work();
    emp5.work();
}
```

```verilog
2025-05-26 10:29:48 302 [main] DEBUG org.springframework.context.support.ClassPathXmlApplicationContext - Refreshing org.springframework.context.support.ClassPathXmlApplicationContext@32c726ee
2025-05-26 10:29:48 425 [main] DEBUG org.springframework.beans.factory.xml.XmlBeanDefinitionReader - Loaded 3 bean definitions from class path resource [bean-ditest.xml]
2025-05-26 10:29:48 444 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'emp3'
2025-05-26 10:29:48 484 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'emp4'
2025-05-26 10:29:48 494 [main] WARN org.springframework.core.LocalVariableTableParameterNameDiscoverer - Using deprecated '-debug' fallback for parameter name resolution. Compile the affected code with '-parameters' instead or avoid its introspection: com.joker.spring6.iocxml.idtest.Emp
2025-05-26 10:29:48 496 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'emp5'
2025-05-26 10:29:48 497 [main] WARN org.springframework.core.LocalVariableTableParameterNameDiscoverer - Using deprecated '-debug' fallback for parameter name resolution. Compile the affected code with '-parameters' instead or avoid its introspection: com.joker.spring6.iocxml.idtest.Dept
嘻嘻emp work....18
部门名称：销售部
哈哈emp work....20
部门名称：销售部
嗯嗯emp work....28
部门名称：销售部
```

#### 方式三：级联属性赋值

##### 外部引用

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="dept1" class="com.joker.spring6.iocxml.idtest.Dept">
        <property name="dname" value="技术部门" />
    </bean>

    <!-- 外部引用  -->
    <bean id="emp1" class="com.joker.spring6.iocxml.idtest.Emp">
        <property name="ename" value="joker"/>
        <property name="age" value="18"/>
        <property name="dept" ref="dept1"/>
        <property name="dept.dname" value="研发部门"/>
    </bean>

    <bean id="emp2" class="com.joker.spring6.iocxml.idtest.Emp">
        <constructor-arg name="ename" value="zard"/>
        <constructor-arg name="age" value="20"/>
        <constructor-arg name="dept" ref="dept1"/>
        <property name="dept.dname" value="科研部门"/>
    </bean>
</beans>
```

```java
@Test
public void testRefObject1() {
    ApplicationContext context = new ClassPathXmlApplicationContext("bean-ditest.xml");
    Emp emp1 = context.getBean("emp1", Emp.class);
    Emp emp2 = context.getBean("emp2", Emp.class);
    emp1.work();
    emp2.work();
}
```

```verilog
2025-05-26 10:41:34 589 [main] DEBUG org.springframework.context.support.ClassPathXmlApplicationContext - Refreshing org.springframework.context.support.ClassPathXmlApplicationContext@7a1a14a4
2025-05-26 10:41:34 688 [main] DEBUG org.springframework.beans.factory.xml.XmlBeanDefinitionReader - Loaded 3 bean definitions from class path resource [bean-ditest.xml]
2025-05-26 10:41:34 723 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'dept1'
2025-05-26 10:41:34 754 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'emp1'
2025-05-26 10:41:34 760 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'emp2'
2025-05-26 10:41:34 770 [main] WARN org.springframework.core.LocalVariableTableParameterNameDiscoverer - Using deprecated '-debug' fallback for parameter name resolution. Compile the affected code with '-parameters' instead or avoid its introspection: com.joker.spring6.iocxml.idtest.Emp
jokeremp work....18
部门名称：科研部门
zardemp work....20
部门名称：科研部门
```

##### 内部引用

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">
    <!-- 内部引用 -->
    <bean id="emp3" class="com.joker.spring6.iocxml.idtest.Emp">
        <property name="ename" value="嘻嘻" />
        <property name="age" value="18" />
        <property name="dept">
            <bean class="com.joker.spring6.iocxml.idtest.Dept">
                <property name="dname" value="销售部"/>
            </bean>
        </property>
        <property name="dept.dname" value="销售3部门"/>
    </bean>

    <bean id="emp4" class="com.joker.spring6.iocxml.idtest.Emp">
        <constructor-arg name="ename" value="哈哈" />
        <constructor-arg name="age" value="20" />
        <constructor-arg name="dept">
            <bean class="com.joker.spring6.iocxml.idtest.Dept">
                <property name="dname" value="销售部"/>
            </bean>
        </constructor-arg>
        <property name="dept.dname" value="销售4部门"/>
    </bean>

    <bean id="emp5" class="com.joker.spring6.iocxml.idtest.Emp">
        <property name="ename" value="嗯嗯" />
        <property name="age" value="28" />
        <property name="dept">
            <bean class="com.joker.spring6.iocxml.idtest.Dept">
                <constructor-arg name="dname" value="销售部"/>
            </bean>
        </property>
        <property name="dept.dname" value="销售5部门"/>
    </bean>
</beans>
```

```java
@Test
public void testRefObject2() {
    ApplicationContext context = new ClassPathXmlApplicationContext("bean-ditest.xml");
    Emp emp3 = context.getBean("emp3", Emp.class);
    Emp emp4 = context.getBean("emp4", Emp.class);
    Emp emp5 = context.getBean("emp5", Emp.class);
    emp3.work();
    emp4.work();
    emp5.work();
}
```

```verilog
2025-05-26 10:46:30 857 [main] DEBUG org.springframework.context.support.ClassPathXmlApplicationContext - Refreshing org.springframework.context.support.ClassPathXmlApplicationContext@35432107
2025-05-26 10:46:30 967 [main] DEBUG org.springframework.beans.factory.xml.XmlBeanDefinitionReader - Loaded 3 bean definitions from class path resource [bean-ditest.xml]
2025-05-26 10:46:30 995 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'emp3'
2025-05-26 10:46:31 041 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'emp4'
2025-05-26 10:46:31 050 [main] WARN org.springframework.core.LocalVariableTableParameterNameDiscoverer - Using deprecated '-debug' fallback for parameter name resolution. Compile the affected code with '-parameters' instead or avoid its introspection: com.joker.spring6.iocxml.idtest.Emp
2025-05-26 10:46:31 052 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'emp5'
2025-05-26 10:46:31 053 [main] WARN org.springframework.core.LocalVariableTableParameterNameDiscoverer - Using deprecated '-debug' fallback for parameter name resolution. Compile the affected code with '-parameters' instead or avoid its introspection: com.joker.spring6.iocxml.idtest.Dept
嘻嘻emp work....18
部门名称：销售3部门
哈哈emp work....20
部门名称：销售4部门
嗯嗯emp work....28
部门名称：销售5部门
```

### 基于XML管理bean构造方法和Set方法依赖注入----为数组类型属性赋值

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="dept" class="com.joker.spring6.iocxml.idtest.Dept">
        <property name="dname" value="研发部门" />
    </bean>

    <bean id="emp1" class="com.joker.spring6.iocxml.idtest.Emp">
        <property name="ename" value="joker"/>
        <property name="dept" ref="dept"/>
        <property name="loves">
            <array>
                <value>台球</value>
                <value>打麻将</value>
                <value>睡觉</value>
            </array>
        </property>
    </bean>

    <bean id="emp2" class="com.joker.spring6.iocxml.idtest.Emp">
        <constructor-arg name="ename" value="zard"/>
        <constructor-arg name="dept" ref="dept"/>
        <constructor-arg name="age" value="11"/>
        <constructor-arg name="loves">
            <array>
                <value>台球</value>
                <value>打麻将</value>
                <value>睡觉</value>
            </array>
        </constructor-arg>
    </bean>
</beans>
```

```java
package com.joker.spring6.iocxml.idtest;

import java.util.Arrays;

public class Emp {

    // 用工属于某个部门
    private Dept dept;
    private String ename;
    private Integer age;
    private String[] loves;
    public void work() {
        System.out.println(ename + "emp work...." + age);
        dept.info();
        System.out.println(Arrays.toString(loves));;
    }
    public Emp() {
    }
    public Emp(Dept dept, String ename, Integer age, String[] loves) {
        this.dept = dept;
        this.ename = ename;
        this.age = age;
        this.loves = loves;
    }
    public Dept getDept() {
        return dept;
    }
    public void setDept(Dept dept) {
        this.dept = dept;
    }
    public String getEname() {
        return ename;
    }
    public void setEname(String ename) {
        this.ename = ename;
    }
    public Integer getAge() {
        return age;
    }
    public void setAge(Integer age) {
        this.age = age;
    }
    public String[] getLoves() {
        return loves;
    }
    public void setLoves(String[] loves) {
        this.loves = loves;
    }
    @Override
    public String toString() {
        return "Emp{" +
                "dept=" + dept +
                ", ename='" + ename + '\'' +
                ", age=" + age +
                ", loves=" + Arrays.toString(loves) +
                '}';
    }
}

```

```java
@Test
public void testArray() {
    ApplicationContext context = new ClassPathXmlApplicationContext("bean-array.xml");
    Emp emp1 = context.getBean("emp1", Emp.class);
    Emp emp2 = context.getBean("emp2", Emp.class);
    emp1.work();
    emp2.work();
}
```

```verilog
2025-05-26 11:11:32 418 [main] DEBUG org.springframework.context.support.ClassPathXmlApplicationContext - Refreshing org.springframework.context.support.ClassPathXmlApplicationContext@76f4b65
2025-05-26 11:11:32 510 [main] DEBUG org.springframework.beans.factory.xml.XmlBeanDefinitionReader - Loaded 3 bean definitions from class path resource [bean-array.xml]
2025-05-26 11:11:32 539 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'dept'
2025-05-26 11:11:32 571 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'emp1'
2025-05-26 11:11:32 579 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'emp2'
2025-05-26 11:11:32 587 [main] WARN org.springframework.core.LocalVariableTableParameterNameDiscoverer - Using deprecated '-debug' fallback for parameter name resolution. Compile the affected code with '-parameters' instead or avoid its introspection: com.joker.spring6.iocxml.idtest.Emp
jokeremp work....null
部门名称：研发部门
[台球, 打麻将, 睡觉]
zardemp work....11
部门名称：研发部门
[代码, 唱歌, 睡觉]
```

### 基于XML管理bean构造方法和Set方法依赖注入----为集合类型属性赋值

#### LIst -- 为List集合类型属性赋值

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="empone" class="com.joker.spring6.iocxml.idtest.Emp">
        <property name="ename" value="joker1" />
    </bean>
    <bean id="emptwo" class="com.joker.spring6.iocxml.idtest.Emp">
        <property name="ename" value="joker2" />
    </bean>
    <bean id="empthree" class="com.joker.spring6.iocxml.idtest.Emp">
        <property name="ename" value="joker3" />
    </bean>

    <bean id="dept1" class="com.joker.spring6.iocxml.idtest.Dept">
        <property name="dname" value="技术部门1" />
        <property name="empList">
            <list>
                <ref bean="empone"/>
                <ref bean="empthree"/>
                <ref bean="emptwo"/>
            </list>
        </property>
    </bean>

    <bean id="dept2" class="com.joker.spring6.iocxml.idtest.Dept">
        <constructor-arg name="dname" value="技术部门2" />
        <constructor-arg name="empList">
            <list>
                <ref bean="emptwo"/>
                <ref bean="empthree"/>
                <ref bean="emptwo"/>
            </list>
        </constructor-arg>
    </bean>
</beans>
```

```java
// 部门类
public class Dept {
    private String dname;
    private List<Emp> empList;
    public Dept() {
    }
    public Dept(String dname, List<Emp> empList) {
        this.dname = dname;
        this.empList = empList;
    }
    public String getDname() {
        return dname;
    }
    public void setDname(String dname) {
        this.dname = dname;
    }
    public List<Emp> getEmpList() {
        return empList;
    }
    public void setEmpList(List<Emp> empList) {
        this.empList = empList;
    }
    @Override
    public String toString() {
        return "Dept{" +
                "dname='" + dname + '\'' +
                ", empList=" + empList +
                '}';
    }
    public void info() {
        System.out.println("部门名称：" + dname);
        for (Emp emp : empList) {
            System.out.println(emp.getEname());
        }
    }
}
```

```java
@Test
public void testList() {
    ApplicationContext context = new ClassPathXmlApplicationContext("bean-list.xml");
    Dept dept1 = context.getBean("dept1", Dept.class);
    Dept dept2 = context.getBean("dept2", Dept.class);
    dept1.info();
    dept2.info();
}
```

```verilog
2025-05-26 11:37:04 532 [main] DEBUG org.springframework.context.support.ClassPathXmlApplicationContext - Refreshing org.springframework.context.support.ClassPathXmlApplicationContext@29526c05
2025-05-26 11:37:04 641 [main] DEBUG org.springframework.beans.factory.xml.XmlBeanDefinitionReader - Loaded 5 bean definitions from class path resource [bean-list.xml]
2025-05-26 11:37:04 659 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'empone'
2025-05-26 11:37:04 691 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'emptwo'
2025-05-26 11:37:04 691 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'empthree'
2025-05-26 11:37:04 691 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'dept1'
2025-05-26 11:37:04 697 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'dept2'
2025-05-26 11:37:04 705 [main] WARN org.springframework.core.LocalVariableTableParameterNameDiscoverer - Using deprecated '-debug' fallback for parameter name resolution. Compile the affected code with '-parameters' instead or avoid its introspection: com.joker.spring6.iocxml.idtest.Dept
部门名称：技术部门1
joker1
joker3
joker2
部门名称：技术部门2
joker2
joker3
joker2
```

## IoC：是Inversion of Control 控制反转

- Spring通过 **`IoC容器`**来管理
- **`1、所有Java对象的实例化和初始化，2、控制对象与对象之间的依赖关系`**
- IoC容器管理的Java对象称为 **`Spring Bean`**，它与使用关键字new创建的Java对象没有任何区别

## IoC的实例化和初始化工作过程

1. xml配置文件 (Bean定义信息  BeanDefinition)
2. 抽象（接口 BeanDefinitionReader）通过接口读取配置文件信息加载到IoC容器中
3. IoC容器 （BeanFactory工厂+反射）
   1. 获取到Bean定义信息
   2. 实例化（BeanFactory工厂+反射）
   3. 初始化
   4. 得到最终对象 
4. 获取对象： context.getBean("xxx");

### User实体类

```java
public class User {

    public User() {
        System.out.println("0、调用无参构造方法！");
    }

    public void add() {
        System.out.println("add().....");
    }
}

```

### xml配置文件 

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <!-- user对象创建
        bean标签
            id属性：唯一标识
            class属性：要创建对象所在类的全路径（包名+类名）
      -->
    <bean id="user" class="com.joker.spring6.User"></bean>

</beans>
```

### 反射

```java
/**
* 反射创建对象
*/
@Test
public void testUserObject1() throws Exception {
    // 获取class对象
    Class clazz = Class.forName("com.joker.spring6.User");
    // 调用方法创建对象
    //Object o = clazz.newInstance();
    User o = (User)clazz.getDeclaredConstructor().newInstance();
    System.out.println("o = " + o);
}
```

### 获取对象

```java
/**
* 如何使用返回创建的对象
* 1、加载bean.xml配置文件
* 2、对xml文件进行解析操作
* 3、获取xml文件bean标签属性值 - id属性值和class属性值
* 4、使用反射根据类全路径创建对象
* 5、创建对象放在Map<String, BeanDefinition> beanDefinitionMap
*      key: 唯一标识  value：类的定义（描述信息）
*/
@Test
public void testUserObject() {
    // 加载spring配置文件，对象创建
    ApplicationContext context = new ClassPathXmlApplicationContext("bean.xml");
    // 获取创建的对象
    User user = (User)context.getBean("user");
    System.out.println("1、" + user);
    // 使用对象调用方法进行测试
    System.out.print("2、");
    user.add();
}
```

```verilog
0、调用无参构造方法！
1、com.joker.spring6.User@5c48c0c0
2、add().....
```

## 获取Bean

- 方式一：根据id获取bean
- 方式二：根据类型获取bean
- 方式三：根据id和类型获取bean

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="user" class="com.joker.spring6.iocxml.User"></bean>

</beans>
```

```java
@Test
public void testGetBean() {
    ApplicationContext context = new ClassPathXmlApplicationContext("bean.xml");
    // 1、根据id获取bean
    User user1 = (User)context.getBean("user");
    System.out.println("1、根据id获取bean: " + user1);
    // 2、根据类型获取bean
    User user2 = context.getBean(User.class);
    System.out.println("2、根据类型获取bean" + user2);
    // 3、根据id和类型获取bean
    User user3 = context.getBean("user", User.class);
    System.out.println("3、根据id和类型获取bean" + user3);
}
```

```verilog
2025-05-22 10:36:44 802 [main] DEBUG org.springframework.context.support.ClassPathXmlApplicationContext - Refreshing org.springframework.context.support.ClassPathXmlApplicationContext@68fa0ba8
2025-05-22 10:36:44 880 [main] DEBUG org.springframework.beans.factory.xml.XmlBeanDefinitionReader - Loaded 1 bean definitions from class path resource [bean.xml]
2025-05-22 10:36:44 900 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'user'
1、根据id获取bean: com.joker.spring6.iocxml.User@681aad3b
2、根据类型获取beancom.joker.spring6.iocxml.User@681aad3b
3、根据id和类型获取beancom.joker.spring6.iocxml.User@681aad3b
```

### 根据类型获取bean，当IOC容器中一共配置了两个即配置文件xml中配置两个实体类（id不同，但类相同即类的路径相同）是会报错的

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="user" class="com.joker.spring6.iocxml.User"></bean>
    <bean id="user1" class="com.joker.spring6.iocxml.User"></bean>

</beans>
```

```java
@Test
public void testGetBean() {
    ApplicationContext context = new ClassPathXmlApplicationContext("bean.xml");
    // 2、根据类型获取bean
    User user2 = context.getBean(User.class);
    System.out.println("2、根据类型获取bean" + user2);
}
```

```verilog
2025-05-22 11:01:43 047 [main] DEBUG org.springframework.context.support.ClassPathXmlApplicationContext - Refreshing org.springframework.context.support.ClassPathXmlApplicationContext@5dcb4f5f
2025-05-22 11:01:43 156 [main] DEBUG org.springframework.beans.factory.xml.XmlBeanDefinitionReader - Loaded 2 bean definitions from class path resource [bean.xml]
2025-05-22 11:01:43 177 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'user'
2025-05-22 11:01:43 186 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'user1'

org.springframework.beans.factory.NoUniqueBeanDefinitionException: No qualifying bean of type 'com.joker.spring6.iocxml.User' available: expected single matching bean but found 2: user,user1
```

### 根据类型获取bean，当类型为接口时，实现类只配置在IoC容器（配置在xml中只有一个）时可以的，前提是bean唯一

```java
public interface UserDao {
    public void run();
}
```

```java
public class UserDaoImpl implements UserDao{
    public void run() {
        System.out.println("UserDaoImpl run......");
    }
}
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="userDaoImpl" class="com.joker.spring6.iocxml.bean.UserDaoImpl"></bean>

</beans>
```

```java
@Test
public void testUserDao() {
    ApplicationContext context = new ClassPathXmlApplicationContext("bean.xml");
    UserDao userDao = context.getBean(UserDao.class);
    userDao.run();
}
```

```verilog
2025-05-22 11:15:48 252 [main] DEBUG org.springframework.context.support.ClassPathXmlApplicationContext - Refreshing org.springframework.context.support.ClassPathXmlApplicationContext@68fa0ba8
2025-05-22 11:15:48 359 [main] DEBUG org.springframework.beans.factory.xml.XmlBeanDefinitionReader - Loaded 1 bean definitions from class path resource [bean.xml]
2025-05-22 11:15:48 384 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'userDaoImpl'
UserDaoImpl run......
```

### 根据类型获取bean，当类型为接口时，实现类有多个配置在IoC容器（配置在xml中多个）时不可以的

```java
public interface UserDao {
    public void run();
}
```

```java
public class UserDaoImpl implements UserDao{
    public void run() {
        System.out.println("UserDaoImpl run......");
    }
}
```

```java
public class PersonDaoImpl implements UserDao{
    public void run() {
        System.out.println("PersonDaoImpl run......");
    }
}
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="userDaoImpl" class="com.joker.spring6.iocxml.bean.UserDaoImpl"></bean>
    <bean id="personDaoImpl" class="com.joker.spring6.iocxml.bean.PersonDaoImpl"></bean>

</beans>
```

```java
@Test
public void testUserDao() {
    ApplicationContext context = new ClassPathXmlApplicationContext("bean.xml");
    UserDao userDao = context.getBean(UserDao.class);
    userDao.run();
}
```

```verilog
2025-05-22 11:20:54 637 [main] DEBUG org.springframework.context.support.ClassPathXmlApplicationContext - Refreshing org.springframework.context.support.ClassPathXmlApplicationContext@289710d9
2025-05-22 11:20:54 748 [main] DEBUG org.springframework.beans.factory.xml.XmlBeanDefinitionReader - Loaded 2 bean definitions from class path resource [bean.xml]
2025-05-22 11:20:54 777 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'userDaoImpl'
2025-05-22 11:20:54 785 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'personDaoImpl'

org.springframework.beans.factory.NoUniqueBeanDefinitionException: No qualifying bean of type 'com.joker.spring6.iocxml.bean.UserDao' available: expected single matching bean but found 2: userDaoImpl,personDaoImpl
```

### 结论

- 根据类型来获取bean时，在满足bean唯一性的前提下，其实只是看：『对象 **instanceof** 指定的类型』的返回结果，只要返回的是true就可以认定为和类型匹配，能够获取到。
- java中，instanceof运算符用于判断前面的对象是否是后面的类，或其子类、实现类的实例。如果是返回true，否则返回false。也就是说：用instanceof关键字做判断时， instanceof 操作符的左右操作必须有继承或实现关系

## 依赖注入

- **指Spring创建对象的过程中，将对象依赖属性通过配置进行注入**
- **类有属性，创建对象过程中，向属性设置值**

### 依赖注入常见的实现方式包括两种：

- 第一种：set注入
- 第二种：构造注入

**所以结论是：IOC 就是一种控制反转的思想， 而 DI 是对IoC的一种具体实现。**

**Bean管理说的是：Bean对象的创建，以及Bean对象中属性的赋值（或者叫做Bean对象之间关系的维护）。**

- 基于XML管理bean
- 基于注解管理bean

### 原生依赖注入（属性的赋值）Set注入和构造注入

```java
public class Book {
    private String bname;
    private String author;
    
    public Book(String bname, String author) {
        this.bname = bname;
        this.author = author;
    }
    public Book() {
    }
    public String getBname() {
        return bname;
    }
    public void setBname(String bname) {
        this.bname = bname;
    }
    public String getAuthor() {
        return author;
    }
    public void setAuthor(String author) {
        this.author = author;
    }
    @Override
    public String toString() {
        return "Book{" +
                "bname='" + bname + '\'' +
                ", author='" + author + '\'' +
                '}';
    }
    public static void main(String[] args) {
        Book book1 = new Book();
        // Set注入
        book1.setBname("java");
        book1.setAuthor("joker");
        System.out.println("book1 = " + book1);
        // 构造注入
        Book book2 = new Book("python", "小杰");
        System.out.println("book2 = " + book2);
    }
}
```

```log
book1 = Book{bname='java', author='joker'}
book2 = Book{bname='python', author='小杰'}
```

### 基于XML管理bean使用Set方法依赖注入方式

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <!-- 1、Set方法   -->
    <bean id="book1" class="com.joker.spring6.iocxml.di.Book">
        <property name="bname" value="java"></property>
        <property name="author" value="joker"></property>
    </bean>
</beans>
```

```java
package com.joker.spring6.iocxml.di;

public class Book {

    private String bname;
    private String author;

    public Book(String bname, String author) {
        this.bname = bname;
        this.author = author;
    }

    public Book() {
        System.out.println("Book的无参构造run...");
    }

    public String getBname() {
        return bname;
    }
    public void setBname(String bname) {
        this.bname = bname;
    }
    public String getAuthor() {
        return author;
    }
    public void setAuthor(String author) {
        this.author = author;
    }
    @Override
    public String toString() {
        return "Book{" +
                "bname='" + bname + '\'' +
                ", author='" + author + '\'' +
                '}';
    }
}

```

```java
@Test
public void testBook1() {
    ApplicationContext context = new ClassPathXmlApplicationContext("bean-di.xml");
    Book book1 = context.getBean("book1", Book.class);
    System.out.println("book1 = " + book1);
}
```

```log
2025-05-23 10:16:17 786 [main] DEBUG org.springframework.context.support.ClassPathXmlApplicationContext - Refreshing org.springframework.context.support.ClassPathXmlApplicationContext@5812f68b
2025-05-23 10:16:17 905 [main] DEBUG org.springframework.beans.factory.xml.XmlBeanDefinitionReader - Loaded 1 bean definitions from class path resource [bean-di.xml]
2025-05-23 10:16:17 928 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'book1'
Book的无参构造run...
book1 = Book{bname='java', author='joker'}
```

**注意：set方法使用了无参构造参数进行实例时被调用**

### 基于XML管理bean使用构造方法依赖注入方式

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <!-- 2、构造方法注入   -->
    <bean id="book2" class="com.joker.spring6.iocxml.di.Book">
        <constructor-arg name="bname" value="c++" />
        <constructor-arg name="author" value="小杰" />
    </bean>
</beans>
```

```java
package com.joker.spring6.iocxml.di;

public class Book {

    private String bname;
    private String author;

    public Book(String bname, String author) {
        System.out.println("Book的有参构造run...");
        this.bname = bname;
        this.author = author;
    }
    public Book() {
        System.out.println("Book的无参构造run...");
    }
    public String getBname() {
        return bname;
    }
    public void setBname(String bname) {
        this.bname = bname;
    }
    public String getAuthor() {
        return author;
    }
    public void setAuthor(String author) {
        this.author = author;
    }
    @Override
    public String toString() {
        return "Book{" +
                "bname='" + bname + '\'' +
                ", author='" + author + '\'' +
                '}';
    }
}

```

```java
@Test
public void testBook2() {
    ApplicationContext context = new ClassPathXmlApplicationContext("bean-di.xml");
    Book book2 = context.getBean("book2", Book.class);
    System.out.println("book2 = " + book2);
}
```

```java
2025-05-23 10:32:49 519 [main] DEBUG org.springframework.context.support.ClassPathXmlApplicationContext - Refreshing org.springframework.context.support.ClassPathXmlApplicationContext@503ecb24
2025-05-23 10:32:49 635 [main] DEBUG org.springframework.beans.factory.xml.XmlBeanDefinitionReader - Loaded 1 bean definitions from class path resource [bean-di.xml]
2025-05-23 10:32:49 657 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'book2'
2025-05-23 10:32:49 681 [main] WARN org.springframework.core.LocalVariableTableParameterNameDiscoverer - Using deprecated '-debug' fallback for parameter name resolution. Compile the affected code with '-parameters' instead or avoid its introspection: com.joker.spring6.iocxml.di.Book
Book的有参构造run...
book2 = Book{bname='c++', author='小杰'}
```

### 基于XML管理bean构造方法和Set方法依赖注入方式的属性为引用类型，属性值为null处理（String类型直接使用value="null"）

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <!-- 1、Set方法注入   -->
    <bean id="book1" class="com.joker.spring6.iocxml.di.Book">
        <property name="bname" value="java" />
        <property name="author" value="joker"/>
        <property name="othors">
            <null />
        </property>
    </bean>

    <!-- 2、构造方法注入   -->
    <bean id="book2" class="com.joker.spring6.iocxml.di.Book">
        <constructor-arg name="bname" value="c++" />
        <constructor-arg name="author" value="小杰" />
        <constructor-arg name="othors">
            <null />
        </constructor-arg>
    </bean>
</beans>
```

```java
public class Book {
    private String bname;
    private String author;
    private String othors;
    public Book(String bname, String author, String othors) {
        System.out.println("Book的有参构造run...");
        this.bname = bname;
        this.author = author;
        this.othors = othors;
    }
    public Book() {
        System.out.println("Book的无参构造run...");
    }
    public String getOthors() {
        return othors;
    }
    public void setOthors(String othors) {
        this.othors = othors;
    }
    public String getBname() {
        return bname;
    }
    public void setBname(String bname) {
        this.bname = bname;
    }
    public String getAuthor() {
        return author;
    }
    public void setAuthor(String author) {
        this.author = author;
    }
    @Override
    public String toString() {
        return "Book{" +
                "bname='" + bname + '\'' +
                ", author='" + author + '\'' +
                ", othors='" + othors + '\'' +
                '}';
    }
    public static void main(String[] args) {
        Book book1 = new Book();
        // Set注入
        book1.setBname("java");
        book1.setAuthor("joker");
        book1.setOthors(null);
        System.out.println("book1 = " + book1);
        // 构造注入
        Book book2 = new Book("python", "小杰", null);
        System.out.println("book2 = " + book2);
    }
}
```

```java
@Test
public void testBook1and2() {
    ApplicationContext context = new ClassPathXmlApplicationContext("bean-di.xml");
    Book book1 = context.getBean("book1", Book.class);
    System.out.println("book1 = " + book1);

    Book book2 = context.getBean("book2", Book.class);
    System.out.println("book2 = " + book2);
}
```

```verilog
2025-05-23 10:50:04 963 [main] DEBUG org.springframework.context.support.ClassPathXmlApplicationContext - Refreshing org.springframework.context.support.ClassPathXmlApplicationContext@45312be2
2025-05-23 10:50:05 062 [main] DEBUG org.springframework.beans.factory.xml.XmlBeanDefinitionReader - Loaded 2 bean definitions from class path resource [bean-di.xml]
2025-05-23 10:50:05 080 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'book1'
Book的无参构造run...
2025-05-23 10:50:05 113 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'book2'
2025-05-23 10:50:05 122 [main] WARN org.springframework.core.LocalVariableTableParameterNameDiscoverer - Using deprecated '-debug' fallback for parameter name resolution. Compile the affected code with '-parameters' instead or avoid its introspection: com.joker.spring6.iocxml.di.Book
Book的有参构造run...
book1 = Book{bname='java', author='joker', othors='null'}
book2 = Book{bname='c++', author='小杰', othors='null'}
```

### 基于XML管理bean构造方法和Set方法依赖注入方式的属性值包含xml实体（<>）

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <!-- 1、Set方法注入   -->
    <!-- 小于号在XML文档中用来定义标签的开始，不能随便使用 -->
    <!-- 解决方案一：使用XML实体来代替 -->
    <bean id="book1" class="com.joker.spring6.iocxml.di.Book">
        <property name="bname" value="java" />
        <property name="author" value="joker"/>
        <property name="othors" value="&lt;&gt;"/>
    </bean>

    <!-- 2、构造方法注入   -->
    <!-- 小于号在XML文档中用来定义标签的开始，不能随便使用 -->
    <!-- 解决方案一：使用XML实体来代替 -->
    <bean id="book2" class="com.joker.spring6.iocxml.di.Book">
        <constructor-arg name="bname" value="c++" />
        <constructor-arg name="author" value="小杰" />
        <constructor-arg name="othors" value="&lt;&gt;"/>
    </bean>
</beans>
```

```java
@Test
public void testBook1and2() {
    ApplicationContext context = new ClassPathXmlApplicationContext("bean-di.xml");
    Book book1 = context.getBean("book1", Book.class);
    System.out.println("book1 = " + book1);

    Book book2 = context.getBean("book2", Book.class);
    System.out.println("book2 = " + book2);
}
```

```verilog
2025-05-23 15:09:02 480 [main] DEBUG org.springframework.context.support.ClassPathXmlApplicationContext - Refreshing org.springframework.context.support.ClassPathXmlApplicationContext@3cdf2c61
2025-05-23 15:09:02 598 [main] DEBUG org.springframework.beans.factory.xml.XmlBeanDefinitionReader - Loaded 2 bean definitions from class path resource [bean-di.xml]
2025-05-23 15:09:02 628 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'book1'
Book的无参构造run...
2025-05-23 15:09:02 661 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'book2'
2025-05-23 15:09:02 671 [main] WARN org.springframework.core.LocalVariableTableParameterNameDiscoverer - Using deprecated '-debug' fallback for parameter name resolution. Compile the affected code with '-parameters' instead or avoid its introspection: com.joker.spring6.iocxml.di.Book
Book的有参构造run...
book1 = Book{bname='java', author='joker', othors='<>'}
book2 = Book{bname='c++', author='小杰', othors='<>'}

```

### 基于XML管理bean构造方法和Set方法依赖注入方式的属性值包含特殊字符使用CDATA节

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <!-- 1、Set方法注入   -->
    <!-- 解决方案二：使用CDATA节 -->
    <!-- CDATA中的C代表Character，是文本、字符的含义，CDATA就表示纯文本数据 -->
    <!-- XML解析器看到CDATA节就知道这里是纯文本，就不会当作XML标签或属性来解析 -->
    <!-- 所以CDATA节中写什么符号都随意 -->
    <bean id="book1" class="com.joker.spring6.iocxml.di.Book">
        <property name="bname" value="java" />
        <property name="author" value="joker"/>
        <property name="othors">
            <value><![CDATA[/\a < b/\"]]></value>
        </property>
    </bean>

    <!-- 2、构造方法注入   -->
    <!-- 解决方案二：使用CDATA节 -->
    <!-- CDATA中的C代表Character，是文本、字符的含义，CDATA就表示纯文本数据 -->
    <!-- XML解析器看到CDATA节就知道这里是纯文本，就不会当作XML标签或属性来解析 -->
    <!-- 所以CDATA节中写什么符号都随意 -->
    <bean id="book2" class="com.joker.spring6.iocxml.di.Book">
        <constructor-arg name="bname" value="c++" />
        <constructor-arg name="author" value="小杰" />
        <constructor-arg name="othors">
            <value><![CDATA[/\a < b/\"]]></value>
        </constructor-arg>
    </bean>
</beans>
```

```verilog
2025-05-23 15:19:05 168 [main] DEBUG org.springframework.context.support.ClassPathXmlApplicationContext - Refreshing org.springframework.context.support.ClassPathXmlApplicationContext@673be18f
2025-05-23 15:19:05 318 [main] DEBUG org.springframework.beans.factory.xml.XmlBeanDefinitionReader - Loaded 2 bean definitions from class path resource [bean-di.xml]
2025-05-23 15:19:05 349 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'book1'
Book的无参构造run...
2025-05-23 15:19:05 387 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'book2'
2025-05-23 15:19:05 399 [main] WARN org.springframework.core.LocalVariableTableParameterNameDiscoverer - Using deprecated '-debug' fallback for parameter name resolution. Compile the affected code with '-parameters' instead or avoid its introspection: com.joker.spring6.iocxml.di.Book
Book的有参构造run...
book1 = Book{bname='java', author='joker', othors='/\a < b/\"'}
book2 = Book{bname='c++', author='小杰', othors='/\a < b/\"'}
```

### 基于XML管理bean构造方法和Set方法依赖注入----为对象类型属性赋值

#### 方式一：引用外部bean -- ref

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="dept1" class="com.joker.spring6.iocxml.idtest.Dept">
        <property name="dname" value="技术部门" />
    </bean>

    <bean id="emp1" class="com.joker.spring6.iocxml.idtest.Emp">
        <property name="ename" value="joker"/>
        <property name="age" value="18"/>
        <property name="dept" ref="dept1"/>
    </bean>

    <bean id="emp2" class="com.joker.spring6.iocxml.idtest.Emp">
        <constructor-arg name="ename" value="zard"/>
        <constructor-arg name="age" value="20"/>
        <constructor-arg name="dept" ref="dept1"/>
    </bean>
</beans>
```

```java
// 部门类
public class Dept {
    private String dname;
    public Dept() {
    }
    public Dept(String dname) {
        this.dname = dname;
    }
    public String getDname() {
        return dname;
    }
    @Override
    public String toString() {
        return "Dept{" +
                "dname='" + dname + '\'' +
                '}';
    }
    public void setDname(String dname) {
        this.dname = dname;
    }
    public void info() {
        System.out.println("部门名称：" + dname);
    }
}
```

```java
public class Emp {
    // 用工属于某个部门
    private Dept dept;
    private String ename;
    private Integer age;
    public void work() {
        System.out.println(ename + "emp work...." + age);
        dept.info();
    }
    public Emp() {
    }
    public Emp(Dept dept, String ename, Integer age) {
        this.dept = dept;
        this.ename = ename;
        this.age = age;
    }
    public Dept getDept() {
        return dept;
    }
    public void setDept(Dept dept) {
        this.dept = dept;
    }
    public String getEname() {
        return ename;
    }
    public void setEname(String ename) {
        this.ename = ename;
    }
    public Integer getAge() {
        return age;
    }
    public void setAge(Integer age) {
        this.age = age;
    }
    @Override
    public String toString() {
        return "Emp{" +
                "dept=" + dept +
                ", ename='" + ename + '\'' +
                ", age=" + age +
                '}';
    }
}
```

```java
@Test
public void testRefObject1() {
    ApplicationContext context = new ClassPathXmlApplicationContext("bean-ditest.xml");
    Emp emp1 = context.getBean("emp1", Emp.class);
    Emp emp2 = context.getBean("emp2", Emp.class);
    emp1.work();
    emp2.work();
}
```

```verilog
2025-05-26 09:57:54 193 [main] DEBUG org.springframework.context.support.ClassPathXmlApplicationContext - Refreshing org.springframework.context.support.ClassPathXmlApplicationContext@32c726ee
2025-05-26 09:57:54 302 [main] DEBUG org.springframework.beans.factory.xml.XmlBeanDefinitionReader - Loaded 3 bean definitions from class path resource [bean-ditest.xml]
2025-05-26 09:57:54 320 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'dept1'
2025-05-26 09:57:54 354 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'emp1'
2025-05-26 09:57:54 358 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'emp2'
2025-05-26 09:57:54 366 [main] WARN org.springframework.core.LocalVariableTableParameterNameDiscoverer - Using deprecated '-debug' fallback for parameter name resolution. Compile the affected code with '-parameters' instead or avoid its introspection: com.joker.spring6.iocxml.idtest.Emp
jokeremp work....18
部门名称：技术部门
zardemp work....20
部门名称：技术部门
```

- 如果错把ref属性写成了value属性，会抛出异常： Caused by: java.lang.IllegalStateException: Cannot convert value of type 'java.lang.String' to required type 'com.atguigu.spring6.bean.Clazz' for property 'clazz': no matching editors or conversion strategy found 
- 意思是不能把String类型转换成我们要的Clazz类型，说明我们使用value属性时，Spring只把这个属性看做一个普通的字符串，不会认为这是一个bean的id，更不会根据它去找到bean来赋值

#### 方式二：引用内部bean 

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">
    <!-- 内部引用 -->
    <bean id="emp3" class="com.joker.spring6.iocxml.idtest.Emp">
        <property name="ename" value="嘻嘻" />
        <property name="age" value="18" />
        <property name="dept">
            <bean class="com.joker.spring6.iocxml.idtest.Dept">
                <property name="dname" value="销售部"/>
            </bean>
        </property>
    </bean>

    <bean id="emp4" class="com.joker.spring6.iocxml.idtest.Emp">
        <constructor-arg name="ename" value="哈哈" />
        <constructor-arg name="age" value="20" />
        <constructor-arg name="dept">
            <bean class="com.joker.spring6.iocxml.idtest.Dept">
                <property name="dname" value="销售部"/>
            </bean>
        </constructor-arg>
    </bean>

    <bean id="emp5" class="com.joker.spring6.iocxml.idtest.Emp">
        <property name="ename" value="嗯嗯" />
        <property name="age" value="28" />
        <property name="dept">
            <bean class="com.joker.spring6.iocxml.idtest.Dept">
                <constructor-arg name="dname" value="销售部"/>
            </bean>
        </property>
    </bean>
</beans>
```

```java
@Test
public void testRefObject2() {
    ApplicationContext context = new ClassPathXmlApplicationContext("bean-ditest.xml");
    Emp emp3 = context.getBean("emp3", Emp.class);
    Emp emp4 = context.getBean("emp4", Emp.class);
    Emp emp5 = context.getBean("emp5", Emp.class);
    emp3.work();
    emp4.work();
    emp5.work();
}
```

```verilog
2025-05-26 10:29:48 302 [main] DEBUG org.springframework.context.support.ClassPathXmlApplicationContext - Refreshing org.springframework.context.support.ClassPathXmlApplicationContext@32c726ee
2025-05-26 10:29:48 425 [main] DEBUG org.springframework.beans.factory.xml.XmlBeanDefinitionReader - Loaded 3 bean definitions from class path resource [bean-ditest.xml]
2025-05-26 10:29:48 444 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'emp3'
2025-05-26 10:29:48 484 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'emp4'
2025-05-26 10:29:48 494 [main] WARN org.springframework.core.LocalVariableTableParameterNameDiscoverer - Using deprecated '-debug' fallback for parameter name resolution. Compile the affected code with '-parameters' instead or avoid its introspection: com.joker.spring6.iocxml.idtest.Emp
2025-05-26 10:29:48 496 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'emp5'
2025-05-26 10:29:48 497 [main] WARN org.springframework.core.LocalVariableTableParameterNameDiscoverer - Using deprecated '-debug' fallback for parameter name resolution. Compile the affected code with '-parameters' instead or avoid its introspection: com.joker.spring6.iocxml.idtest.Dept
嘻嘻emp work....18
部门名称：销售部
哈哈emp work....20
部门名称：销售部
嗯嗯emp work....28
部门名称：销售部
```

#### 方式三：级联属性赋值

##### 外部引用

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="dept1" class="com.joker.spring6.iocxml.idtest.Dept">
        <property name="dname" value="技术部门" />
    </bean>

    <!-- 外部引用  -->
    <bean id="emp1" class="com.joker.spring6.iocxml.idtest.Emp">
        <property name="ename" value="joker"/>
        <property name="age" value="18"/>
        <property name="dept" ref="dept1"/>
        <property name="dept.dname" value="研发部门"/>
    </bean>

    <bean id="emp2" class="com.joker.spring6.iocxml.idtest.Emp">
        <constructor-arg name="ename" value="zard"/>
        <constructor-arg name="age" value="20"/>
        <constructor-arg name="dept" ref="dept1"/>
        <property name="dept.dname" value="科研部门"/>
    </bean>
</beans>
```

```java
@Test
public void testRefObject1() {
    ApplicationContext context = new ClassPathXmlApplicationContext("bean-ditest.xml");
    Emp emp1 = context.getBean("emp1", Emp.class);
    Emp emp2 = context.getBean("emp2", Emp.class);
    emp1.work();
    emp2.work();
}
```

```verilog
2025-05-26 10:41:34 589 [main] DEBUG org.springframework.context.support.ClassPathXmlApplicationContext - Refreshing org.springframework.context.support.ClassPathXmlApplicationContext@7a1a14a4
2025-05-26 10:41:34 688 [main] DEBUG org.springframework.beans.factory.xml.XmlBeanDefinitionReader - Loaded 3 bean definitions from class path resource [bean-ditest.xml]
2025-05-26 10:41:34 723 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'dept1'
2025-05-26 10:41:34 754 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'emp1'
2025-05-26 10:41:34 760 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'emp2'
2025-05-26 10:41:34 770 [main] WARN org.springframework.core.LocalVariableTableParameterNameDiscoverer - Using deprecated '-debug' fallback for parameter name resolution. Compile the affected code with '-parameters' instead or avoid its introspection: com.joker.spring6.iocxml.idtest.Emp
jokeremp work....18
部门名称：科研部门
zardemp work....20
部门名称：科研部门
```

##### 内部引用

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">
    <!-- 内部引用 -->
    <bean id="emp3" class="com.joker.spring6.iocxml.idtest.Emp">
        <property name="ename" value="嘻嘻" />
        <property name="age" value="18" />
        <property name="dept">
            <bean class="com.joker.spring6.iocxml.idtest.Dept">
                <property name="dname" value="销售部"/>
            </bean>
        </property>
        <property name="dept.dname" value="销售3部门"/>
    </bean>

    <bean id="emp4" class="com.joker.spring6.iocxml.idtest.Emp">
        <constructor-arg name="ename" value="哈哈" />
        <constructor-arg name="age" value="20" />
        <constructor-arg name="dept">
            <bean class="com.joker.spring6.iocxml.idtest.Dept">
                <property name="dname" value="销售部"/>
            </bean>
        </constructor-arg>
        <property name="dept.dname" value="销售4部门"/>
    </bean>

    <bean id="emp5" class="com.joker.spring6.iocxml.idtest.Emp">
        <property name="ename" value="嗯嗯" />
        <property name="age" value="28" />
        <property name="dept">
            <bean class="com.joker.spring6.iocxml.idtest.Dept">
                <constructor-arg name="dname" value="销售部"/>
            </bean>
        </property>
        <property name="dept.dname" value="销售5部门"/>
    </bean>
</beans>
```

```java
@Test
public void testRefObject2() {
    ApplicationContext context = new ClassPathXmlApplicationContext("bean-ditest.xml");
    Emp emp3 = context.getBean("emp3", Emp.class);
    Emp emp4 = context.getBean("emp4", Emp.class);
    Emp emp5 = context.getBean("emp5", Emp.class);
    emp3.work();
    emp4.work();
    emp5.work();
}
```

```verilog
2025-05-26 10:46:30 857 [main] DEBUG org.springframework.context.support.ClassPathXmlApplicationContext - Refreshing org.springframework.context.support.ClassPathXmlApplicationContext@35432107
2025-05-26 10:46:30 967 [main] DEBUG org.springframework.beans.factory.xml.XmlBeanDefinitionReader - Loaded 3 bean definitions from class path resource [bean-ditest.xml]
2025-05-26 10:46:30 995 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'emp3'
2025-05-26 10:46:31 041 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'emp4'
2025-05-26 10:46:31 050 [main] WARN org.springframework.core.LocalVariableTableParameterNameDiscoverer - Using deprecated '-debug' fallback for parameter name resolution. Compile the affected code with '-parameters' instead or avoid its introspection: com.joker.spring6.iocxml.idtest.Emp
2025-05-26 10:46:31 052 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'emp5'
2025-05-26 10:46:31 053 [main] WARN org.springframework.core.LocalVariableTableParameterNameDiscoverer - Using deprecated '-debug' fallback for parameter name resolution. Compile the affected code with '-parameters' instead or avoid its introspection: com.joker.spring6.iocxml.idtest.Dept
嘻嘻emp work....18
部门名称：销售3部门
哈哈emp work....20
部门名称：销售4部门
嗯嗯emp work....28
部门名称：销售5部门
```

### 基于XML管理bean构造方法和Set方法依赖注入----为数组类型属性赋值

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="dept" class="com.joker.spring6.iocxml.idtest.Dept">
        <property name="dname" value="研发部门" />
    </bean>

    <bean id="emp1" class="com.joker.spring6.iocxml.idtest.Emp">
        <property name="ename" value="joker"/>
        <property name="dept" ref="dept"/>
        <property name="loves">
            <array>
                <value>台球</value>
                <value>打麻将</value>
                <value>睡觉</value>
            </array>
        </property>
    </bean>

    <bean id="emp2" class="com.joker.spring6.iocxml.idtest.Emp">
        <constructor-arg name="ename" value="zard"/>
        <constructor-arg name="dept" ref="dept"/>
        <constructor-arg name="age" value="11"/>
        <constructor-arg name="loves">
            <array>
                <value>台球</value>
                <value>打麻将</value>
                <value>睡觉</value>
            </array>
        </constructor-arg>
    </bean>
</beans>
```

```java
package com.joker.spring6.iocxml.idtest;

import java.util.Arrays;

public class Emp {

    // 用工属于某个部门
    private Dept dept;
    private String ename;
    private Integer age;
    private String[] loves;
    public void work() {
        System.out.println(ename + "emp work...." + age);
        dept.info();
        System.out.println(Arrays.toString(loves));;
    }
    public Emp() {
    }
    public Emp(Dept dept, String ename, Integer age, String[] loves) {
        this.dept = dept;
        this.ename = ename;
        this.age = age;
        this.loves = loves;
    }
    public Dept getDept() {
        return dept;
    }
    public void setDept(Dept dept) {
        this.dept = dept;
    }
    public String getEname() {
        return ename;
    }
    public void setEname(String ename) {
        this.ename = ename;
    }
    public Integer getAge() {
        return age;
    }
    public void setAge(Integer age) {
        this.age = age;
    }
    public String[] getLoves() {
        return loves;
    }
    public void setLoves(String[] loves) {
        this.loves = loves;
    }
    @Override
    public String toString() {
        return "Emp{" +
                "dept=" + dept +
                ", ename='" + ename + '\'' +
                ", age=" + age +
                ", loves=" + Arrays.toString(loves) +
                '}';
    }
}

```

```java
@Test
public void testArray() {
    ApplicationContext context = new ClassPathXmlApplicationContext("bean-array.xml");
    Emp emp1 = context.getBean("emp1", Emp.class);
    Emp emp2 = context.getBean("emp2", Emp.class);
    emp1.work();
    emp2.work();
}
```

```verilog
2025-05-26 11:11:32 418 [main] DEBUG org.springframework.context.support.ClassPathXmlApplicationContext - Refreshing org.springframework.context.support.ClassPathXmlApplicationContext@76f4b65
2025-05-26 11:11:32 510 [main] DEBUG org.springframework.beans.factory.xml.XmlBeanDefinitionReader - Loaded 3 bean definitions from class path resource [bean-array.xml]
2025-05-26 11:11:32 539 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'dept'
2025-05-26 11:11:32 571 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'emp1'
2025-05-26 11:11:32 579 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'emp2'
2025-05-26 11:11:32 587 [main] WARN org.springframework.core.LocalVariableTableParameterNameDiscoverer - Using deprecated '-debug' fallback for parameter name resolution. Compile the affected code with '-parameters' instead or avoid its introspection: com.joker.spring6.iocxml.idtest.Emp
jokeremp work....null
部门名称：研发部门
[台球, 打麻将, 睡觉]
zardemp work....11
部门名称：研发部门
[代码, 唱歌, 睡觉]
```

### 基于XML管理bean构造方法和Set方法依赖注入----为集合类型属性赋值

#### LIst -- 为List集合类型属性赋值

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="empone" class="com.joker.spring6.iocxml.idtest.Emp">
        <property name="ename" value="joker1" />
    </bean>
    <bean id="emptwo" class="com.joker.spring6.iocxml.idtest.Emp">
        <property name="ename" value="joker2" />
    </bean>
    <bean id="empthree" class="com.joker.spring6.iocxml.idtest.Emp">
        <property name="ename" value="joker3" />
    </bean>

    <bean id="dept1" class="com.joker.spring6.iocxml.idtest.Dept">
        <property name="dname" value="技术部门1" />
        <property name="empList">
            <list>
                <ref bean="empone"/>
                <ref bean="empthree"/>
                <ref bean="emptwo"/>
            </list>
        </property>
    </bean>

    <bean id="dept2" class="com.joker.spring6.iocxml.idtest.Dept">
        <constructor-arg name="dname" value="技术部门2" />
        <constructor-arg name="empList">
            <list>
                <ref bean="emptwo"/>
                <ref bean="empthree"/>
                <ref bean="emptwo"/>
            </list>
        </constructor-arg>
    </bean>
</beans>
```

```java
// 部门类
public class Dept {
    private String dname;
    private List<Emp> empList;
    public Dept() {
    }
    public Dept(String dname, List<Emp> empList) {
        this.dname = dname;
        this.empList = empList;
    }
    public String getDname() {
        return dname;
    }
    public void setDname(String dname) {
        this.dname = dname;
    }
    public List<Emp> getEmpList() {
        return empList;
    }
    public void setEmpList(List<Emp> empList) {
        this.empList = empList;
    }
    @Override
    public String toString() {
        return "Dept{" +
                "dname='" + dname + '\'' +
                ", empList=" + empList +
                '}';
    }
    public void info() {
        System.out.println("部门名称：" + dname);
        for (Emp emp : empList) {
            System.out.println(emp.getEname());
        }
    }
}
```

```java
@Test
public void testList() {
    ApplicationContext context = new ClassPathXmlApplicationContext("bean-list.xml");
    Dept dept1 = context.getBean("dept1", Dept.class);
    Dept dept2 = context.getBean("dept2", Dept.class);
    dept1.info();
    dept2.info();
}
```

```verilog
2025-05-26 11:37:04 532 [main] DEBUG org.springframework.context.support.ClassPathXmlApplicationContext - Refreshing org.springframework.context.support.ClassPathXmlApplicationContext@29526c05
2025-05-26 11:37:04 641 [main] DEBUG org.springframework.beans.factory.xml.XmlBeanDefinitionReader - Loaded 5 bean definitions from class path resource [bean-list.xml]
2025-05-26 11:37:04 659 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'empone'
2025-05-26 11:37:04 691 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'emptwo'
2025-05-26 11:37:04 691 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'empthree'
2025-05-26 11:37:04 691 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'dept1'
2025-05-26 11:37:04 697 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'dept2'
2025-05-26 11:37:04 705 [main] WARN org.springframework.core.LocalVariableTableParameterNameDiscoverer - Using deprecated '-debug' fallback for parameter name resolution. Compile the affected code with '-parameters' instead or avoid its introspection: com.joker.spring6.iocxml.idtest.Dept
部门名称：技术部门1
joker1
joker3
joker2
部门名称：技术部门2
joker2
joker3
joker2
```

- **若为Set集合类型属性赋值，只需要将其中的list标签改为set标签即可**

#### Map -- 为Map集合类型属性赋值

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean name="teacherOne" class="com.joker.spring6.iocxml.dimap.Teacher">
        <property name="teacherId" value="0001"/>
        <property name="teacherName" value="JOKER老师"/>
    </bean>

    <bean name="teacherTwo" class="com.joker.spring6.iocxml.dimap.Teacher">
        <property name="teacherId" value="0002"/>
        <property name="teacherName" value="ZARD老师"/>
    </bean>

    <bean name="studentOne" class="com.joker.spring6.iocxml.dimap.Student">
        <property name="sid" value="1001"/>
        <property name="sname" value="xiix"/>
        <property name="teacherMap">
            <map>
                <!-- 简化版   -->
                <entry key="t0001" value-ref="teacherOne"/>
                <entry>
                    <key>
                        <value>t0002</value>
                    </key>
                    <ref bean="teacherTwo" />
                </entry>
                <entry key="t0003">
                    <bean class="com.joker.spring6.iocxml.dimap.Teacher">
                        <property name="teacherId" value="0003"/>
                        <property name="teacherName" value="HAHA老师"/>
                    </bean>
                </entry>
            </map>
        </property>
    </bean>
</beans>
```

```java
package com.joker.spring6.iocxml.dimap;
import java.util.List;
import java.util.Map;
public class Student {
    private Map<String, Teacher> teacherMap;
    private String sid;
    private String sname;
    private List<Leason> leasonList;
    public List<Leason> getLeasonList() {
        return leasonList;
    }
    public void setLeasonList(List<Leason> leasonList) {
        this.leasonList = leasonList;
    }
    public Map<String, Teacher> getTeacherMap() {
        return teacherMap;
    }
    public void setTeacherMap(Map<String, Teacher> teacherMap) {
        this.teacherMap = teacherMap;
    }
    public void run() {
        System.out.println("学生编号：" + sid + "学生姓名：" + sname);
        System.out.println(teacherMap);
        System.out.println(leasonList);
    }
    public String getSid() {
        return sid;
    }
    public void setSid(String sid) {
        this.sid = sid;
    }
    public String getSname() {
        return sname;
    }
    public void setSname(String sname) {
        this.sname = sname;
    }
}
```

```java
package com.joker.spring6.iocxml.dimap;
public class Teacher {
    private String teacherId;
    private String teacherName;
    public String getTeacherId() {
        return teacherId;
    }
    public void setTeacherId(String teacherId) {
        this.teacherId = teacherId;
    }
    public String getTeacherName() {
        return teacherName;
    }
    public void setTeacherName(String teacherName) {
        this.teacherName = teacherName;
    }
    @Override
    public String toString() {
        return "Teacher{" +
                "teacherId='" + teacherId + '\'' +
                ", teacherName='" + teacherName + '\'' +
                '}';
    }
}
```

```java
@Test
public void testMap() {
    ApplicationContext context = new ClassPathXmlApplicationContext("bean-map.xml");
    Student student = (Student) context.getBean("studentOne");
    student.run();
}
```

```verilog
2025-05-29 11:44:16 531 [main] DEBUG org.springframework.context.support.ClassPathXmlApplicationContext - Refreshing org.springframework.context.support.ClassPathXmlApplicationContext@b2c5e07
2025-05-29 11:44:16 641 [main] DEBUG org.springframework.beans.factory.xml.XmlBeanDefinitionReader - Loaded 3 bean definitions from class path resource [bean-map.xml]
2025-05-29 11:44:16 675 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'teacherOne'
2025-05-29 11:44:16 708 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'teacherTwo'
2025-05-29 11:44:16 708 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'studentOne'
学生编号：1001学生姓名：xiix
{t0001=Teacher{teacherId='0001', teacherName='JOKER老师'}, t0002=Teacher{teacherId='0002', teacherName='ZARD老师'}, t0003=Teacher{teacherId='0003', teacherName='HAHA老师'}}
```

#### 引用集合类型的bean

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:util="http://www.springframework.org/schema/util"
       xsi:schemaLocation="
       http://www.springframework.org/schema/util
       http://www.springframework.org/schema/util/spring-util.xsd
       http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd">

    <!--
       1 创建三个对象
       2 注入普通类型属性
       3 使用util:类定义
       4 在学生bean引入util:类型定义beam 完成list map类型属性注入
       -->
    <util:list id="leasonList">
        <ref bean="leasonOne"/>
        <ref bean="leasonTwo"/>
    </util:list>

    <util:map id="teacherMap">
        <entry key="00001" value-ref="teacherOne"/>
        <entry key="00002" value-ref="teacherTwo"/>
    </util:map>

    <bean name="leasonOne" class="com.joker.spring6.iocxml.dimap.Leason">
        <property name="leasonName" value="Java开发"/>
    </bean>
    <bean name="leasonTwo" class="com.joker.spring6.iocxml.dimap.Leason">
        <property name="leasonName" value="Python开发"/>
    </bean>

    <bean name="teacherOne" class="com.joker.spring6.iocxml.dimap.Teacher">
        <property name="teacherId" value="00001"/>
        <property name="teacherName" value="Joker老师"/>
    </bean>
    <bean name="teacherTwo" class="com.joker.spring6.iocxml.dimap.Teacher">
        <property name="teacherId" value="00002"/>
        <property name="teacherName" value="Zard老师"/>
    </bean>

    <bean name="student" class="com.joker.spring6.iocxml.dimap.Student">
        <property name="sid" value="s00001"/>
        <property name="sname" value="Joker学生"/>
        <property name="leasonList" ref="leasonList"/>
        <property name="teacherMap" ref="teacherMap"/>
    </bean>
</beans>
```

```java
package com.joker.spring6.iocxml.dimap;
import java.util.List;
import java.util.Map;
public class Student {
    private Map<String, Teacher> teacherMap;
    private String sid;
    private String sname;
    private List<Leason> leasonList;
    public List<Leason> getLeasonList() {
        return leasonList;
    }
    public void setLeasonList(List<Leason> leasonList) {
        this.leasonList = leasonList;
    }
    public Map<String, Teacher> getTeacherMap() {
        return teacherMap;
    }
    public void setTeacherMap(Map<String, Teacher> teacherMap) {
        this.teacherMap = teacherMap;
    }
    public void run() {
        System.out.println("学生编号：" + sid + "学生姓名：" + sname);
        System.out.println(teacherMap);
        System.out.println(leasonList);
    }
    public String getSid() {
        return sid;
    }
    public void setSid(String sid) {
        this.sid = sid;
    }
    public String getSname() {
        return sname;
    }
    public void setSname(String sname) {
        this.sname = sname;
    }
}
```

```java
package com.joker.spring6.iocxml.dimap;
public class Teacher {
    private String teacherId;
    private String teacherName;
    public String getTeacherId() {
        return teacherId;
    }
    public void setTeacherId(String teacherId) {
        this.teacherId = teacherId;
    }
    public String getTeacherName() {
        return teacherName;
    }
    public void setTeacherName(String teacherName) {
        this.teacherName = teacherName;
    }
    @Override
    public String toString() {
        return "Teacher{" +
                "teacherId='" + teacherId + '\'' +
                ", teacherName='" + teacherName + '\'' +
                '}';
    }
}
```

```java
package com.joker.spring6.iocxml.dimap;
public class Leason {
    private String leasonName;
    public String getLeasonName() {
        return leasonName;
    }
    public void setLeasonName(String leasonName) {
        this.leasonName = leasonName;
    }
    @Override
    public String toString() {
        return "Leason{" +
                "leasonName='" + leasonName + '\'' +
                '}';
    }
}
```

```java
@Test
public void testDiRef() {
    ApplicationContext context = new ClassPathXmlApplicationContext("bean-diref.xml");
    Student student = (Student) context.getBean("student");
    student.run();
}
```

```verilog
2025-05-29 14:49:27 987 [main] DEBUG org.springframework.context.support.ClassPathXmlApplicationContext - Refreshing org.springframework.context.support.ClassPathXmlApplicationContext@4fad9bb2
2025-05-29 14:49:28 094 [main] DEBUG org.springframework.beans.factory.xml.XmlBeanDefinitionReader - Loaded 7 bean definitions from class path resource [bean-diref.xml]
2025-05-29 14:49:28 121 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'leasonList'
2025-05-29 14:49:28 138 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'leasonOne'
2025-05-29 14:49:28 154 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'leasonTwo'
2025-05-29 14:49:28 159 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'teacherMap'
2025-05-29 14:49:28 160 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'teacherOne'
2025-05-29 14:49:28 161 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'teacherTwo'
2025-05-29 14:49:28 162 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'student'
学生编号：s00001学生姓名：Joker学生
{00001=Teacher{teacherId='00001', teacherName='Joker老师'}, 00002=Teacher{teacherId='00002', teacherName='Zard老师'}}
[Leason{leasonName='Java开发'}, Leason{leasonName='Python开发'}]
```

### 引入p命名空间后，可以通过以下方式为bean的各个属性赋值

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:util="http://www.springframework.org/schema/util"
       xmlns:p="http://www.springframework.org/schema/p"
       xsi:schemaLocation="
       http://www.springframework.org/schema/util
       http://www.springframework.org/schema/util/spring-util.xsd
       http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd">

    <!--引入p命名空间后，可以通过以下方式为bean的各个属性赋值-->
    <bean name="studentp" class="com.joker.spring6.iocxml.dimap.Student"
    p:sid="00001" p:sname="xixi学生" p:leasonList-ref="leasonList" p:teacherMap-ref="teacherMap">
    </bean>
    <!--原始方式-->
    <bean name="student" class="com.joker.spring6.iocxml.dimap.Student">
        <property name="sid" value="s00001"/>
        <property name="sname" value="Joker学生"/>
        <property name="leasonList" ref="leasonList"/>
        <property name="teacherMap" ref="teacherMap"/>
    </bean>

    <!--
       1 创建三个对象
       2 注入普通类型属性
       3 使用util:类定义
       4 在学生bean引入util:类型定义beam 完成list map类型属性注入
       -->
    <util:list id="leasonList">
        <ref bean="leasonOne"/>
        <ref bean="leasonTwo"/>
    </util:list>

    <util:map id="teacherMap">
        <entry key="00001" value-ref="teacherOne"/>
        <entry key="00002" value-ref="teacherTwo"/>
    </util:map>

    <bean name="leasonOne" class="com.joker.spring6.iocxml.dimap.Leason">
        <property name="leasonName" value="Java开发"/>
    </bean>
    <bean name="leasonTwo" class="com.joker.spring6.iocxml.dimap.Leason">
        <property name="leasonName" value="Python开发"/>
    </bean>

    <bean name="teacherOne" class="com.joker.spring6.iocxml.dimap.Teacher">
        <property name="teacherId" value="00001"/>
        <property name="teacherName" value="Joker老师"/>
    </bean>
    <bean name="teacherTwo" class="com.joker.spring6.iocxml.dimap.Teacher">
        <property name="teacherId" value="00002"/>
        <property name="teacherName" value="Zard老师"/>
    </bean>
</beans>
```

```java
@Test
public void testDiRefP() {
    ApplicationContext context = new ClassPathXmlApplicationContext("bean-diref.xml");
    Student student = (Student) context.getBean("studentp");
    student.run();
}
```

```verilog
2025-05-29 16:00:08 186 [main] DEBUG org.springframework.context.support.ClassPathXmlApplicationContext - Refreshing org.springframework.context.support.ClassPathXmlApplicationContext@7862f56
2025-05-29 16:00:08 292 [main] DEBUG org.springframework.beans.factory.xml.XmlBeanDefinitionReader - Loaded 8 bean definitions from class path resource [bean-diref.xml]
2025-05-29 16:00:08 314 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'studentp'
2025-05-29 16:00:08 329 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'leasonList'
2025-05-29 16:00:08 330 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'leasonOne'
2025-05-29 16:00:08 349 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'leasonTwo'
2025-05-29 16:00:08 356 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'teacherMap'
2025-05-29 16:00:08 357 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'teacherOne'
2025-05-29 16:00:08 358 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'teacherTwo'
2025-05-29 16:00:08 361 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'student'
学生编号：00001学生姓名：xixi学生
{00001=Teacher{teacherId='00001', teacherName='Joker老师'}, 00002=Teacher{teacherId='00002', teacherName='Zard老师'}}
[Leason{leasonName='Java开发'}, Leason{leasonName='Python开发'}]
```

### 引入外部属性文件

1. 创建外部属性文件 --- datasource.properties

   ```properties
   jdbc.user=root
   jdbc.password=12345
   jdbc.url=jdbc:mysql://localhost:3306/spring?serverTimezone=UTC
   jdbc.driver=com.mysql.cj.jdbc.Driver
   ```

2. ①在bean-data-source.xml引入context 名称空间②引入外部属性文件③配置bean

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <!--①在bean-data-source.xml引入context 名称空间-->
   <beans xmlns="http://www.springframework.org/schema/beans"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xmlns:context="http://www.springframework.org/schema/context"
          xsi:schemaLocation="
          http://www.springframework.org/schema/context
          http://www.springframework.org/schema/context/spring-context.xsd
          http://www.springframework.org/schema/beans
          http://www.springframework.org/schema/beans/spring-beans.xsd">
       <!--②引入外部属性文件 -->
       <context:property-placeholder location="datasource.properties"/>
       <!--③配置bean-->
       <bean id="druidDataSource" class="com.alibaba.druid.pool.DruidDataSource">
           <property name="username" value="${jdbc.user}"/>
           <property name="password" value="${jdbc.password}"/>
           <property name="url" value="${jdbc.url}"/>
           <property name="driverClassName" value="${jdbc.driver}"/>
       </bean>
   </beans>
   ```

   - 注意**：在使用 <context:property-placeholder> 元素加载外包配置文件功能前，首先需要在 XML 配置的一级标签 <beans> 中添加 context 相关的约束。**
   -  xsi:schemaLocation的顺序先http://www.springframework.org/schema/context再http://www.springframework.org/schema/context/spring-context.xsd

   ```java
   package com.joker.spring6.iocxml.jdbc;
   
   import com.alibaba.druid.pool.DruidDataSource;
   import org.junit.jupiter.api.Test;
   import org.springframework.context.ApplicationContext;
   import org.springframework.context.support.ClassPathXmlApplicationContext;
   
   public class TestJdbc {
       @Test
       public void testJdbcOne() {
           DruidDataSource dataSource = new DruidDataSource();
           dataSource.setUsername("root");
           dataSource.setPassword("12345");
           dataSource.setUrl("dbc:mysql://localhost:3306/spring?serverTimezone=UTC");
           dataSource.setDriverClassName("com.mysql.cj.jdbc.Driver");
       }
       @Test
       public void testJdbcTwo() {
           ApplicationContext context = new ClassPathXmlApplicationContext("bean-data-source.xml");
           DruidDataSource dataSource = (DruidDataSource) context.getBean("druidDataSource");
           System.out.println(dataSource.getUrl());
       }
   }
   ```

   ```verilog
   2025-05-29 17:44:19 353 [main] DEBUG org.springframework.context.support.ClassPathXmlApplicationContext - Refreshing org.springframework.context.support.ClassPathXmlApplicationContext@19835e64
   2025-05-29 17:44:19 469 [main] DEBUG org.springframework.beans.factory.xml.XmlBeanDefinitionReader - Loaded 2 bean definitions from class path resource [bean-data-source.xml]
   2025-05-29 17:44:19 492 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'org.springframework.context.support.PropertySourcesPlaceholderConfigurer#0'
   2025-05-29 17:44:19 524 [main] DEBUG org.springframework.core.env.PropertySourcesPropertyResolver - Found key 'jdbc.user' in PropertySource 'localProperties' with value of type String
   2025-05-29 17:44:19 524 [main] DEBUG org.springframework.core.env.PropertySourcesPropertyResolver - Found key 'jdbc.password' in PropertySource 'localProperties' with value of type String
   2025-05-29 17:44:19 525 [main] DEBUG org.springframework.core.env.PropertySourcesPropertyResolver - Found key 'jdbc.url' in PropertySource 'localProperties' with value of type String
   2025-05-29 17:44:19 525 [main] DEBUG org.springframework.core.env.PropertySourcesPropertyResolver - Found key 'jdbc.driver' in PropertySource 'localProperties' with value of type String
   2025-05-29 17:44:19 529 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'druidDataSource'
   jdbc:mysql://localhost:3306/spring?serverTimezone=UTC
   ```

   

   

   

   

   

   




