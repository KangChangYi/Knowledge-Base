# computed 和 watch 的区别

<a name="rY7Ly"></a>

## 用法上的区别

<a name="XrylV"></a>

### computed

从用法上来说， `computed`  的应用场景是对各种数据进行操作和运算，最终返回我们需要的值，这个计算过程可能会用到 `N 个数据` ，当其中某个数据发生变化时， `computed`  也会返回数据变化后的正确值，举个例子：<br />
<br />使用 `computed`  来计算 `Button`  按钮的样式。

```javascript
  computed: {
    btnClass () {
      return [
        'base-btn',
        this.type ? `base-btn--${this.type}` : '',
        this.disabled ? 'base-btn--disabled' : '',
        this.disabled && !this.disabledStillReact ? 'base-btn--eventsNone' : ''
      ]
    }
  }
```

除此之外，在某些特殊场景中可能会使用 `computed`  进行一些耗时的运算，为了避免每次使用 `computed`  都需要重新计算造成的性能问题， `Vue`  为 `computed`  设计了【懒求值】的机制，文章后续讲解。

<a name="h7NEE"></a>

### watch

和 `computed`  不同的是， `watch`  选项用于监听某个（些）数据的变化，当数据发送变化后，它会执行我们准备好的回调函数，我们就可以在回调函数中第一时间收到响应从而执行对应的逻辑，举个例子：<br />
<br />使用 `watch`  监听 `searchText` （用户输入的搜索内容），当 `searchText`  发生变化时，重新根据搜索内容来搜索产品。

```javascript
  watch: {
      searchText (newVal, oldVal) {
        this.searchProduct(newVal)
      }
  }
```

<br />`watch`  还有另外一种不同的写法，这样的写法可以给 `watch`  传入特定的选项，从而改变 `watch`  的行为， `deep: true`  表示对对象进行深度监听，其属性发生变化，也会触发回调函数。

```javascript
  watch: {
    	someObj: {
      	handler: (newVal, oldVal) {
        	//...
        },
				deep: true
      }
  }
```

<a name="hPj2m"></a>

### 区别汇总

- `computed`  用于对数据进行运算，返回运算后的结果，而 `watch`  用于监听数据变化，触发对应的回调函数。
- `computed`  有懒求值机制，而 `watch`  可以深度监听对象变化触发回调
- `computed`  可以作为一个值用在模板或其他选项中，但 `watch`  不行。

<a name="7tksQ"></a>

## 原理上的区别

<a name="8x93T"></a>

### computed 的懒求值机制

上文提到，Vue 为了避免重复对 `computed`  求值造成性能问题，为 `computed`  设计了【懒求值】机制。<br />
<br />从源码中可以发现， `computed`  本身也是使用了 `Watcher`  类来做到响应式，因为 `Watcher`  类就是 `Vue`  专门抽离出来用于做响应式的， `Vue`  中所有的依赖几乎都是 `Watcher`  实例，回到正题，由 `computed`  选项创建的 `Watcher`  实例会传入一个特别的选项，叫做 `lazy: true` ：

```javascript
// src/core/instance/state.js
const computedWatcherOptions = { lazy: true };

function initComputed(vm: Component, computed: Object) {
  //...
  const watchers = (vm._computedWatchers = Object.create(null));
  // computed properties are just getters during SSR
  const isSSR = isServerRendering();

  if (!isSSR) {
    // create internal watcher for the computed property.
    watchers[key] = new Watcher(
      vm,
      getter || noop,
      noop,
      // 在这里传入了一个特殊的选项
      computedWatcherOptions
    );
  }
  //...
}
```

而 `Watcher`  内部会接收这个 `lazy` ，将其赋值给内部的 `dirty`  属性。<br />
<br />残疾版 `Watcher` ，关注重点 `lazy、dirty`  属性：

