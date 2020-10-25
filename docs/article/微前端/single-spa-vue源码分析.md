## 微前端【一】single-spa-vue 源码分析

## 前置知识

+ 微前端基本概念
+ `single-spa` 基础用法、应用加载流程
+ `single-spa-vue` 基础用法

## 什么是 single-spa-vue

由于三大框架的加载、卸载方式各不相同，为了让 `single-spa` 可以简单方便的控制子应用生命周期，作者通过 `single-spa-react`、`single-spa-angular` 以及 `single-spa-vue` 这三个库分别为三大框架的应用做了一层处理，实现了无论子应用使用哪种框架，最终暴露出的控制生命周期的方法都会适配成 `single-spa` 需要的样子。

一共会暴露出四个生命周期控制方法，分别是：`bootstrap`、`mount`、`unmount` 以及 `update`。

`single-spa` 也是通过这四个方法来控制子应用的生命周期的。

## single-spa-vue 源码

`single-spa-vue` 的源码非常少，只有 200 行不到，因为它也不需要实现什么额外功能，只需要暴露出四个控制生命周期函数即可。

首先看主函数：

```js
/** 用法
const vueLifecycles = singleSpaVue({
  Vue,
  appOptions: {
    store,
    router,
    render: (h) => h(Index),
    el: '#root-container'
  }
})

export const bootstrap = vueLifecycles.bootstrap
export const mount = vueLifecycles.mount
export const update = vueLifecycles.update
export const unmount = vueLifecycles.unmount
**/

const defaultOpts = {
  // router、store、render、el
  appOptions: null,
  // 暂时没发现用处，官方文档上没有说明用法
  template: null,

  // Vue2 的引用
  Vue: null,
  // Vue3 的 createApp 方法
  createApp: null,
  // 可用于对 Vue 实例做一些操作，例如 Vue.use(...)
  handleInstance: null,
};

export default function singleSpaVue(userOpts) {
  // 健壮性代码
  if (typeof userOpts !== "object") {
    throw new Error(`single-spa-vue requires a configuration object`);
  }

  // 合并默认参数及入参
  const opts = {
    ...defaultOpts,
    ...userOpts,
  };

  // Vue2.x 接收 Vue 的引用，Vue3.x 接收 Vue3 的 createApp 方法
  if (!opts.Vue && !opts.createApp) {
    throw Error("single-spa-vue must be passed opts.Vue or opts.createApp");
  }

  // 健壮性代码
  if (!opts.appOptions) {
    throw Error("single-spa-vue must be passed opts.appOptions");
  }

  // 若 el 存在，并且不为 string 类型，则必须是一个 HTML 元素
  if (
    opts.appOptions.el &&
    typeof opts.appOptions.el !== "string" &&
    !(opts.appOptions.el instanceof HTMLElement)
  ) {
    throw Error(
      `single-spa-vue: appOptions.el must be a string CSS selector, an HTMLElement, or not provided at all. Was given ${typeof opts
        .appOptions.el}`
    );
  }

  // 兜底
  opts.createApp = opts.createApp || (opts.Vue && opts.Vue.createApp);

  // 通过引用类型的特点，共享挂载后的 Vue 实例，官方注释 ↓：
  // Just a shared object to store the mounted object state
  // key - name of single-spa app, since it is unique
  let mountedInstances = {};

  // 返回的四个生命周期函数
  return {
    bootstrap: bootstrap.bind(null, opts, mountedInstances),
    mount: mount.bind(null, opts, mountedInstances),
    unmount: unmount.bind(null, opts, mountedInstances),
    update: update.bind(null, opts, mountedInstances),
  };
}

// bootstrap 方法，用户提供 loadRootComponent 方法，猜测是用来在 bootstrap 阶段提前加载后续需要渲染的组件的资源
function bootstrap(opts) {
  if (opts.loadRootComponent) {
    return opts.loadRootComponent().then((root) => (opts.rootComponent = root));
  } else {
    return Promise.resolve();
  }
}

// mount 方法，调用后可以挂载应用
function mount(opts, mountedInstances, props) {
  const instance = {};
  return Promise.resolve().then(() => {
    const appOptions = { ...opts.appOptions };

    // 挂载到的 DOM 容器，或它的选择器
    if (props.domElement && !appOptions.el) {
      appOptions.el = props.domElement;
    }

    // 获取到 DOM 容器
    let domEl;
    if (appOptions.el) {
      if (typeof appOptions.el === "string") {
        domEl = document.querySelector(appOptions.el);
        if (!domEl) {
          throw Error(
            `If appOptions.el is provided to single-spa-vue, the dom element must exist in the dom. Was provided as ${appOptions.el}`
          );
        }
      } else {
        domEl = appOptions.el;
        if (!domEl.id) {
          domEl.id = `single-spa-application:${props.name}`;
        }
        appOptions.el = `#${CSS.escape(domEl.id)}`;
      }
    } else {
      // 不存在指定的容器或选择器，则生成一个默认名称的 DOM 容器
      const htmlId = `single-spa-application:${props.name}`;
      appOptions.el = `#${CSS.escape(htmlId)}`;
      domEl = document.getElementById(htmlId);
      if (!domEl) {
        domEl = document.createElement("div");
        domEl.id = htmlId;
        document.body.appendChild(domEl);
      }
    }

    appOptions.el = appOptions.el + " .single-spa-container";
    
    // 在之前的 DOM 容器下新增一个 div，这个 div 才是组件最终要挂载的位置，官方注释 ↓：
    // single-spa-vue@>=2 always REPLACES the `el` instead of appending to it.
    // We want domEl to stick around and not be replaced. So we tell Vue to mount
    // into a container div inside of the main domEl
    if (!domEl.querySelector(".single-spa-container")) {
      const singleSpaContainer = document.createElement("div");
      singleSpaContainer.className = "single-spa-container";
      domEl.appendChild(singleSpaContainer);
    }

    instance.domEl = domEl;

    // 没有传入 render 和 template 时
    // 就将 bootstrap 阶段 用户提供的 loadRootComponent 这一 Promise 返回的组件作为挂载的内容
    if (!appOptions.render && !appOptions.template && opts.rootComponent) {
      appOptions.render = (h) => h(opts.rootComponent);
    }

    // 初始化 data
    if (!appOptions.data) {
      appOptions.data = {};
    }

    appOptions.data = () => ({ ...appOptions.data, ...props });

    // Vue3.x 的挂载方式
    if (opts.createApp) {
      instance.vueInstance = opts.createApp(appOptions);
      // 提供给用户操作实例的机会
      if (opts.handleInstance) {
        opts.handleInstance(instance.vueInstance);
      }
      instance.vueInstance.mount(appOptions.el);
    } else {
      // Vue2.x 的挂载方式
      instance.vueInstance = new opts.Vue(appOptions);
      if (instance.vueInstance.bind) {
        instance.vueInstance = instance.vueInstance.bind(instance.vueInstance);
      }
      if (opts.handleInstance) {
        opts.handleInstance(instance.vueInstance);
      }
    }

    // 共享 Vue 实例
    mountedInstances[props.name] = instance;

    // 返回 Vue 实例
    return instance.vueInstance;
  });
}

