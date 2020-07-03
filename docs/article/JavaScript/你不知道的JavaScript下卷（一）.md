## 你不知道的 JavaScript 下卷知识点整理（一）

图书馆没有该系列的上卷和中卷，只借到了下卷，不过上卷之前在网上看过别人整理的笔记，也算看了一半，下次再回头来看上中吧。

# 前言
> ![](https://raw.githubusercontent.com/KangChangYi/Picture-library/master/you-dont-know-javascript.png)

这本 《你不知道的 JavaScript 下卷》 是我启动巩固 js 基础之路看的第一本书。在看完书之后写知识点整理的初衷，是为了再次回顾书籍内容加深印象，但我发现该系列的上卷和中卷好像才是我需要的😭，因为这本书上很多知识点都只做简单介绍，详细内容在上卷和中卷里面（挠头）。

# 第一章 深入编程
第一章是编程基础中的基础，不再整理了，直接从第二章开始。

# 第二章 深入 JavaScript

## 2.1 值与类型

以下是 JavaScript 中的 7 种内置类型：

+ 字符串 String
+ 数字 Number
+ 布尔型 Boolean
+ Null
+ Undefined
+ 对象 Object
+ 符号 Symbol ( ES6 )  



JavaScript 提供了一个 typeof 运算符，用来查看值的类型：
```js
var a;
typeof a;    // undefined

a = "hello world";
typeof a;    // string

a = 42;
typeof a;    // number

a = true;
typeof a;    // boolean

a = null;
typeof a;    // object 由于二进制前三位为 0 会被判断为 object ，而 null 是全 0 ，其实这是 js 的 bug

a = undefined;
typeof a;    // undefined

a = {b:"c"}
typeof a     // object 
```

### 2.1.1 对象

对象类型是指一个组合值，可为其设置属性，每个属性可以有不同的类型。
可以通过  “点号” 或 “中括号” 来访问属性：
```js
obj.a
obj.["a"]
```

在JavaScript中，你应该吧 **数组** 和 **函数** 看作对象类型的特殊子类型，而不是内置类型。

+ 数组 Array
```js
var arr = [];
typeof arr;    // object
```

+ 函数 Function
```js
function foo(){
    return 42;
}
typeof foo;   // function
typeof foo(); // number
```

内置对象：
+ String
+ Number
+ Boolean
+ Object
+ Function
+ Array
+ Date
+ RegExp
+ Error
这些内置对象其实是一些内置函数，可以当作构造函数来使用（用 new 操作符）。

更多信息见 中卷 第一部分
### 2.1.2 内置类型方法
举个例子：
```js
var a = "hello world";
a.length  // 11
```
其中 a.length 就是内置类型方法， Js 会自动的将这个值为其对应的对象封装。

字符串值可以封装为 String 对象，数字可封装为 Number 对象……

length 就是封装在 a 原型中的方法。
更多信息见 中卷 第一部分

### 2.1.3 值的比较
1. 类型转换
+ 显示  
`var a = "42";   var b = Number( a ); `
+ 隐示  
`var a = "42";   var b = a * 1; `

2. 真与假
JavaScript 中 "假" 值的详细列表如下：
+ “” (空字符串)
+ 0、-0、NaN (无效数字
+ null、undefined
+ false
不在 "假" 值列表中的都是 “真” 值。

3. 相等
+ == 检查值相等 ( 粗略相等 )
+ === 检查值与类型相等 ( 严格相等 )
更多信息见 中卷 第一部分

## 2.2 变量

### 函数作用域
1. 提升
无论 var 出现在作用域中的哪个位置，这个声明都属于整个作用域，在其中到处都可以访问。
概念上 var 声明 “移动” 到了其所在作用域的最前面。

2. 嵌套作用域
内层作用域可以访问外层，反之则不行。
更多信息见 上卷 第一部分

## 2.3 条件判断
```js
if (a == 2) {
    ...
} else if ( a == 42) {
    ...
} else {
    ...
}

switch (a) {
    case 2:
      ...
      break;
    case 10:
      ...
      break;
    default:
      ...
}
// 三元表达式
var b = 42;
var a = ( b > 41 ) ? "true" : "false";

console.log(a)   // "true"
```
更多信息见 中卷 第一部分
## 2.4 严格模式
省略

## 2.5 作为值的函数
函数本身可以作为其他函数的参数或者赋值给一个变量，又或者从其他函数传出。
🤔：
```js
    var foo = function bar() {
        //...
    }
```
更多信息见 上卷 第一部分
### 2.5.1 立即执行函数表达式

IIFE
```js
(function IIFE(){
    ..
})()
```
其中最外层的 (..) 是为了防止它成为普通函数声明。

表达式最后的 () 类似于：
```js
function foo(){ .. };
// 使用 foo函数引用表达式，然后 () 执行它
foo();

// IIFE函数表达式, () 执行它
(function foo(){ .. })();
```

+ IIFE 不会影响外部变量
+ IIFE 可以有返回值：
```js
var x = (function IIFE(){ .. })();
x;  // ..
```

### 2.5.2 闭包
可以将闭包看做：在函数运行完毕后继续访问这个函数作用域的一种方法

闭包最主要的作用就是可以让函数外部访问函数内部

简单举例：
```js
function makeAdder( x ) {
    // x 是个内层变量
    // 内层函数 add() 使用 x,所以它外围有一个闭包
    function add( y ) {
        return y + x
    };
    return add;
}
var plusOne = makeAdder( 1 );
var plusTen = makeAdder( 10 );

plusOne( 3 );   // 4 <-- 1 + 3
plusOne( 41 );  // 42 <-- 1 + 41

plusTen( 13 );  // 23 <-- 10 + 13
```
更多信息见 上卷 第一部分

## 2.6 this 标识符
首先，this 标识符并不指向这个函数本身。
举例🤔：
```js
function foo() {
    console.log( this.bar );
};
var bar = "global";
var obj1 = {
    bar: "obj1",
    foo: foo,
};
bar obj2 = {
    bar: "obj2",
};

//-----
foo();              // 全局的
obj1.foo();         // "obj1"
foo.call( obj2 );   // "obj2"
new foo();          // undefined
```
关于如何设置 this 有 4 条规则，上面代码最后 4 行展示了这 4 条规则：
(1)在非严格模式下，foo()最后会将 this 设置为全局对象，在严格模式下，这是未定义的行为。
(2) obj1.foo() 将 this 设置为对象 obj1。
(3) foo.call(obj2) 将 this 设置为对象 obj2。
(4) new foo() 将 this 设置为一个全新的空对象。
更多信息见 上卷 第二部分

## 2.7 原型
当 js 引用对象某个属性不存在时，js 将通过查找对象的原型链来找到这个属性。

使用 Object.create() 内置方法来实现原型的链接
```js
var foo = {
    a: 42
}
// 创建 bar 将其链接到 foo
var bar = Object.create( foo );

bar.b = "hello world";

bar.b;   // hello world
bar.a;   // 42
```
更多信息见 上卷 第二部分

## 2.8 旧与新
### 2.8.1 polyfilling
### 2.8.2 transpiling
它是由 tansforming (转换) 和 compiling (编译) 组合而来的术语。

+ [Babel](https://babeljs.io/)
从 ES6+ 编译到 ES5
+ [Traceur](https://github.com/google/traceur-compiler)
将 ES6、ES7 以及后续版本转换到 ES5

## 2.9 非 JavaScript
当你的代码在浏览器中运行时，将会有一个 document “宿主对象”。

其实 document 的上的方法是由浏览器的 DOM 提供的指向内置方法的一个接口。
在某些浏览器中它可能在JavaScript中，另外还包括 `alter( .. ); console.log( .. )`

# 第三章——深入 你不知道的 JavaScript 系列
详细介绍在本系列其他卷上
## 3.1 作用域和闭包
见上卷第一部分
## 3.2 this和对象原型
见上卷第二部分
## 3.3 类型和语法
见中卷第一部分
## 3.4 异步和性能
见中卷第二部分
## 3.5 ES6及更新版本
见本文ES6


完结...