```javascript
export default class Watcher {
  constructor (..., options, ...) {
  	if (options) {
      this.lazy = !!options.lazy
    }
    this.dirty = this.lazy // for lazy watchers
  }
}
```

看到这里，也不知道 `dirty`  的作用是什么，不过答案马上揭晓。<br />
<br />刚 `initComputed`  函数看了一半，代码不贴出来了，只需要知道后续调用了 `createComputedGetter`  对 `computed`  进行了求值，可以看到首先判断 `watcher`  是否存在，然后再判断 `watcher.dirty`  属性是否是 `true` ， `dirty`  即代表脏数据的意思，当 `computed`  的 `Wacher`  实例被创建后， `dirty`  默认是 `true` ，因为还没有进行求值，所以这里会触发 `wacher.evaluate`  方法，

```javascript
function createComputedGetter(key) {
  return function computedGetter() {
    const watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.target) {
        watcher.depend();
      }
      return watcher.value;
    }
  };
}
```

`wacher.evaluate`  方法代码如下，内部调用了 `wacher.get`  方法， `get`  方法中会对 `computed`  的回调函数进行求值，并返回结果，求值的结果就被添加到了 `watcher.value`  上面，最后把 `dirty`  变为 `false` ，表示求值已经完成，目前是最新值。

```javascript
export default class Watcher {
  constructor (..., options, ...) {
  	if (options) {
      this.lazy = !!options.lazy
    }
    this.dirty = this.lazy // for lazy watchers
  }

  get() {
  	// 这里调用回调函数进行求值
  }

  evaluate () {
    this.value = this.get()
    this.dirty = false
  }

  update () {
    if (this.lazy) {
      this.dirty = true
    } //...
  }
}
```

当 `dirty`  为 `false`  后，使用 `computed`  时将不会重新调用 `computed`  回调函数进行求值，而是直接返回 `watcher.value` ，代码可以查看上面的 `createComputedGetter`  函数。

那么问题来了，什么时候才会重新求值呢？答案就是当 `computed`  中所使用的数据发生变化时。

在上面对 `computed`  回调函数进行求值的时候，会触发所有回调函数中所使用的数据的 `getter` ，在这个时候，这些数据就已经将 `computed`  的 `Watcher`  实例添加到了自己依赖中。当数据发生变化时， `computed`  的 `Watcher`  实例就会被执行 `update`  方法， `update`  方法代码如上。这里为了聚焦关注点，删除了一些和本文无关的代码。可以看到在 `update`  方法中进行了判断，当 `lazy`  为 `true`  时，则重新将 `dirty`  变为 `true` 。

简单理解就是说，在数据发生变化的时候，如果该 `Watcher`  由 `computed`  创建，则重新将 `dirty`  变为 `true` ，意味着 `computed`  需要重新求值，因为 `computed` 中使用的数据发生了变化，当前的值已经“脏”了，下次再次使用 `computed`  时， `createComputedGetter`  所返回的 `computedGetter`  就会重新执行，这一次就和初始化时一样，会对 `computed`  的回调函数重新求值了。<br />
<br />以上就是 `computed`  的 【懒求值】机制的原理。<br />

<a name="t9U3q"></a>

### watch 的 deep 原理

`watch`  除了监听数据本身以外，还提供了 `deep`  选项，当设置 `deep`  为 `true`  时，可以深度递归监听对象中所有属性的变化，当这些属性发生变化时，均会触发回调函数。

```javascript
  watch: {
    	someObj: {
      	handler: (newVal, oldVal) {
        	//...
        },
				deep: true
      }
  }
```

直接来看原理：<br />
<br />首先在初始化的时候，会遍历用户填写的所有 `watch`  选项，每个 `watch`  选项都会通过 `createWatcher`  函数进行初始化，如果 `watch`  选项中存在相同键名，则会在 `mergeOptions`  阶段被处理成数组，仍然是调用 `createWatcher`  函数。