// update 方法，更新子应用的属性
function update(opts, mountedInstances, props) {
  return Promise.resolve().then(() => {
    // 获取到当前应用的实例
    const instance = mountedInstances[props.name];
    const data = {
      ...(opts.appOptions.data || {}),
      ...props,
    };
    // 更新实例上的属性
    for (let prop in data) {
      instance.vueInstance[prop] = data[prop];
    }
  });
}

// unmount 方法，调用后卸载当前应用
function unmount(opts, mountedInstances, props) {
  return Promise.resolve().then(() => {
    // 获取到当前应用的实例
    const instance = mountedInstances[props.name];
    
    // Vue3.x 卸载方法
    if (opts.createApp) {
      instance.vueInstance.unmount(instance.domEl);
    } else {
      // Vue2.x 卸载方法
      instance.vueInstance.$destroy();
      instance.vueInstance.$el.innerHTML = "";
    }
    
    // 删除实例
    delete instance.vueInstance;

    // 清空 DOM 容器中的内容
    if (instance.domEl) {
      instance.domEl.innerHTML = "";
      delete instance.domEl;
    }
  });
}
```

到这里 `single-spa-vue` 的源码就结束了，很少也很简单，总结如下：

+ 通过 `single-spa-vue` 暴露出子应用的四个生命周期方法提供给 `single-spa` 使用
+ `bootstrap` 方法，子应用挂载前可以做一些资源预加载、懒加载
+ `mount` 方法，挂载子应用
+ `update` 方法，更新子应用的属性
+ `unmount` 方法，卸载子应用

下一篇重头戏，`single-spa` 源码分析。