# 弥补 defineProperty 缺陷的 $set、$delete

<a name="qqz0n"></a>

## 问题

`Vue`  侦测数据变化所使用的 `Object.defineProperty` `API`   本身无法拦截到对象的新增属性和删除属性操作：<br />

- 在对象上新增原本没有的属性

![cantObserver1.png](https://cdn.nlark.com/yuque/0/2021/png/277290/1615099926964-d2540882-6a29-4f20-8381-4e71b39d5714.png#align=left&display=inline&height=314&margin=%5Bobject%20Object%5D&name=cantObserver1.png&originHeight=517&originWidth=658&size=36352&status=done&style=none&width=400)

- 使用 delete 操作符删除对象上原本存在的属性

![cantObserver2.png](https://cdn.nlark.com/yuque/0/2021/png/277290/1615099925418-df172f3d-d286-4ae1-ad5a-7aacb9e783b7.png#align=left&display=inline&height=369&margin=%5Bobject%20Object%5D&name=cantObserver2.png&originHeight=571&originWidth=619&size=41516&status=done&style=none&width=400)<br />`API`  本身并未支持这两种操作，但是在业务中我们确确实实有这样的需求，需要监听这两种操作，并对此做出响应。为了解决这个问题， `Vue`  为用户提供了 `$set`  和 `$delete`  这两个 `API` 。<br />

<a name="4lIjB"></a>

## \$set

通过 `Vue` 提供的 `$set` ，我们就可以为一个对象添加它原本没有的属性，但又能正常的触发该对象的依赖了。<br />
<br />`$set`  的基本用法：

```javascript
var vm = new Vue({
  data: {
    obj: {},
  },
});

vm.$set(vm.obj, "name", "kcy");
```

下面来看一下 `$set`  的实现原理， `$set`  的方法来自于 `set`  函数，在 `stateMixin`  函数中将 `set`  函数挂载到了 `Vue.prototype.$set`  上，此处删除了一些不必要的代码，便于集中注意。

```javascript
function set(target, key, val) {
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val;
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val;
    return val;
  }
  const ob = target.__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
    return val;
  }
  if (!ob) {
    target[key] = val;
    return val;
  }
  defineReactive(ob.value, key, val);
  ob.dep.notify();
  return val;
}
```

**第 2 行**第一个 `if`  语句中，判断了 `target`  是否是数组， `$set`  本身可以作用于数组或者是对象，由于本文主要基于对象类型进行原理的展开，所以数组在这里用一句话带过：如果 `$set`  目标是个数组，则将数组指定 `key`  下标的项修改或新增为 传入的 `val`  值，并直接返回，由于 `Vue`  已经在数组方法上进行了修改，所以不在需要做其他的额外操作了。<br />
<br />**第 7 行**的 `if`  语句也比较简单，如果 `$set`  所指定的 `key`  已经在对象中存在，并且不是对象的原型对象上的属性，则直接将该属性修改为传入的 `val`  值。<br />
<br />**第 11 行**的 `if`  语句，对 `$set`  的使用场景进行了限制，表示 `$set`  的第一个入参 `target` ，不能是一个 `Vue`  实例或 `Vue`  实例的 `$data` ，这也就意味着只能在已经存在于 `data`  选项中的对象使用 `$set` ，而不能直接对 `data`  选项使用 `$set`  来添加一个新属性。<br />
<br />**第 15 行**的 `if`  语句，如果目标 `target`  不是一个对象类型，或对象上没有 `__ob__`  属性，则赋值后直接返回，因为 `Vue`  会给每一个对象添加一个 `__ob__`  的属性，上面挂载的是 `Observer`  实例，如果对象上没有 `__ob__` ，说明它是一个基本类型，或者是一个被使用了 `Object.freeze`  等方法禁止修改配置以及添加新属性的对象，因为 `__ob__`  是实现 `$set`  关键所在。<br />
<br />**第 19 行**，为 `ob.value` （其实就是传入的 `target`  对象）添加一个新属性，值为传入的 `val` 。<br />
<br />关键来了，在**第 20 行**，调用了对象的 `Observer`  实例上的 `Dep`  实例的 `notify`  方法，至此，就完成了为对象新增一个属性并实现响应的操作。<br />
<br />what？为什么？为什么调用了一下 `Observer`  实例上的 `Dep` 实例的 `notify`  方法就可以完成通知了？一脸懵逼的亚子。<br />
<br />下面我来解释一下：<br />
<br />首先，之前也提到了， `Vue`  会为每一个对象新增一个 `__ob__`  属性，该属性上存放的是属于该对象的 `Observer`  实例，是在 `defineReactive`  函数中，调用 `Object.defineProperty`  为对象添加 `getter`、`setter`  拦截器之前完成的，具体代码如下（第 4 行）：

```javascript
// 残疾版 defineReactive
function defineReactive(obj, key, val, customSetter, shallow) {
  // ...
  let childOb = !shallow && observe(val);

  Object.defineProperty(obj, key, {
    // ...
  });
}
```

当 `shallow`  为 `false`  时，调用 `observe`  函数，入参为当前的对象，这里的 `shallow`  只有在对 `Vue`  内置方法调用 `defineReactive`  时才会设置为 `true` ，所以对于一般数据来说，必然会进入 `observe`  函数。 <br />
<br />`observe`  函数如下：<br />
<br />在 `observe`  函数中，如果当前值是一个数组或对象，则会创建一个 `Observer`  实例，并最终返回该实例（**第 15 行**），否则返回 `undefined` 。

```javascript
function observe(value, asRootData) {
  if (!isObject(value) || value instanceof VNode) {
    return;
  }
  let ob;
  if (hasOwn(value, "__ob__") && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob;
}
```

`Observer`  类代码如下：<br />
<br />在 `Observer`  的构造函数中，将自身的引用绑定在了对象的 `__ob__` 属性上（**第 10 行**），所以简单来说就是为对象添加了一个 `__ob__` 的属性，同时这里创建了一个 `Dep`  实例（**第 8 行**）， `Dep`  用来存放依赖，我们知道 `Vue`  中的每个响应式数据都有 `Dep`  实例来存放依赖，但这里的依赖并不是属于某个数据，而属于这个对象本身，记住这个 `Dep`  实例，是实现 `$set`  的关键之一。<br />
<br />`Observer`  其余的代码也就不赘述了，大致就是遍历了对象中的每个属性（使用 `walk`  或 `observeArray` ），依次调用 `defineReactive` ，而 `defineReactive`  中又会调用 `observe`  创建 `Observer`  实例，最终递归遍历了所有属性并修改了它们的了 `getter`  和`setter` 。

```javascript
class Observer {
  value;
  dep;
  vmCount;

  constructor(value) {
    this.value = value;
    this.dep = new Dep();
    this.vmCount = 0;
    def(value, "__ob__", this);
    if (Array.isArray(value)) {
      if (hasProto) {
        protoAugment(value, arrayMethods);
      } else {
        copyAugment(value, arrayMethods, arrayKeys);
      }
      this.observeArray(value);
    } else {
      this.walk(value);
    }
  }

  walk(obj) {
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i]);
    }
  }

  observeArray(items) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i]);
    }
  }
}
```

再次回到 `defineReactive`  函数中，这次我们知道了**第 5 行**中的 `childOb`  变量中存放了属于当前对象的 `Observer`  实例，并且 `Observer`  实例上有一个 `Dep`  实例，接着看**第 13 行**，在 `getter`  中，如果存在这个 `childOb` ，则会把当前正在读取该对象或该对象属性的依赖收集进 `Observer`  实例的 `Dep`  中。<br />
<br />我们知道当我们读取一个对象的属性时，会触发该属性的 `getter` ，同时也会触发属性所属对象的 `getter` ，同样的，不管这个属性在对象中藏的有多深，都会依次触发上级对象的 `getter` ，而上级对象在这个时候就会触发 `getter` ，并在进入**第 13 行**的 `if`  判断，**最终将目前正在读取属性的依赖收集到自身的 `Observer`  实例的 `Dep`  中**，这样一来，我们会发现对象的 `Observer`  实例的 `Dep`  中就**存放了该对象所有属性以及属性的子属性的依赖**。

```javascript
function defineReactive(obj, key, val, customSetter, shallow) {
  const dep = new Dep();
  //...

  let childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      const value = getter ? getter.call(obj) : val;
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value;
    },
    set: function reactiveSetter(newVal) {
      //...
    },
  });
}
s;
```

再回到 `set`  函数中，在**第 20 行**，为对象新增属性后触发了对象 `Observer`  实例中的 `Dep`  实例的 `notify`  方法，而 `notify`  方法会通知所有依赖进行更新，这样一来，我们就完成了最初的目标：**为对象新增一个属性，并且能正常触发对象的依赖。**

```javascript
function set(target, key, val) {
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val;
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val;
    return val;
  }
  const ob = target.__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
    return val;
  }
  if (!ob) {
    target[key] = val;
    return val;
  }
  defineReactive(ob.value, key, val);
  ob.dep.notify();
  return val;
}
```

以上就是 `$set`  的原理。
<a name="1CtPm"></a>

## \$delete

`$delete`  的基本用法：

```javascript
var vm = new Vue({
  data: {
    obj: {
      name: "kcy",
    },
  },
});
// 无法响应
delete vm.obj.name;
// 可以响应
vm.$delete(vm.obj, "name");
```

再来看 `$delete`  的代码实现：

```javascript
function del(target, key) {
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1);
    return;
  }
  const ob = target.__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
    return;
  }
  if (!hasOwn(target, key)) {
    return;
  }
  delete target[key];
  if (!ob) {
    return;
  }
  ob.dep.notify();
}
```

同样的， `del`  函数也是在 `stateMixin`  函数中，被挂载到 `Vue.prototype.$delete`  上，从而变成我们所使用的 `$delete`  的，可以发 `$delete`  和 `$set`  代码基本结构一致。<br />
<br />在**第 2 行**中，若对象是数组，则使用 `splice`  方法进行移除，原因在 `$set`  时已经说明过了。<br />
<br />在**第 7 行**中，如果 `$delete`  的目标是 Vue 实例，或者是 `Vue`  实例的 `data`  选项，则直接返回，不能这样做。<br />
<br />在**第 10 行**，理所当然的，如果目标对象上没有该属性，则直接返回。<br />
<br />在**第 13 行**中使用 `delete`  操作符删除了对象上的属性，如果对象上没有 `__ob__`  说明不是对象类型，或被使用了 `Object.freeze` 。最后在**第 17 行**调用了对象 `Observer`  实例中的 `Dep`  实例的 `notify`  方法，通知到所有的依赖进行更新。<br />
<br />至此我们可以发现， `$delete`  和 `$set`  本身实现原理基本相同，都依赖于对象 `Observer`  实例中的 `Dep`  实例所收集的依赖，若没有这样收集所有子属性的依赖，我们很难正确的通知到所有的依赖进行更新，不过我们能想到的还有另外一种办法，就是主动递归遍历所有属性，触发它们的依赖，也许这个方法同样可以实现这个功能，只不过有点“暴力”了。<br />
<br />以上就是 `$delete`  的实现原理。
