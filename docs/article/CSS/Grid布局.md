
# Grid 布局基础

## 基础
使用 
```css
<!-- 块级 grid -->
display: grid;
<!-- 行内 grid -->
display: inline-grid;
``` 
属性为一个元素添加 Grid 布局，其中 Grid 布局的最外层元素称为容器，容器的最外层子元素被称为项目。

## 相关属性
+ 定义行宽列高
```css
display: grid;
grid-template-columns: 50px 50px 50px;
grid-template-rows: 100px 100px 100px;
```
上面两行代码定义了一个三行三列的 grid 容器，并且其中列宽均是 50px，行高 均是 100px，单位还可以是百分比。

+ 使用 repeat() 函数替代重复值
repeat() 函数用法：
```css
display: grid;
grid-template-columns: repeat(3, 50px);
grid-template-rows: repeat(3, 100px);
```
第一个参数是重复次数，第二个是要重复的值。

+ auto-fill 关键字
有时候容器的宽度是不固定的，但是项目的宽度是固定的，如果我们想每一行尽可能的多容纳一些项目，则可以使用 ``` auto-fill ```
```css
display: grid;
grid-template-columns: repeat(auto-fill, 50px);
```

+ fr 关键字
`fr` 关键字类似于 `display` 布局中的  `flex` 属性，用户表示项目之间的比例关系，例如 `fr: 1` 和 `fr: 2`，则 2 是 1 的两倍。

可以和绝对单位配合使用，非常方便。
```css
display: grid;
grid-template-columns: 150px 1fr 2fr;
```
第三列的宽度是第一列的两倍。

+ minmax() 函数
使用 minman() 函数产生一个长度范围，接受两个参数，最大值和最小值。
```css
grid-template-columns: 1fr 1fr minman(100px, 1fr);
```
表示不小于 100px，不大于 1fr。

+ auto 关键字
使用了 auto 关键字的对应宽和高将会根据剩余宽度自适应大小。
```css
grid-template-columns: 100px auto 100px;
```
以上代码实现了两边固定，中间自适应大小的布局。

+ 网格线名称
通过在 `grid-template-columns` 和 `grid-template-rows` 中使用方括号，给每一根网格线指定名称，方便以后引用。
```css
grid-template-columns: [c1] 100px [c2] 100px [c3] auto [c4];
grid-template-rows: [r1] 100px [r2] 100px [r3] auto [r4];
```
上面代码，第一根竖网格线名称为 `c1`。

+ 行间距与列间距
通过 `grid-row-gap` 和 `grid-column-gap` 设置行与行，列与列的间距。