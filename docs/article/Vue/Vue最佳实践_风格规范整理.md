
## Vue 框架使用时需注意的风格规范及最佳实践

> 本篇整理自《深入浅出 Vue.js》

### 1. 给列表渲染设置属性 key

在列表渲染中，key 属性一共有两种作用。

#### 1.1 提高 patch 操作性能

key 的作用主要在 Vue 的虚拟 DOM 对比中，用来比较新旧虚拟节点，<span class="important-font">Vue 会优先比较虚拟节点的 TagName 和 key</span>。

所以，为渲染列表设置 key 属性可以一定程度上优化 patch 操作的性能。

```html
<div v-for="item in itemList" :key="item.id">
    <!-- ... -->
</div>
```

#### 1.2 视图与数据项的不同步
key 在列表渲染中的第二个作用就是，让列表的每一项都有一个唯一标识。

在数据项的顺序发生变化时，Vue 不会移动 DOM 元素来匹配数据项的顺序，而是采用 “就地复用”，在原先的 DOM 元素上进行修改，所以，Vue 只会更新视图中 DOM 所显示的值，而不同步变化这个 DOM 本身，这就会产生一些意料之外的问题。

### 2. 路由切换组件不变
在使用 Vue 的日常开发中，有一个比较经典的问题，就是当页面切换到同一个路由但不同参数的地址时，不会触发生命周期的钩子函数。

例如：
```js
const routes = [
    {
        path: '/detail/:id',
        name: 'detail',
        component: Detail
    }
]
```

这时，如果从 <b>/detail/1</b> 切换到 <b>/detail/2</b>，组件不会发生任何变化，也不会触发生命周期的钩子函数。
因为 <span class="important-font">vue-router</span>，识别出两个页面使用的是同一个组件而进行了复用，所以不会重新创建这个组件，生命周期钩子函数也就不会触发。

那么这个时候我们如何在页面切换之后请求接口获取数据呢？

#### 2.1 路由导航守卫
第一个办法是使用组件内的路由守卫 <span class="important-font">beforeRouteUpdate</span>，该守卫将在路由发生变化但组件被复用时触发，所以只需要将每次页面切换时的逻辑放在 <span class="important-font">beforeRouteUpdate</span> 即可，例如在该守卫触发时请求数据等等，比较推荐 👍。

#### 2.2 观察 $route 对象变化
使用 watch 可以监听到当前路由对象的变化，从而做出响应：
```js
const component = {
    template:'...',
    watch: {
        '$route' (to, from) {
            // 路由变化后的逻辑...
        }
    }
}
```
这个方式相较于使用路由导航守卫，多了一个 <span class="important-font">watch</span> ，会多一些依赖追踪带来的内存开销。

此外，如果要使用这个方法，推荐仅观察路由对象中 <span class="important-font">query</span> 的变化，而不是整个 <span class="important-font">$route</span>，例如：
```js
const component = {
    template:'...',
    watch: {
        '$route.query.id' (to, from) {
            // 路由变化后的逻辑...
        }
    }
}
```

#### 2.3 为 router-view 设置 key 属性
其本质是利用虚拟 DOM 在新旧节点对比时，通过 key 来对比两个节点是否相同的原理。
```html
<router-view :key="$route.fullPath"></router-view>
```
优点是简单暴力，仅一句代码就搞定了。
缺点是每次切换页面整个组件都会销毁再创建，浪费性能。

### 3. 区分 Vuex 和 props 的使用边界
通常在项目开发中：
+ 通用组件，通过 props 接收状态
+ 业务组件，通过 Vuex 接收状态

并且通用组件的 props，要尽可能的详尽，至少指定其类型，清晰的 props 可以让人很快搞懂它的用法，并且如果 props 的类型不正确，Vue 也会在控制台进行报错，减少 bug 的产生。

### 4. 为所有路由统一设置 query
如果有需要为所有路由设置 query 的需求，那么有两种解决办法：

#### 4.1 使用全局守卫 beforeEach
我们可以在全局守卫 <span class="important-font">beforeEach</span> 中，通过 next 函数控制下一个路由的跳转地址，那么我们就可以在跳转的时候在其中增加 query 参数，从而实现我们的需求，例如：
```js
const query = { name: 'kcy' }
router.beforeEach((to, from, next) => {
    to.query.name
    ? next()
    : next({...to, query: { ...to.query, ...query }})
})
```
优点是无需组件内在做处理，做了全局统一的处理，但是这个方法有个缺点，就是每次切换路由的时候，<span class="important-font">beforeEach</span> 都会执行两次。

#### 4.2 通过函数劫持
我们可以通过拦截 router.history.transitionTo 方法，在 vue-router 内部切换路由之前将参数添加到 query 中，使用方法如下：
```js
const query = { name:'kcy' }
const transitionTo = router.history.transitionTo
router.history.transitionTo = function (location, onComplate, onAbort) {
    location = typeof location === 'object'
        ? { ...location, query: { ...location.query, ...query }}
        : { path: location, query }
    transitionTo.call(router.history, location, onComplate, onAbort)
}
```