在 `createWatcher`  函数中进行了判断，将回调函数正确的赋值给 `handler` ，然后使用 实例上的 `$watch`  方法创建 `Watcher`  实例。<br />
<br />如果用户为 `watch`  设置了 `deep`  选项，将会放在第四个参数 `options`  中传入 `Watcher`  类的构造函数。

```javascript
function initWatch(vm: Component, watch: Object) {
  for (const key in watch) {
    const handler = watch[key];
    if (Array.isArray(handler)) {
      for (let i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher(
  vm: Component,
  expOrFn: string | Function,
  handler: any,
  options?: Object
) {
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === "string") {
    handler = vm[handler];
  }
  return vm.$watch(expOrFn, handler, options);
}

Vue.prototype.$watch = function(expOrFn, cb, options) {
  var vm = this;
  if (isPlainObject(cb)) {
    return createWatcher(vm, expOrFn, cb, options);
  }
  options = options || {};
  options.user = true;
  var watcher = new Watcher(vm, expOrFn, cb, options);
  if (options.immediate) {
    try {
      cb.call(vm, watcher.value);
    } catch (error) {
      handleError(
        error,
        vm,
        'callback for immediate watcher "' + watcher.expression + '"'
      );
    }
  }
  return function unwatchFn() {
    watcher.teardown();
  };
};
```

下面是残疾版 `Watcher`  类，重点关注 `deep` 。<br />
<br />`Watcher`  实例在创建的时候，会立即触发 `get`  方法， `get`  方法内部通过 `this.getter.call()`  方法获取数据，进一步触发数据的 `getter` ，从而依赖收集实现了非深度的监听，再来看如何实现深度监听。<br />
<br />在 `get`  方法中，有一个判断 `deep`  属性的 `if 语句` ，内部调用了 `traverse`  函数，并且传入当前的值 `value` ，这里的 `value`  就是我们 `watch`  选项监听的对象。

```javascript
export default class Watcher {
  constructor (..., options, ...) {
  	if (options) {
      this.deep = !!options.deep
    }

    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      this.getter = parsePath(expOrFn)
      if (!this.getter) {
        this.getter = noop
      }
    }

    this.value = this.lazy
      ? undefined
      : this.get()
  }

  get () {
    pushTarget(this)
    let value
    const vm = this.vm
    try {
      value = this.getter.call(vm, vm)
    } catch (e) {
      // ...
    } finally {
      // "touch" every property so they are all tracked as
      // dependencies for deep watching
      if (this.deep) {
        traverse(value)
      }
      popTarget()
      this.cleanupDeps()
    }
    return value
  }
}
```

`traverse`  函数如下，直接一句话总结所做的事情：<br />
<br />在 `traverse`  函数中递归遍历了 `watch`  监听的对象的所有属性，在这个过程中会对属性值进行读取，从而触发了属性的 `getter` ，由于在 `traverse`  函数是在 `pushTarget`  和 `popTarget`  函数范围内执行的，所以对象子属性的 `getter`  可以正确的收集到当前的 `Watcher`  实例，从而在对象子属性发生变化的时候，可以通知到该 `Watcher`  实例，在 `run`  方法中触发回调函数。

```javascript
export function traverse(val: any) {
  _traverse(val, seenObjects);
  seenObjects.clear();
}

function _traverse(val: any, seen: SimpleSet) {
  let i, keys;
  const isA = Array.isArray(val);
  if (
    (!isA && !isObject(val)) ||
    Object.isFrozen(val) ||
    val instanceof VNode
  ) {
    return;
  }
  if (val.__ob__) {
    const depId = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return;
    }
    seen.add(depId);
  }
  if (isA) {
    i = val.length;
    while (i--) _traverse(val[i], seen);
  } else {
    keys = Object.keys(val);
    i = keys.length;
    while (i--) _traverse(val[keys[i]], seen);
  }
}
```

以上就是 `watch`  的 `deep`  选项实现深度的监听的原理。
