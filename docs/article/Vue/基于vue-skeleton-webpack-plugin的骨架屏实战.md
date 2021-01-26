# 基于 vue-skeleton-webpack-plugin 的骨架屏实战

## 前言

最近在实习，手头上的项目用到了骨架屏，回顾梳理一下。

目前正在做的项目，登录是需要跳转到别人的页面的，导致重定向很多，需要优化一下白屏时间，所以就用到了骨架屏，但是这次用的骨架屏不是自动生成的，还是自己敲的样式，一步步来吧，先从简单的用起🤝。

先上效果图：

![](/images/vue-skeleton-webpack-plugin骨架屏实战/skeleton-performance2.gif)

## 什么是骨架屏
<b>骨架屏</b>，英文 Skeleton screen，是指在页面开始渲染之前的白屏时间内，先让用户看到即将要展现页面的“骨架”，页面渲染完成之后再将它替换掉，起到一个从<span class="important-font"> 白屏 → 渲染完成 </span>过程中的过渡作用，它可以有效减少用户的感知时间，让用户“感觉上”认为打开页面比较快（相比较于完整的白屏时间）。

## 实现
本文主要围绕一个开源的 Webpack 插件 [vue-skeleton-webpack-plugin](https://github.com/lavas-project/vue-skeleton-webpack-plugin)，来实现在 Vue 项目中加入骨架屏。
> 由于项目对骨架屏的需求不同，相应的代码也会不一样。
> 本文所实现的骨架屏是<span class="important-font"> 基于 Vue-cli 3.x 搭建的项目 </span>，根据的不同路由，显示不同的骨架屏，如需其他用法详见开源插件。

让我们开始吧🏄。

首先是安装插件：
```shell
npm install vue-skeleton-webpack-plugin
```

### vue.config.js
安装完成后在 vue.config.js 中做如下配置：
```js
const SkeletonWebpackPlugin = require('vue-skeleton-webpack-plugin')
module.exports = {
    configureWebpack: (config) => {
        config.plugins.push(new SkeletonWebpackPlugin({
            webpackConfig: {
                entry: {
                    app: path.join(__dirname, './src/skeleton/skeleton.js')
                }
            },
            // SPA 下是压缩注入 HTML 的 JS 代码
            minimize: true,
            // 服务端渲染时是否需要输出信息到控制台
            quiet: true,
            // 根据路由显示骨架屏
            router: {
                    mode: 'history',
                    routes: [
                        {
                            path: '/',
                            skeletonId: 'skeleton-home'
                        },
                        {
                            path: '/message',
                            skeletonId: 'skeleton-message'
                        }
                    ]
            }
        }
    },
    css: {
        // 使用 css 分离插件 mini-css-extract-plugin，不然骨架屏组件里的 <style> 不起作用，
        extract: true,
    }
}
```
其中<span class="important-font"> skeleton.js </span>是我们骨架屏的入口，我们过会再创建。先看来一下其中 router 这个配置项。

<span class="important-font">router </span>的配置决定了我们各个路由路径所对应的骨架屏。
+ router.mode 填路由模式，两个值可选 history | hash.
+ router.routes 填路由数组，其中<span class="important-font"> path </span>对应着页面在<span class="important-font"> vue-router </span>中的<span class="important-font"> path</span>，<span class="important-font">skeletonId </span>是骨架屏的<span class="important-font"> id</span>，后面马上会说明。

### skeleton.js
配置完成后，新建一个骨架屏的入口 skeleton.js。
```js
// src/skeleton/skeleton.js
import Vue from 'vue'

// 引入的骨架屏组件
import skeletonHome from './skeleton/skeletonHome.vue'
import skeletonMessage from './skeleton/skeletonMessage.vue'

export default new Vue({
    components: {
        skeletonHome,
        skeletonMessage,
    },
    template: `
        <div>
            <skeletonHome id="skeleton-home" style="display:none"/>
            <skeletonMessage id="skeleton-message" style="display:none"/>
        </div>
    `
})
```
上面的代码中，引入的两个组件分别对应<span class="important-font"> 首页（Home）</span>和<span class="important-font"> 消息页（Message）</span>的骨架屏，其中组件的<span class="important-font"> id </span>对应之前在<span class="important-font"> vue.config.js </span>里的<span class="important-font"> skeletonId </span>。

贴上其中一个骨架屏组件的代码：
```vue
// skeletonMessage.vue
<template>
    <div class="skeleton-block">
      <div class="sk-loanList-header-bg"></div>
      <s-messageItem/>
      <s-messageItem/>
      <s-messageItem/>
      <s-messageItem/>
    </div>
</template>

<script>
import messageItem from './components/s-messageListItem'
export default {
    name: 'skeletonMessage',
    components: {
        's-messageItem': messageItem
    }
}
</script>

<style scoped>
.skeleton-block {
    width:100%;
    height: 100vh;
}
.sk-loanList-header-bg {
    height:88px;
    background:#2954D0;
}
</style>
```

其实就是很普通的一个 Vue 组件，在组件里写自己想要的骨架屏的样式即可，可复用的地方还可以再分成组件。
在路由里加上 skeletonMessage ，看一下效果：

![](/images/vue-skeleton-webpack-plugin骨架屏实战/skeleton.png)

至此，现在骨架屏已经准备就绪了，是不是很简单🤨。

### 效果展示

这边模拟一下移动端访问环境，先进入 Chrome DevTools 中的 Performance 进行设置。

![](/images/vue-skeleton-webpack-plugin骨架屏实战/skeleton-performance1.gif)

运行 Performance：

![](/images/vue-skeleton-webpack-plugin骨架屏实战/skeleton-performance2.png)

效果：

![](/images/vue-skeleton-webpack-plugin骨架屏实战/skeleton-performance2.gif)

从骨架屏替换成页面的过程中还是有闪一下的，目前还不知道这个是否可以优化，尝试中。

查看一下 Performance 中不同页面展现的时间：

![](/images/vue-skeleton-webpack-plugin骨架屏实战/skeleton-performance4.png)
![](/images/vue-skeleton-webpack-plugin骨架屏实战/skeleton-performance5.png)

（ps：解释一下，我也不知道什么情况，运行完之后就是尼🐴这么糊...）

可以看到在通过本地运行访问的情况下（本地访问较快），在进入页面后 221ms 页面先展示骨架屏，随后在 738ms 时完成页面的渲染。

这里如果不加骨架屏的话就是 738ms 的白屏时间，我们已经通过骨架屏优化了一些白屏时间🏄。

## 最后

[vue-skeleton-webpack-plugin](https://github.com/lavas-project/vue-skeleton-webpack-plugin) 是较为初级的骨架屏方案，相信大家也可以马上想到许多缺点。

比如：
+ 需要手动去写骨架屏的样式。
+ 骨架屏样式在不同尺寸下的响应式问题。
+ 在界面改动之后也需要手动修改对应的骨架屏。

由于在本人的项目中使用到了<span class="important-font"> postcss-px2rem </span> 自动 px 转 rem，所以避开了一些缺点。

## 其他方法

此外还有许多使用骨架屏的方法：
+ [page-skeleton-webpack-plugin](https://github.com/ElemeFE/page-skeleton-webpack-plugin) 饿了么开源的自动生成骨架屏生成插件。
+ 用 base64 的图片做骨架屏，就让 UI 在出设计稿的时候顺便把骨架屏也给画了😂。

> 参考：
> https://juejin.im/post/5b79a2786fb9a01a18267362#comment


<style>
.important-font {
    color:#ec6611;
    font-weight:bold;
}
</style>