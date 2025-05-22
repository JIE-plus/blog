---
title: spring
description: spring
date: 2025-05-22
tags:
  - spring
---

# spring

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

```verilog
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

### 结论**

- 根据类型来获取bean时，在满足bean唯一性的前提下，其实只是看：『对象 **instanceof** 指定的类型』的返回结果，只要返回的是true就可以认定为和类型匹配，能够获取到。
- java中，instanceof运算符用于判断前面的对象是否是后面的类，或其子类、实现类的实例。如果是返回true，否则返回false。也就是说：用instanceof关键字做判断时， instanceof 操作符的左右操作必须有继承或实现关系