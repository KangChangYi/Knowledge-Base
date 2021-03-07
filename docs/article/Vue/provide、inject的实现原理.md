# provide、inject 的实现原理

<a name="FSLkp"></a>

## 介绍

`provide` 、 `inject`  这两个选项组合是 `Vue`  提供的一种组件间的通信方法，可以实现从上到下的数据传递。

通过使用 `provide` ，可以将当前的设置的 `provide`  选项，提供给任意一代的子组件使用（子组件内部通过 `inject`  引入），若当前组件的上级组件中不存在 `inject`  对应的 `provide`  选项，则会使用用户配置的 `default`  值，简单用法如下：

```javascript
// 父级组件提供 'foo'
var Provider = {
  provide: {
    foo: 'bar'
  },
  // ...
}

// 子组件注入 'foo'
var Child = {
  inject: {
    foo: { default: 'foo' }
  }
  created () {
    console.log(this.foo) // => "bar"
  }
  // ...
}
```

<a name="eadQ2"></a>

## 原理

知道了用法，再来看一下 `Vue`  是如何实现跨多个层级从上到下的数据传递的呢？<br />
<br />初始化 `inject`  选项的工作由 `initInjections`  函数完成， `initInjections`  函数被调用于初始化阶段，当 `beforeCreate`  生命周期钩子调用结束之后， `Vue`  就会开始初始化组件的状态，以便在 `created`  生命钩子函数调用时可以获取到组件的各种状态，而 `initInjections`  函数就是 `beforeCreate`  之后第一个被调用的。<br />
<br />`initInjections`  函数第一句代码就调用了 `resolveInject`  来获取 `inject`  数据，现在进入 `resolveInject`  函数看一下。

```javascript
// init() -> initInjections()

export function initInjections(vm: Component) {
  const result = resolveInject(vm.$options.inject, vm);
  if (result) {
    toggleObserving(false);
    Object.keys(result).forEach((key) => {
      defineReactive(vm, key, result[key]);
    });
    toggleObserving(true);
  }
}
```

<br />

在 `resolveInject` 函数中首先初始化了一个 `result 对象` ，它也是最终的返回结果，可以猜到里面存放的就是我们最终需要的 `inject`  选项的数据。

在**第 7 行**通过 `Reflect.ownKeys`  或 `Object.keys`  API 来获取当前组件中的 `inject`  选项，然后进入一个 `for 循环` ，如果组件没有设置 `inject`  选项，则 `keys.length === 0` ，不会进入 `for 循环` ， 既然没有 `inject` ，那这个函数的任务理所当然的也就结束了。再来看如果存在的情况下，用 `key`  保存着 `inject`  选项的某一个键，如果发现是键名 `__ob__` \_ _ 则直接跳过，因为 `__ob__` _ \_  是 `Vue`  的 `Observer`  实例，并不会是 `inject`  的键，不过可能会有人把它作为 `inject`  的键，这里通过这样的方式避免掉了，因为有人提了 `issue` ，详见 `issue #6574` 。

**第 15 行**，在 `inject`  选项中通过键名去获取对应值的 `from`  属性，但是我们并没有给 `inject`  设置 `from`  属性，为什么要从 `from`  获取？原因是因为 `Vue`  给用户提供了 `inject`  的多种写法，方便了用户但并没有方便它自己，所以在初始化最开始时，会有一个 `mergeOptions`  操作，里面将所有的选项进行了规范化，把选项都变成了统一的数据结构，这样在后续的处理中就比较方便了，而 `inject`  则被处理成了 `{ from: 'key', default: 'defaultVal' }`  这样的格式。

**第 17 行 ~ 第 23 行**开始以当前组件实例 `vm`  为起点开始了 `while`  循环，当 `vm`  中存在 `_provided`  属性（组件实例的 `_provided`  属性中存放的就是组件的 `provide`  选项），并且该属性上存在目前正要找的 `inject`  键的时候，就在 `result`  对应键中进行赋值，否则将 `vm`  指向父组件重新开始判断，其实看到这里， `provide`  和 `inject`  的实现方法已经比较清晰了，其实就是拿着当前配置的 `inject`  键名向上级组件去查找。

再来看**第 24 行** `while`  循环外面，如果到最后 `source`  都变成了 `null` （根组件的 `$parent`  是 `null` ），则给 `inject`  采用配置好的默认值。

```javascript
// init() -> initInjections() -> resolveInject()

export function resolveInject(inject: any, vm: Component): ?Object {
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached
    const result = Object.create(null);
    const keys = hasSymbol ? Reflect.ownKeys(inject) : Object.keys(inject);

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      // #6574 in case the inject object is observed...
      if (key === "__ob__") continue;
      const provideKey = inject[key].from;
      let source = vm;
      while (source) {
        if (source._provided && hasOwn(source._provided, provideKey)) {
          result[key] = source._provided[provideKey];
          break;
        }
        source = source.$parent;
      }
      if (!source) {
        if ("default" in inject[key]) {
          const provideDefault = inject[key].default;
          result[key] =
            typeof provideDefault === "function"
              ? provideDefault.call(vm)
              : provideDefault;
        } else if (process.env.NODE_ENV !== "production") {
          warn(`Injection "${key}" not found`, vm);
        }
      }
    }
    return result;
  }
}
```

看完以上流程，通过 `provide`  和 `inject`  实现从上到下的数据传递原理已经清楚了，最后总结成一句话来概括：

- **在初始化阶段， `Vue`  会遍历当前组件 `inject`  选项中的所有键名，拿这个键名在上级组件中的 `_provided`  属性里面进行查找，如果找到了就使用对应的值，如果找不到则再向上一级查找，直到查找完根组件为止，最终如果没有找到则使用默认值，通过这样层层向上查找的方式最终实现 `provide`  和 `inject`  的数据传递机制。**

这里没有讲到 `provide`  的初始化，因为比较简单，就是将 `provide`  选项挂载在了 `_provided`  属性上。

以上就是 `provide`  和 `inject`  的实现原理。
