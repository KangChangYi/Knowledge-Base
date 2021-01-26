# 你不知道的 JavaScript 下卷知识点整理（二）

整理的第二部分

部分简单的内容举🌰后不再赘述（知识点全都写出来真的很多！😅）。

## 第一章 ES? 现在与未来
这一章主要讲述了关于 “ES版本” 有关的内容以及第一部分整理的末尾提到的 transpiling
### 1.1 transpiling
想要使用新特性但浏览器尚未支持，解决这个矛盾的答案就是工具化，就是一种称为 transpiling 的技术，其思路就是将 ES6 代码转换为可以在 ES5 环境下工作的代码

下面两个工具都可以做到 transpiling
+ [Babel](https://babeljs.io/)
从 ES6+ 编译到 ES5
+ [Traceur](https://github.com/google/traceur-compiler)
将 ES6、ES7 以及后续版本转换到 ES5

### 1.2 shim/polyfill
polyfill会为新环境中的行为定义在旧环境中的等价行为。语法不能polyfill，而API可以。

举例来说，Object.is(..) 是用于检查两个值严格相等的新 API，并且不像 === 在处理 NaN 和 -0 时有例外情况，对Object.is(..) 应用polyfill:
```js
if(!Object.is) {
    Object.is = functino(v1, v2) {
       // 检查 -0
       if (v1 === 0 && v2 === 0) {
           return 1 / v1 === 1 / v2;
       }
       // 检查 NaN
       if (v1 !== v1) {
           return v2 !== v2;
       }
       // 其余情况
       return v1 === v2
    }
}
```
这段代码最外层的 if 语句，它表示这段代码在未定义这个 API 的旧环境有效。
## 第二章 ES6 语法

### 2.1 块作用域声明 & let & const
#### 2.1.1 块作用域
在Es6以前，创建一个块作用域的办法是IIFE：
```js
var a = 2;

(function IIFE(){
    var a = 3;
    console.log(a);  // 3
})();

console.log(a)  // 2
```
但现在，我们只需要使用 { .. } / let / const 就可以创建一个 块作用域（block scoping）。
+ 显式的块作用域：
```js
var a = 2;

{
    var a = 3;
    console.log(a);  // 3
}

console.log(a)  // 2
```
+ 隐式的块作用域：
🤔思考下面的代码，回答哪些变量只存在 if 语句内部？哪些变量只存在 for 循环内部？
```js
let a = 2;
if(a > 1) {
    let b = 3 * a;
    console.log( b )  // 6

    for(let i = a ; i <= b ;i++){
        let j = i + 10;
        console.log(j);
    } // 12 13 14 15 16

    let c = a + b;
    console.log( c );   // 8
}
```
答案是 if 语句内部只包含 b 和 c，for 循环内部只包含 i 和 j 。

#### 2.1.2 let 声明
let 声明的特点除了创建隐式的块作用域外，还有一个特点是 TDZ （暂时性死区）
过早的访问 let 声明将会导致引用错误（ReferenceError），严格来说叫 TDZ 错误
```js
console.log( a );  // undefined
console.log( b );  // ReferenceError

var a;
let b;
```
使用 let + for 的组合将会使得 每次循环迭代都会封闭一个新的 i。
🤔：
```js
for(let i = 0; i < 10; i++){
    setTimeout(() => {
        console.log( i );
    }, 100)
}
// 0 1 2 3 4 5 6 7 8 9
```
var + for 却是这样的：
```js
for(var i = 0; i < 10; i++){
    setTimeout(() => {
        console.log( i );
    }, 100)
}
// 十次 10
```
循环迭代内部创建的闭包封闭的是每次迭代的变量，let 声明创建的块作用域使得每次创建的 i 都是相互隔离的，而 var 声明导致外层作用域只有一个 i ，每次迭代都把这个 i 封闭进去，而不是一个新的 i 。
####  2.1.3 const 声明
const 声明的特点：
+ 块作用域
+ TDZ
+ 创建常量
but ，如果值是复杂值，比如 Array 和 Object 则仍然可以修改。
```js
const a = [1,2,3,4];
a.push( 5 );

console.log( a ); // [1,2,3,4,5];
a = 42;  // TypeError!
```

### 2.2 spread / rest 运算符
ES6的新运算符 ... ,通常成为 spread 或 rest 运算符 （展开或收集）运算符，它是哪一种取决于它用在哪。🤔
####  2.2.1 spread
举个栗子：
```js
function foo(a,b,c){
    console.log( a, b, c );  
};

foo( ...[1,2,3] ); // 1 2 3;
```
当 ... 运算符用在任何iterable对象之前时（比如数组，伪数组），它会展开其中的值。
#### 2.2.2 rest
再举个栗子：
```js
function foo(a,b, ...c){
    console.log( a, b, c );
};

foo( 1, 2, 3, 4, 5 );   // 1 2 [3,4,5];
```
现在 ... 运算符的作用是收集剩下的参数。
tip：
 ... 运算符用于收集时只能在最后出现。
 ```js
 // 错误示范
 function foo(a, ...b, c){
     console.log( a, b, c );
 };

 foo( 1, 2, 3, 4, 5 ); // Rest parameter must be last formal parameter 
 ```

### 2.3 默认参数值
 在ES6以前设定函数默认参数是这样的：
 ```js
function(a,b){
    a = a || 10;
    b = b || 20;
    console.log( a + b );
};
foo();         // 30
foo( 5, 6 )    // 11
foo( 5 )       // 25
foo( null, 6 ) // 16
```
* 当传入的参数为 ‘假’ 值时，默认参数值有效。（ ‘假’ 值见第一部分 2.1.3）
现在的默认参数值（ES6）：
```js
function foo(a = 10, b = 20){
    console.log( a + b );
}
foo();               // 30
foo( 5, 6 );         // 11
foo( 0, 6 );         // 6
foo( 5, undefined ); // 25
foo( 5, null );      // 5  <- null 被强制转换为 0
```
此外默认参数值还可以是各种表达式、函数表达式。

### 2.4  解构
ES6引入的新语法特性——解构，或者理解成——结构化赋值。
```js
const arr = [1,2,3];
const obj = {
     x: 1,
     y: 2,
     z: 3,
};
let [ a, b, c ] = arr;  // 数组解构
let { x, y, z } = obj;  // 对象解构
console.log( a, b, c );  // 1 2 3
console.log( x, y, z );  // 1 2 3
```
tip:解构语法可用于解构函数参数
#### 2.4.1 对象属性赋值模式
从上面的栗子可以看到对象解构时赋值给同名变量的解构方法，但如果要赋值给非同名变量则需要：
```js
let { x : bar, y : baz, z : bam } = obj;
console.log( bar, baz, bam );  // 1 2 3
```
注意：对象解构赋值的语法模式是 source：target，
但我们常用的语法模式是 target：source，不能搞错。🤔

#### 2.4.2 重复赋值
对象解构允许多次列出同一个源属性，举个🌰：
```js
var { a: X, a: Y } = { a :1 };
X;  // 1
Y;  // 1
```

#### 2.4.3 默认值赋值
语法与前面的默认函数参数值类似的 = 语法，用来提供赋值的默认值。
```js
var { x: baz = 3, a: bar = 6, z: bam = 10 } = obj;

baz;   // 1
bar;   // 6
bam;   // 1
```
#### 2.4.4 解构并重组

为嵌套对象属性设置默认值的技巧：使用对象解构的 ‘重组’ 技术。  
例题：假设场景，已有系统默认设置，现在要将用户设置和默认设置合并，用户设置没有的部分使用默认设置设定，已有的部分采用用户的设置。

+ 默认设置
```js
var default = {
    options: {
        remove: true,
        enable: false,
        instance: {},
    },
    log: {
        warn: true,
        error: true,
    }
}
```
+ 用户设置
```js
var config = {
    options: {
        remove: false,
        instance: null,
    }
};
```
现在，通过解构并重组实现：
```js
// 把default合并进config    带默认值的赋值解构
let {
    options: {
        remove = default.options.remove,
        instance = default.options.instance,
        enable = default.options.enable
    } = {},
    log: {
        warn = default.options.warn,
        error = default.options.error
    } = {},
} = config;

config = {
    options: { remove, instance, enable},
    log: { warn, error}
}
```
是不是很简单？ 😁

### 2.5 太多，太少，刚刚好
这一部分主要讲了：数组解构和对象解构时并不需要把所有的值都赋值一次。

### 2.6 对象字面量扩展
ES6 为普通 { .. } 对象字面量新增了几个重要的扩展，简单举例。
#### 2.6.1 简介属性
如果你定义的属性与变量名相同，就可以用简写代替。
```js
let x = 2, y = 3,
    o = {
        x: x,
        y: y,
    };

<!-- 简写 -->

let x = 2, y = 3,
    o = {
        x,
        y,
    };

```
#### 2.6.2 简写方法
```js
<!-- 老方法 -->
var o = {
    x: function(){ .. },
    y: function(){ .. },
}

<!-- 简写 -->
var o = {
    x(){ .. },
    y(){ .. },
}
```
👋注意！简写意味着匿名函数，所以在需要递归以及事件绑定/解绑定的时候不要使用简写。

#### 2.6.3 计算属性名
```js
var prefix = "user_";

var o = {
    bax: function(){ .. };
}

o[ prefix + "foo" ] = function(){ .. };
o[ prefix + "bar" ] = function(){ .. };
```

#### 2.6.4 设定[[Prototype]]
详细介绍见上第二部分
```js
var o1 = {
    ..
};

var o2 = {
    __proto__: o1,
    ..
};
```
这里 o2 的 [[Prototype]] 连接到了 o1。
要为已经存在的对象设定 [[Prototype]] 使用 ES6 工具 Object.setPrototypeOf(..):
```js
var o1 = { .. };
var o2 = { .. };

Object.setPrtotypeOf( o2, o1 );
```

#### 2.6.5 super 对象
通常super对象用于类相关，但是 JavaScript 是原型类而非类对象的本质，所以 super 对于普通对象的简洁方法一样有效：
```js
var o1 = {
    foo() {
        console.log( "o1:foo" );
    }
};

var o2 = {
    foo() {
        super.foo();
        console.log( "o2:foo" );
    }
};

Object.setPrototypeOf( o2, o1 );
o2.foo();    // o1.foo
             // o2.foo
```
👋注意！这里的 super 只能在简写方法中出现，不允许在普通函数表达式属性中出现，并且只允许以 super.xxx , 不能像在继承时的用法 super() 一样。


### 2.7 模板字面量
模板字面量是 ES6 的新特性，书中作者将他重命名为 ‘插入字符串字面量’，这样比较符合他的特点。

模板字面量使用 ` 符号作为界定符，可将表达式插入在字符串中，它会被自动解析求值：

+ 老方法：
```js
var fName = 'k',lName = 'y';
var name = fName + 'c' + lName;
console.log( name );   // 'kcy'
```

+  ES6新方法
```js
var fName = 'k',lName = 'y';
var name = `${fName}c${lName}`;
console.log( name );   // 'kcy'
```
👆可以看到，一组字符使用 `` 包裹，其中的表达式写在 ${..} 中，

#### 2.7.1 插入表达式
在模板字面量的 ${..} 内可以出现任何合法的表达式，包括函数调用，甚至是其他的模板字面量。
🤔：
```js
let upper = val => val.toUpperCase();
var who = "reader";
var text = `i am ${upper( who )}!`;
console.log( text );  // "i am READER!" 
```
不推荐在模板字面量中插入模板字面量，就不举例说明了。

#### 2.7.2 标签模板字面量
这个说实话我觉得有点奇技淫巧的感觉，或者是我现在想不到它的应用场景，下面举例:
```js
function foo(strings, ...values) {
    console.log( strings );
    console.log( values );
}
var desc = "awesome";
foo`Everything is ${desc}!`;
// ["Everything is", "!"]
// ["awesome"]
```
书上的表达有点奇怪，说一下我自己的理解：

首先看到最奇怪的部分是 foo`` 这一部分，这是一类不需要 ( .. ) 的特殊函数调用，被调用的 foo 函数的参数就是模板字面量里面的内容。

其中 foo 的第一个参数 strings 是模板字面量中普通字符串组成的数组，所以 strings 数组有两个值："Everything is" 和 "!".

例子中使用 ... 运算符将其余参数收集到了 values 数组中，获取到的结果为 "awesome"，但其实不需要使用 ...values 也可以获取到模板字面量中的结果，例子为了方便起见。

### 2.8 箭头函数 

ES6 实在太多，阮一峰前辈的 ES6 也看了，这边讲的 ES6 也看了，有时间再整理😅。

未完待续...