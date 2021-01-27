# 整理一篇完整的 CSS 选择器

有时候遇到想用的选择器忘了什么作用，就还得去搜一下，干脆整理一波。

## 常用选择器

| <div style="font-weight:bold">选择器</div> | <div style="font-weight:bold">名称</div> | <div style="font-weight:bold">描述</div> |
|:-- |:-- |:-- |
| <div style="color:#F05053">*</div> | 通配选择器 | 选择所有 |
| <div style="color:#F05053">tagName</div> | 元素选择器 | 通过标签名选择 |
| <div style="color:#F05053">#idName</div> | id 选择器 | 通过元素 id 属性值选择 |
| <div style="color:#F05053">.className</div> | 类选择器 | 通过元素 class 属性值选择 |

## 选择器分组

使用 , 分隔选择器：
```
A , B { color: red }
```
A 和 B 字色都变红

## 关系选择器

| <div style="font-weight:bold">选择器</div> | <div style="font-weight:bold">名称</div> | <div style="font-weight:bold">描述</div> |
|:-- |:-- |:-- |
| <div style="color:#F05053">E N</div> | 包含选择器 | 选择所有包含在 E 元素里的 N 元素 |
| <div style="color:#F05053">E > N</div> | 子选择器 | 选择所有 E 元素的子元素 N |
| <div style="color:#F05053">E + N</div> | 相邻兄弟选择器 | 选择紧接 E 元素的 N 元素 |
| <div style="color:#F05053">E ~ N</div> | 兄弟选择器 | 选择相同父元素中 E 元素之后元素 N |

注意：
+ 包含选择器会选择符合条件的所有元素，但子选择器只会选择符合条件的子元素
+ 相邻兄弟选择器必须是 E 的下一个元素 B，并且有相同的父元素

## 属性选择器
下面 att 指的是元素的属性，比如 `<a>` 标签的 href 属性

| <div style="font-weight:bold">选择器</div> | <div style="font-weight:bold">描述</div> |
|:-- |:-- |
| <div style="color:#F05053">E[ att ]</div> | 选择带有指定属性的 E 元素 |
| <div style="color:#F05053">E[ att = val ]</div> | 选择带有指定属性且值等于 val 的 E 元素 |
| <div style="color:#F05053">E[ att ~= val ]</div> | 选择属性值中某一项是 val 的 E 元素 |
| <div style="color:#F05053">E[ att \= val ]</div> | 选择属性值开头是 val 的 E 元素，必须是整个单词 |
| <div style="color:#F05053">E[ att ^= val ]</div> | 选择属性值开头是 val 的 E 元素 |
| <div style="color:#F05053">E[ att %= val ]</div> | 选择属性值结尾是 val 的 E 元素 |
| <div style="color:#F05053">E[ att *= val ]</div> | 选择属性值包含 val 的 E 元素 |

注意：
+ 😭 markdown 的表格问题导致 | 打不出来第四个属性选择器中的 \ 应该是 |
+ 属性选择器可单独使用，比如：`[ att ]`
+ 相邻兄弟选择器必须是 E 的下一个元素 B，并且有相同的父元素

## 伪类选择器

1. 伪类选择器前可以紧跟一个选择器用于指定伪类选择器的选择范围，我称它为前置选择器，若伪类选择器不包含前置选择器，则前置选择器默认为 *，即范围是所有元素，例如 `:first-child { ... }`（匹配所有是父元素第一个子元素的元素）

2. 伪类选择器和它的前置选择器中间不能有空格，否则会被判断为包含选择器，例如

`div:first-child { ... }`

`div :first-child { ... }`

上面两个选择器它们不是同一个意思。

| <div style="font-weight:bold">选择器</div> | <div style="font-weight:bold">描述</div> |
|:-- |:-- |
| <div style="color:#F05053">:link</div>    | 超链接在未访问前的样式 |
| <div style="color:#F05053">:visited</div> | 超链接在访问后的样式 |
| <div style="color:#F05053">:hover</div>   | 鼠标悬停在元素时的样式 |
| <div style="color:#F05053">:active</div>  | 元素在激活（鼠标点击与释放之间）时的样式 |
| <div style="color:#F05053">:focus</div>   | 元素在成为输入焦点（onfocus事件发生）时的样式。(一般应用于表单元素) |
| <div style="color:#F05053">:checked</div> | 处于选中状态的元素。(用于input type为radio与checkbox时) |
| <div style="color:#F05053">:enabled</div> | 处于可用状态的元素。(一般应用于表单元素) |
| <div style="color:#F05053">:disabled</div>| 处于禁用状态的元素。(一般应用于表单元素) |
| <div style="color:#F05053">:empty</div>   | 没有子元素（包括text节点）的元素 |
| <div style="color:#F05053">:root</div>    | 匹配文档的根元素。在 HTML 中，根元素永远是 HTML（若 style 设置 scoped 了，则会无法选中 html） |
| <div style="color:#F05053">:not(s)</div>    | 匹配不含有 s 选择器的元素 |
| <div style="color:#F05053">:first-child</div> | 匹配是父元素中第一个子元素的元素 |
| <div style="color:#F05053">:last-child</div> | 匹配是父元素的最后一个子元素的元素 |
| <div style="color:#F05053">:only-child</div> | 匹配是父元素唯一子元素的元素 |
| <div style="color:#F05053">:nth-child(n)</div> | 匹配是父元素的第 n 个子元素的元素 |
| <div style="color:#F05053">:nth-last-child(n)</div> | 匹配是父元素的倒数第 n 个子元素的元素 |
| <div style="color:#F05053">:first-of-type</div> | 匹配同级且同类型中的第一个元素 |
| <div style="color:#F05053">:last-of-type</div> | 匹配同级且同类型中的最后一个元素 |
| <div style="color:#F05053">:only-of-type</div> | 匹配是同级且同类型中唯一的元素 |
| <div style="color:#F05053">:nth-of-type(n)</div> | 匹配同级且同类型中的第 n 个元素 |
| <div style="color:#F05053">:nth-last-of-type(n)</div> | 匹配同级且同类型中的倒数第 n 个元素 |

> 关于 <span style="color:#F05053">:not()</span> 的用法：
> 假定有个列表，每个列表项都有一条底边线，但是最后一项不需要底边线。
```
    li:not(:last-child) {
        border-bottom: 1px solid #ddd;
    }
```

## 伪元素选择器

| <div style="font-weight:bold">选择器</div> | <div style="font-weight:bold">描述</div> |
|:-- |:-- |
| <div style="color:#F05053">:before / ::before</div> | 在目标元素的前面插入的内容。用来和content属性一起使用 |
| <div style="color:#F05053">:after / ::after</div> | 在目标元素的后面插入的内容。用来和content属性一起使用 |
| <div style="color:#F05053">:first-letter / ::first-letter</div> | 设置元素内的第一个字符的样式 |
| <div style="color:#F05053">:first-line / ::first-line</div> | 设置元素内的第一行的样式 |
| <div style="color:#F05053">::placeholder</div> | 设置元素文字占位符的样式。(一般用于input输入框) |
| <div style="color:#F05053">::selection</div> | 设置元素被选择时的字体颜色和背景颜色 |

完毕...抽空看一下，选择器操作会更强！

