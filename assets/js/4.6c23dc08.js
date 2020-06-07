(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{199:function(t,e,v){"use strict";var _=v(75);v.n(_).a},206:function(t,e,v){"use strict";v.r(e);v(199);var _=v(0),a=Object(_.a)({},function(){var t=this,e=t.$createElement,v=t._self._c||e;return v("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[v("h2",{attrs:{id:"vue-原理之变化侦测"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#vue-原理之变化侦测","aria-hidden":"true"}},[t._v("#")]),t._v(" Vue 原理之变化侦测")]),t._v(" "),v("blockquote",[v("p",[t._v("本篇整理自《深入浅出Vue.js》")])]),t._v(" "),v("blockquote",[v("p",[t._v("更新时间：2020/3/21 14:51")])]),t._v(" "),v("h2",{attrs:{id:"前言"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#前言","aria-hidden":"true"}},[t._v("#")]),t._v(" 前言")]),t._v(" "),v("p",[t._v("本文是第一篇对书中 "),v("strong",[t._v("Vue")]),t._v(" 原理的浓缩整理，我看完这本书是在一月份，而现在已经三月底了，我拖了还是真挺久的，不去看看月总结还真不知道我干了什么😑。")]),t._v(" "),v("p",[t._v("前端技术发展至今天，"),v("strong",[t._v("Vue")]),t._v(" 及 "),v("strong",[t._v("React")]),t._v(" 已经成为前端工程师的必备技能，新的框架极大的提高了我们的开发效率，并且很容易学习。")]),t._v(" "),v("p",[t._v("我有一句印象很深的话，是这么说的："),v("em",[t._v("“学习新技术的同时，要更多的关注和了解它的原理，而不仅仅是用法。你每了解一个它的原理，就像是打下了一个桩，这些桩最终会关联在一起，它会在你看源码时起到非常大的作用。”")])]),t._v(" "),v("p",[t._v("在使用 "),v("strong",[t._v("Vue")]),t._v(" 开发项目的时候，大家都会遇到一些奇奇怪怪的问题，而能否快速解决这些问题，并理解这些问题为什么会发生，主要取决于对 "),v("strong",[t._v("Vue")]),t._v(" 原理的理解是否足够深入。")]),t._v(" "),v("p",[t._v("将学习原理成为一种习惯是我对自己的一点要求，自知记性不好但别把这点忘了💾。")]),t._v(" "),v("h2",{attrs:{id:"object-的变化侦测"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#object-的变化侦测","aria-hidden":"true"}},[t._v("#")]),t._v(" Object 的变化侦测")]),t._v(" "),v("p",[v("strong",[t._v("Object")]),t._v(" 和 "),v("strong",[t._v("Array")]),t._v(" 的变化侦测在 "),v("strong",[t._v("Vue")]),t._v(" 中采用的不同的处理方式，具体原因在讲 "),v("strong",[t._v("Array")]),t._v(" 时就知道了。")]),t._v(" "),v("h3",{attrs:{id:"_1-1-什么是变化侦测"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#_1-1-什么是变化侦测","aria-hidden":"true"}},[t._v("#")]),t._v(" 1.1 什么是变化侦测")]),t._v(" "),v("p",[t._v("简单来说，变化侦测，就是侦测数据的变化，当数据变化时，通知视图进行相应的更新。")]),t._v(" "),v("p",[t._v("通常来说，应用在运行时内部的状态会不断的变化，此时就需要不停的渲染，那 "),v("strong",[t._v("Vue")]),t._v(" 是如何确定状态中发生了什么变化的？它又是通过什么侦测变化的？")]),t._v(" "),v("p",[t._v("带着问题接着仔细往下看👇。")]),t._v(" "),v("h3",{attrs:{id:"_1-2-如何追踪变化"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#_1-2-如何追踪变化","aria-hidden":"true"}},[t._v("#")]),t._v(" 1.2 如何追踪变化")]),t._v(" "),v("p",[t._v("学前端的人都知道，在 Javascript 中，有两种方法可以侦测到一个对象的变化：")]),t._v(" "),v("ul",[v("li",[v("strong",[t._v("Object.defineProperty")])]),t._v(" "),v("li",[v("strong",[t._v("Proxy")])])]),t._v(" "),v("p",[t._v("由于 ES6 在浏览器中的支持并不理想，而 Proxy 又无法 polyfill，所以 Vue 2.x 采用了 "),v("code",[t._v("Object.defineProperty")]),t._v(" 方法来实现的变化侦测。")]),t._v(" "),v("blockquote",[v("p",[t._v("题外话：由于使用 "),v("strong",[t._v("Object.defineProperty")]),t._v(" 侦测变化存在较多的缺陷 ，所以尤在 Vue 3.x 版本使用了 Proxy 重写了以前的变化侦测。")])]),t._v(" "),v("p",[t._v("那么知道了 "),v("code",[t._v("Object.defineProperty")]),t._v(" 可以侦测对象的变化，那么我们就可以写出如下的代码：")]),t._v(" "),v("img",{attrs:{src:"/images/Vue变化侦测/defineProperty.png",width:"500"}}),t._v(" "),v("p",[t._v("我们封装 "),v("code",[t._v("Object.defineProperty")]),t._v("，通过使用 "),v("code",[t._v("defineReactive")]),t._v(" 函数，侦测一个对象属性的变化，每当从 "),v("code",[t._v("data")]),t._v(" 的 "),v("code",[t._v("key")]),t._v(" 中读取数据时，会触发 "),v("code",[t._v("getter")]),t._v("，每当为 "),v("code",[t._v("data")]),t._v(" 的 "),v("code",[t._v("key")]),t._v(" 赋值时，会触发 "),v("code",[t._v("setter")]),t._v("。")]),t._v(" "),v("h3",{attrs:{id:"_1-3-如何收集依赖"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#_1-3-如何收集依赖","aria-hidden":"true"}},[t._v("#")]),t._v(" 1.3 如何收集依赖")]),t._v(" "),v("p",[t._v("现在，我们已经能够侦测到状态的读写变化了。")]),t._v(" "),v("p",[t._v("接着思考一下，我们之所以要观察数据的变化，其实目的是为了在数据发生变化的时候，向使用了它的地方发送通知，让它更新。")]),t._v(" "),v("div",{staticClass:"language-vue extra-class"},[v("pre",{pre:!0,attrs:{class:"language-vue"}},[v("code",[v("span",{pre:!0,attrs:{class:"token tag"}},[v("span",{pre:!0,attrs:{class:"token tag"}},[v("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("template")]),v("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n    "),v("span",{pre:!0,attrs:{class:"token tag"}},[v("span",{pre:!0,attrs:{class:"token tag"}},[v("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("h1")]),v("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("{{ title }}"),v("span",{pre:!0,attrs:{class:"token tag"}},[v("span",{pre:!0,attrs:{class:"token tag"}},[v("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("h1")]),v("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n"),v("span",{pre:!0,attrs:{class:"token tag"}},[v("span",{pre:!0,attrs:{class:"token tag"}},[v("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("template")]),v("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n")])])]),v("p",[t._v("举一个例子，上面的模板中使用了 "),v("code",[t._v("title")]),t._v("，那么当它发生变化时，就要向使用了它的地方发送通知。在这里，我们将使用了 "),v("code",[t._v("title")]),t._v(" 的地方称之为 "),v("code",[t._v("title")]),t._v(" 的"),v("span",{staticClass:"important-font"},[t._v(" 依赖")]),t._v("。")]),t._v(" "),v("p",[v("span",{staticClass:"important-font"},[t._v("🎯所以，当状态发生变化时，我们为了通知依赖进行更新，就需要将依赖收集起来。")])]),t._v(" "),v("p",[t._v("而 "),v("code",[t._v("Object.defineProperty")]),t._v(" 真正有用的就是收集依赖，那么如何收集依赖？")]),t._v(" "),v("p",[t._v("这个问题，总结起来就一句话：🎯"),v("span",{staticClass:"important-font"},[t._v("在 getter 中收集依赖，在 setter 中触发依赖。")])]),t._v(" "),v("img",{attrs:{src:"/images/Vue变化侦测/dep1.png",width:"400"}}),t._v(" "),v("p",[v("span",{staticClass:"important-font"},[t._v("Vue 通过给状态绑定依赖，在状态变化时，通知该状态的每一个依赖进行更新操作。")])]),t._v(" "),v("ul",[v("li",[v("p",[t._v("在 "),v("strong",[t._v("React")]),t._v(" 中，当状态变化时，它不知道是哪个状态发生了变化，只知道状态变了，所以进行暴力对比来找出哪些 DOM 节点更新了，需要重新渲染。")])]),t._v(" "),v("li",[v("p",[t._v("而在 "),v("strong",[t._v("Vue")]),t._v(" 中，当状态变化时，"),v("strong",[t._v("Vue")]),t._v(" 立刻就知道了，并且在一定程度上知道是哪一个状态发生了变化，知道的信息更多，也就可以进行更细粒度的更新操作。")])])]),t._v(" "),v("p",[t._v("其中在 "),v("strong",[t._v("Vue 2.0")]),t._v(" 以前，依赖的细粒度为 DOM 节点，这使得依赖的数量非常多，使得内存也占用较多。")]),t._v(" "),v("p",[t._v("而在 "),v("strong",[t._v("Vue 2.0")]),t._v(" 之后，依赖的细粒度更改为了组件大小，大大降低的依赖数量，在状态变化时，通知到的具体的组件，在由组件内部使用虚拟 DOM 进行重新渲染。")]),t._v(" "),v("h3",{attrs:{id:"_1-4-依赖收集在哪里"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#_1-4-依赖收集在哪里","aria-hidden":"true"}},[t._v("#")]),t._v(" 1.4 依赖收集在哪里")]),t._v(" "),v("p",[t._v("现在我们有了明确的目标，就是收集依赖，那么依赖收集在哪呢？")]),t._v(" "),v("p",[t._v("思考一下，首先想到的就是每个状态都有一个数组，用来存储该状态的依赖，"),v("strong",[t._v("Vue")]),t._v(" 把依赖收集的代码封装成了 "),v("code",[t._v("Dep")]),t._v(" 类，专门用来管理依赖。")]),t._v(" "),v("img",{attrs:{src:"/images/Vue变化侦测/depend.png",width:"500"}}),t._v(" "),v("p",[t._v("修改了一下 "),v("code",[t._v("defineReactive")]),t._v(" 函数，新增一个 "),v("code",[t._v("Dep")]),t._v(" 类，我们使用这个类，在状态被读取（触发 getter）的时候收集依赖，在状态被修改（触发 setter）的时候通知依赖进行更新。")]),t._v(" "),v("p",[t._v("也就是上面说的，在 "),v("code",[t._v("getter")]),t._v(" 中收集依赖，在 "),v("code",[t._v("setter")]),t._v(" 中触发依赖。")]),t._v(" "),v("p",[t._v("顺便也回答了上面的问题，依赖收集到哪？收集到 "),v("code",[t._v("Dep")]),t._v(" 中。")]),t._v(" "),v("p",[v("code",[t._v("Dep")]),t._v(" 类的源码这里就我不整理出来了。")]),t._v(" "),v("h3",{attrs:{id:"_1-5-依赖是谁"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#_1-5-依赖是谁","aria-hidden":"true"}},[t._v("#")]),t._v(" 1.5 依赖是谁")]),t._v(" "),v("p",[t._v("依赖说来说去也整了半天，它到底是什么？我们要收集谁呢？")]),t._v(" "),v("p",[t._v("收集谁，换句话说，就是状态变化后，通知谁。")]),t._v(" "),v("p",[t._v("在状态更新时，我们需要通知使用到这个状态的地方，而这个地方有很多，有可能是模板，也有可能是 "),v("code",[t._v("watch")]),t._v("。")]),t._v(" "),v("p",[v("strong",[t._v("Vue")]),t._v(" 抽象出了一个依赖类，并且在依赖收集阶段只收集这个类的实例到 "),v("code",[t._v("Dep")]),t._v(" 中，那么这个抽象的东西需要一个名字，它叫什么？嗯，就叫"),v("code",[t._v("Watcher")]),t._v(" 吧（订阅者）。")]),t._v(" "),v("p",[v("code",[t._v("Watcher")]),t._v(" 的源码也不在这里整理出来了，相关源码涉及的有点多，后续再开另外一篇用来分析源码吧。Mark💾")]),t._v(" "),v("h3",{attrs:{id:"_1-6-递归侦测所有-key"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#_1-6-递归侦测所有-key","aria-hidden":"true"}},[t._v("#")]),t._v(" 1.6 递归侦测所有 key")]),t._v(" "),v("p",[t._v("在前面，我们知道了如何进行变化侦测，但是前面的代码只能侦测数据中的某一个属性，而我们希望把数据中的所有属性都侦测到。")]),t._v(" "),v("img",{attrs:{src:"/images/Vue变化侦测/observer2.png",width:"200"}}),t._v(" "),v("p",[v("strong",[t._v("Vue")]),t._v(" 封装了一个 "),v("code",[t._v("Observer")]),t._v(" 类（发布者），这个类的作用就是将一个对象内的所有属性都转换为 "),v("code",[t._v("getter/setter")]),t._v(" 的形式（都侦测一遍），追踪它们的变化。")]),t._v(" "),v("img",{attrs:{src:"/images/Vue变化侦测/observer1.png",width:"300"}}),t._v(" "),v("p",[t._v("当状态经过 "),v("code",[t._v("Observer")]),t._v(" 类转换过之后，当其中的属性发生变化，对应的依赖就会收到通知。")]),t._v(" "),v("p",[t._v("同样的 "),v("code",[t._v("Observer")]),t._v(" 类的源码不在这里整理出来了。")]),t._v(" "),v("blockquote",[v("p",[t._v("有两个名词，"),v("strong",[t._v("订阅者")]),t._v(" 和 "),v("strong",[t._v("发布者")]),t._v("，解释一下：Vue 的响应式原理是结合了 "),v("strong",[t._v("数据侦测")]),t._v(" 以及设计模式中的 "),v("strong",[t._v("订阅/发布者模式")]),t._v(" 实现的。")])]),t._v(" "),v("h3",{attrs:{id:"_1-7-关于-object-无法侦测的操作"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#_1-7-关于-object-无法侦测的操作","aria-hidden":"true"}},[t._v("#")]),t._v(" 1.7 关于 Object 无法侦测的操作")]),t._v(" "),v("p",[t._v("前面介绍的是 "),v("strong",[t._v("Object")]),t._v(" 类型数据的变化侦测原理，了解了数据变化是通过 "),v("code",[t._v("getter/setter")]),t._v(" 来追踪的。也正是因为这一追踪方式，有些语法对数据的操作 "),v("strong",[t._v("Vue")]),t._v(" 无法追踪到。")]),t._v(" "),v("p",[t._v("比如：")]),t._v(" "),v("ul",[v("li",[t._v("为一个对象新增本没有的属性。")])]),t._v(" "),v("img",{attrs:{src:"/images/Vue变化侦测/cantObserver1.png",width:"350"}}),t._v(" "),v("p",[t._v("和：")]),t._v(" "),v("ul",[v("li",[t._v("使用 "),v("code",[t._v("delete")]),t._v(" 关键字删除对象属性。")])]),t._v(" "),v("img",{attrs:{src:"/images/Vue变化侦测/cantObserver2.png",width:"350"}}),t._v(" "),v("p",[t._v("由于这两个操作无法触发 "),v("code",[t._v("getter/setter")]),t._v("，所以 "),v("strong",[t._v("Vue")]),t._v(" 不会向依赖发送通知，视图也就无法更新。")]),t._v(" "),v("p",[t._v("因为 "),v("code",[t._v("Object.defineProperty")]),t._v(" 只能追踪到一个数据是否被修改，无法追踪新增属性和删除属性，这也是没有办法的事情，这就是使用 "),v("code",[t._v("Object.defineProperty")]),t._v(" 实现变化侦测的缺陷之一。")]),t._v(" "),v("p",[t._v("为了解决这个问题 "),v("strong",[t._v("Vue")]),t._v(" 提供了两个 API，"),v("code",[t._v("vm.$set")]),t._v(" 和 "),v("code",[t._v("vm.$delete")]),t._v("，后续整理内容会有介绍。")]),t._v(" "),v("p",[t._v("To be Continue...")])])},[],!1,null,null,null);e.default=a.exports},75:function(t,e,v){}}]);