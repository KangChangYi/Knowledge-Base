# JavaScript 数据结构和算法—数组整理

学 《JavaScript 数据结构和算法》—数组篇回顾及整理

## 前言

> ![](https://raw.githubusercontent.com/KangChangYi/Picture-library/master/image-JavaScript-Data-Structures.png)

这本 《JavaScript 数据结构和算法》是掘金上推荐的 Js 基础算法书，之前大一的时候没想好职业方向，数据结构课神游，就这么水过去了😫，导致数据结构和算法基础半吊子。现在再次捡起来，想通过这本书弥补我的基础短板，少壮不努力，老大徒伤悲啊🤕。

## 创建和初始化数组

### 常用

```js
var arr = [];                       // 初始化数组
var arr = ['sheep', 'dog', 'cat'];  // 指定元素初始化数组
arr.length                          // 使用 length 获取数组长度
```

### 使用 new Array
```js
var arr = new Array();      // 初始化数组
var arr = new Array(7);     // 指定数组长度 ([empty × 7])
var arr = new Array('sheep', 'dog', 'cat');   // 指定元素初始化数组
```

### 使用 Array.from 方法 (ES6)
根据已有的数组创建一个新的数组（复制）。

```js
// 复制 arr 到 arr2
let arr2 = Array.from(arr)
```

from 方法第二个参数（可选）接受一个函数，每个元素会执行该函数，相当于 map 方法

```js
// 复制是偶数的元素
let even = Array.from(arr2, x => (x % 2 == 0));
```

👉 <b>Array.from 还可以将 伪数组、可迭代对象 作为参数创建数组，其他创建数组的方式通过 ... 运算符消耗迭代器也可以达到同样的效果。</b>

### 使用 Array.of 方法 (ES6)
Array.of 根据传入的参数创建一个新数组

```js
let arr3 = Array.of();    // [];
let arr3 = Array.of(1, 2, 3, 4);    //[1, 2, 3, 4];
// 或者
let arr3 = Array.of(...arr2);
```

## 核心方法

<b>为了方便起见，后面所列的方法都使用这个数组作为🌰（除非重新定义），并且每个方法之间的结果互不干扰：</b>
（如果某个方法会改变原始数组，会注明）

``` js
var arr = [1, 2, 3, 4, 5];
```
### 添加元素

+ push
向数组末位添加元素，返回添加后的数组长度，改变目标数组！
```js
arr.push(6, 7);        // 7
arr;      // [1, 2, 3, 4, 5, 6, 7]
```

+ unshift
向数组首位添加元素，返回添加后的数组长度，改变目标数组！
```js
arr.unshift(-1, 0);    // 7
arr;      // [-1, 0, 1, 2, 3, 4, 5]
```

### 删除元素

+ pop
删除数组末位的元素，返回被删除的元素，改变目标数组！
```js
arr.pop();             // 5
arr;      // [1, 2, 3, 4]
```
+ shift
删除数组首位的元素，返回被删除的元素，改变目标数组！
```js
arr.shift();           // 1
arr;      // [2, 3, 4, 5]
```

### 任意位置添加或删除元素

+ splice
第一个参数：想要添加或删除元素的索引值
第二个参数：删除元素的个数
第三个参数：要添加的值
它返回被删除元素的数组，改变目标数组！
```js
// 删
arr.splice(1, 1);           // [2]
arr;      // [1, 3, 4, 5]
// 增
arr.splice(1, 0, "tom", "cat");           // [2]
arr;      // [1, "tom", "cat", 2, 3, 4, 5]
```

### 寻找索引
+ indexOf
返回第一个与给定参数相等的元素索引值，没找到则返回 -1。
```js
arr.indexOf(1);     // 0
arr.indexOf(88);    // -1
```
+ lastIndexOf
返回在数组中搜索到与给定参数相等的元素索引值中的最大值，没找到则返回 -1。
```js
var arr = [0, 2, 2, 3]
arr.lastIndexOf(2);     // 2
arr.lastIndexOf(88);    // -1
```

### 数组合并和连接

+ concat
该方法向一个数组传递一个数组、对象或者元素，并且按参数顺序进行合并。
```js
let me = "kcy";
let you = ["customer", "readers"];
arr.concat(me, you);    // [1, 2, 3, 4, 5, "kcy", "customer", "readers"]
```

+ join
将一个数组（或一个类数组对象）的所有元素连接成一个字符串并返回这个字符串。
```js
var elements = ['Fire', 'Wind', 'Rain'];

console.log(elements.join());   // "Fire,Wind,Rain"
console.log(elements.join('')); // "FireWindRain"
```
### 数组分割

+ slice
返回一个新的数组数组，这一数组是由 begin 和 end（不包括end）决定的原数组的浅拷贝。
```js
var animals = ['ant', 'bison', 'camel', 'duck', 'elephant'];
animals.slice(2);        // ["camel", "duck", "elephant"]
animals.slice(2, 4);     // ["camel", "duck"]
```

### 数组颠倒

+ reverse
将数组中元素的位置颠倒，并返回该数组，改变目标数组！
```js
var arr = ['one', 'two', 'three'];
arr.reverse();   // ['three', 'two', 'one'];
```

### 数组排序

+ sort
sort 用原地算法对数组的元素进行排序，并返回数组。排序算法现在是稳定的。默认排序顺序是根据字符串 Unicode 码点，改变目标数组！
```js
function sort(a, b) {
    if(a < b){
        return -1;
    } else {
        return 1;
    }
}
var result = arr.sort(sort);
result     // 顺序
```
+ 原地算法大致是指在原数组上操作，所以会改变原数组，该算法为线性时间复杂度。

### 迭代数组
事先定义一个函数：
```js
let isEven = function(val, idx, arr) {
    return (val % 2 == 0);
};
```

+ every
判断是否全部满足   有一个值为 false 则立即返回 false , 全 true 才 true。
接收参数：函数（1：当前值，2：当前索引值，3：当前所属数组），4：指定 this。
```js
let result = arr.every(isEven);
result   // false
```

+ some
判断是否部分满足   有一个值为 true 则立即返回 true。
接收参数：函数（1：当前值，2：当前索引值，3：当前所属数组），4：指定 this。
```js
let result = arr.some(isEven);
result   // false
```

+ forEach
和 for 循环相同。
接收参数：函数（1：当前值，2：当前索引值，3：当前所属数组），4：指定 this。
```js
arr.forEach((val) => {
    console.log(val);
})
```

+ map
返回新数组的遍历方法。
接收参数：函数（1：当前值，2：当前索引值，3：当前所属数组），4：指定 this。
```js
// 返回 arr 数组除二后的结果
const map = arr.map((val) => {
    return val / 2;
})
```

+ filter
返回新数组的遍历方法，仅返回函数值为 true 的元素构成的数组。
接收参数：函数（1：当前值，2：当前索引值，3：当前所属数组），4：指定 this。
```js
// 返回 arr 数组的偶数
const filter = arr.filter((val) => {
    return val % 2 === 0
})
```

+ reduce
reduce 接收的函数会返回一个将被叠加到累加器的值，reduce停止后返回这个累加器。
接收参数：函数（初始值，当前值，当前索引值，当前所属数组），传递给函数的初始值
```js
// 累加 arr 数组的值
arr.reduce((previous, current, index) => {
    return previous + current;
})
```


## ES6+ 新方法

### 使用 for...of 循环数组
```js
for (let i of arr) {
    console.log( i );
}
```

### 数组的 entries、keys、values 方法
+ entries() 得到数组每一个项的键值对
+ keys() 得到数组每一项的下标
+ values() 得到数组每一项的值

### Array.from、Array.of 
在开头介绍过了

### fill 方法
fill 方法用静态值填充数组，会改变目标数组！
接收参数：（静态值，开始位置，结束位置（不包括））
```js
let arr = Array.of(1, 2, 3, 4, 5);
arr.fill(0);
arr;      // [0, 0, 0, 0, 0]
```

### copyWithin 方法
赋值数组中的一系列元素到同一数组指定的起始位置。
接收参数：（目标位置，复制元素起始位置，停止复制元素索引位置（默认为length，如果是负值，表示倒数））
```js
let arr = [1, 2, 3, 4, 5, 6];
arr.copyWithin(1, 3, 5);
arr;     // [1, 4, 5, 4, 5, 6]
```

### find 和 findIndex
find 方法返回满足回调函数条件的元素，而 findIndex 则返回下标。
在都不满足的情况下，find 返回 undefined，而 findIndex 返回 -1。
接收参数：函数（1：当前值，2：当前索引值，3：当前所属数组），4：指定 this。
```js
function isTwo(val, idx) {
    return (val == 2);
};
let result = arr.find(isTwo);
result;      // 2

result = arr.findIndex(isTwo);
result;      // 1
```

### includes 方法
如果数组中存在某个元素，返回 true，否则返回 false。
接收参数：搜索的值，起始索引组
```js
console.log(arr.inclues(4))   // true
console.log(arr.inclues(4, 5))   // false
```


完结...