### 5. 避免 v-if 和 v-for 一起使用
在日常开发时，为了过滤渲染列表中不需要渲染的元素时，可能有人会这样做：
```html
<ul>
    <li v-for="user in users" v-if="shouldShowUser"></li>
</ul>
```
这是比较不好的做法，官网也给出了解释：
> 在 Vue 处理指令时，<span class="important-font">v-for</span> 拥有比 <span class="important-font">v-if</span> 更高的优先级，所以即便是只渲染一小部分的列表，也会在每次重新渲染时遍历整个列表，不会优先考虑 <span class="important-font">v-if</span> 是否满足。

解决方法是，将 <span class="important-font">users</span> 使用计算属性代替，在经过计算属性计算后，再使用 <span class="important-font">v-for</span> 进行列表的渲染，可以减少性能的消耗。
```html 
<ul>
    <li v-for="user in activeUsers"></li>
</ul>
```
```js
computed: {
    activeUsers () {
        return this.users.filter((user) => {
            return user.isActive
        })
    }
}
```

### 6. 为组件样式设置作用域
因为 CSS 规则都是全局的，为了避免组件间 CSS 样式相互污染，推荐使用<span class="important-font"> scopted </span>，或者 <span class="important-font"> CSS Modules</span> 来设置组件样式的作用域。

这两种方案都有对应覆盖组件库样式的语法，非常方便，此外，命名上推荐遵循 <span class="important-font"> BEM </span> 命名规则。

### 7. 避免隐性的父子组建通信 🎯
避免隐性的父子组建通信，这一点真的十分重要，因为我在合作开发的时候，也有过同事使用隐性的父子组件通信的情况，这样就会<span class="important-font"> 直接导致代码可读性下降 </span>，如果同时业务逻辑也十分复杂的话，这段代码可能会让人自闭......

### 8. 单文件组件的命名艺术
命名的不规范虽然不会影响代码的正常运行，但是良好的命名规范能在绝大多数情况下提高项目的可读性和开发体验。

#### 8.1 单文件组件名的大小写
单文件组件的文件名推荐始终使用 <span class="important-font"> 大驼峰</span>，或者始终使用横线连接。

```js
components/
|- MyComponent.vue
components/
|- my-component.vue
```

#### 8.2 基础组件名
使用特定样式和约定的基础组件，应该全部以一个特定的前缀开头，例如 Base，el，App。这些组件可以为应用奠定一致的基础样式和行为。它们可能只包括了：
+ HTML 元素
+ 其他基础组件
+ 第三方 UI 组件库
它们一定不会包括全局状态，例如 Vuex store。

因为这些组件会被频繁使用，所以可能会把它们放到全局，而不是在每个用到地方去引入。
```js
let requireComponent = require.context("./src", true, /^Base[A-Z]/)
requireComponent.keys().forEach((fileName) => {
    let baseComponentConfig = requireComponent(fileName)
    baseComponentConfig = baseComponentConfig.default || baseComponentConfig
    let baseComponentName = baseComponentConfig.name || (
        fileName
            .replace(/^.+\//, '')
            .replace(/\.\w+$/, '')
    )
})
Vue.component(baseComponentName, baseComponentConfig)
```
Bad：
```js
components/
|- MyButton.vue
|- VueTable.vue
|- elInput.vue
```
Good:
```js
components/
|- BaseButtn.vue
|- BaseTable.vue
|- BaseInput.vue
```

#### 8.3 单例组件名
只拥有单个活跃实例的组件，<span class="important-font">文件名以 The 开头</span>，表示其唯一性。单例组件不代表全局只有一个，而是每个页面只使用一次，这些组件永远不接受 props，因为它是为你的应用定制的，如果发现有必要添加 props，就表明这其实是一个可复用的组件，只是在每个页面里只用了一次。
```js
components/
|- TheHeader.vue
|- TheFooter.vue
|- TheSidebar.vue
```

#### 8.4 紧密耦合的组件名
如果和父组件紧密耦合的子组件应该以父组件名作为前缀命名。
好：
```js
components/
|- TodoList.vue
|- TodoListItem.vue
|- TodoListItemButton.vue
```

不好：
```js
components/
|- TodoList.vue
|- TodoItem.vue
|- TodoButton.vue
```

#### 8.5 组件名的单词顺序

不好：
```js
components/
|- ClearSearchButton.vue
|- LaunchOnStartCheckbox.vue
|- SearchInput.vue
```
上面的单词顺序将使得我们很难看出哪些组件时针对搜索的，现在根据规则重新命名：

好：
```js
components/
|- SearchButtonClear.vue
|- SearchInputQuery.vue
|- SearchInput.vue
```

完...

<style>
.typo h4 {
    font-size: 20px;
}
.important-font {
    color:#ec6611;
    font-weight:bold;
}
</style>