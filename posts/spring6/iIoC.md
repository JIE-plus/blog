---
title: spring
description: spring
date: 2025-05-22
tags:
  - spring
---

# Spring

## IoC：是Inversion of Control 控制反转

- Spring通过 **`IoC容器`**来管理
- **`1、所有Java对象的实例化和初始化，2、控制对象与对象之间的依赖关系`**
- IoC容器管理的Java对象称为 **`Spring Bean`**，它与使用关键字new创建的Java对象没有任何区别

## IoC的实例化和初始化工作过程

1.  xml配置文件 (Bean定义信息  BeanDefinition)
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

```
0、调用无参构造方法！
1、com.joker.spring6.User@5c48c0c0
2、add().....
```

## 依赖注入

- **指Spring创建对象的过程中，将对象依赖属性通过配置进行注入**

### 依赖注入常见的实现方式包括两种：

- 第一种：set注入
- 第二种：构造注入

**所以结论是：IOC 就是一种控制反转的思想， 而 DI 是对IoC的一种具体实现。**

**Bean管理说的是：Bean对象的创建，以及Bean对象中属性的赋值（或者叫做Bean对象之间关系的维护）。**

- 基于XML管理bean
- 基于注解管理bean





