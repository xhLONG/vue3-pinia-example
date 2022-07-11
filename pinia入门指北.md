# pinia入门指北

![image-20220630203603627](pinia入门指北.assets/image-20220630203603627.png)

[官网](https://pinia.vuejs.org/)

## pinia是个什么东西

### 前言

Pinia 是 Vue.js 团队成员专门为 Vue 开发的一个全新的状态管理库，并且已经被纳入官方 [github](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fvuejs%2Fpinia)。

为什么有了vueX，还要开发pinia?

这是vueX 5 的提案。

![微信图片_20220314212501.png](pinia入门指北.assets/31392bce05ac498c98fc0337f8099ae8tplv-k3u1fbpfcp-zoom-in-crop-mark3024000.awebp)

而pinia刚好符合vueX5提案的所有要求，事实上，pinia也是基于vueX对未来状态管理器的一种探索。

### 简介

Pinia.js 是新一代的状态管理器，由 Vue.js团队中成员所开发的，因此也被认为是下一代的 Vuex，即 Vuex5.x，在 Vue3.0 的项目中使用也是备受推崇。

```
Pinia刚开始只是一个实验，旨在重新设计Vue的Store在2019年11月左右可以使用Composition API的样子。从那时起，最初的原则仍然是相同的，但Pinia同时适用于Vue 2和Vue 3，并且不要求你使用composition API。
```



### 核心特性

#### state

state是pinia的核心部分，所有需要管理的状态属性都写到这里，和vueX的state差不多，是唯一存储能够存储数据的地方，并且具有响应式。

基本使用方式如下：

```js
import { defineStore } from 'pinia'

const useStore = defineStore('storeId', {
    return {
      counter: 0,
      name: 'Eduardo',
      isAdmin: true,
    }
  },
})
```

可以使用mapState() 引入多个数据，只能读取数据；

也可以使用mapWritableState() 引入多个数据，并且可以读取和修改数据。

修改数据

```js
// 1、可以直接以点操作符的方式修改
const store = useStore()：
store.counter++

// 2、可以使用$patch()
store.$patch({
  counter: store.counter + 1,
  name: 'Abalam',
})

// 3、也可以调用action里面的方法去修改
```

监听state的改变

```js
store.$subscribe((mutation, state) => {
  // import { MutationType } from 'pinia'
  mutation.type // 'direct' | 'patch object' | 'patch function'
  // same as cartStore.$id
  mutation.storeId // 'cart'
  // only available with mutation.type === 'patch object'
  mutation.payload // patch object passed to cartStore.$patch()

  // persist the whole state to the local storage whenever it changes
  localStorage.setItem('store', JSON.stringify(state))
})
```

#### getters

和vuex的getters一样 ，也具有缓存性，相当于pinia的计算属性，事实上他也是用vue的计算属性来实现的。

基本使用方式如下：

```js
export const useStore = defineStore('main', {
  state: () => ({
    counter: 0,
  }),
  getters: {
    doubleCount: (state) => state.counter * 2,
    myCount(): number{
        return this.count + 1
    }
  },
})
```

#### actions

pinia废弃了mutation，可以使用action代替mutation，也就是说可以在action里面写同步代码和异步代码。

基本使用方式如下：

```js
export const useStore = defineStore('main', {
  state: () => ({
    counter: 0,
  }),
  actions: {
    increment() {
      this.counter++
    },
    asyncIncrement() {
      setTimeout(() => {
          this.counter += 5;
      }, 1000);
    },
  },
})
```



## pinia有什么优点和缺点

### 优点

* 支持devtools
* 支持hmr热更新
* 支持pinia插件扩展

* 更好的 typescript 的支持；

  ```
  不需要再创建自定义的复杂包装器来支持 TypeScript 所有内容都类型化，并且 API 的设计方式也尽可能的使用 TS 类型推断
  ```

* 支持ssr服务端渲染；

* 足够轻量，压缩后的体积只有1.6kb;

* 去除 mutations、module，只有 state、getters、actions；actions 支持同步和异步；

* 没有模块嵌套，只有 store 的概念，store 之间可以自由使用，更好的代码分割；

  ```
  Pinia 通过设计提供扁平结构，就是说每个 store 都是互相独立的，谁也不属于谁，也就是扁平化了，更好的代码分割且没有命名空间。当然你也可以通过在一个模块中导入另一个模块来隐式嵌套 store，甚至可以拥有 store 的循环依赖关系
  
  ```



pinia和vuex相比，一些比较突出实用的功能

```
actions 可以写同步代码和异步代码
没有module模块 扁平化结构，每个容器之间又可以相互引用
代码更加简洁
可以针对某个容器做定制化持久化存储
```



### 缺点

暂时还没发现。



## pinia的基本使用





## pinia核心源码分享

#### createPinia

源码位置：`packages/pinia/src/createPinia.ts`

#### PiniaVuePlugin - vue2

源码位置：`packages/pinia/src/vue2-plugin.ts`

[vueX 3.0 - install()](https://github.dev/vuejs/vuex/tree/3.x)

```js
export function install (_Vue) {
  if (Vue && _Vue === Vue) {
    if (__DEV__) {
      console.error(
        '[vuex] already installed. Vue.use(Vuex) should be called only once.'
      )
    }
    return
  }
  Vue = _Vue
  applyMixin(Vue)
}


export default function (Vue) {
  const version = Number(Vue.version.split('.')[0])

  if (version >= 2) {
    Vue.mixin({ beforeCreate: vuexInit })
  } else {
    // override init and inject vuex init procedure
    // for 1.x backwards compatibility.
    const _init = Vue.prototype._init
    Vue.prototype._init = function (options = {}) {
      options.init = options.init
        ? [vuexInit].concat(options.init)
        : vuexInit
      _init.call(this, options)
    }
  }

  /**
   * Vuex init hook, injected into each instances init hooks list.
   */

  function vuexInit () {
    const options = this.$options
    // store injection
    if (options.store) {
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store
    }
  }
}

```

#### defineStore

源码地址： `packages\pinia\src\store.ts`

```
├─defineStore
│  ├─createSetupStore          
│  ├─createOptionsStore         
```

defineStore -> useStore -- createSetupStore() --> store

[vueX 3.0 - 响应式](https://github.dev/vuejs/vuex/tree/3.x)

```js
function resetStoreVM (store, state, hot) {
  const oldVm = store._vm

  // bind store public getters
  store.getters = {}
  // reset local getters cache
  store._makeLocalGettersCache = Object.create(null)
  const wrappedGetters = store._wrappedGetters
  const computed = {}
  forEachValue(wrappedGetters, (fn, key) => {
    // use computed to leverage its lazy-caching mechanism
    // direct inline function use will lead to closure preserving oldVm.
    // using partial to return function with only arguments preserved in closure environment.
    computed[key] = partial(fn, store)
    Object.defineProperty(store.getters, key, {
      get: () => store._vm[key],
      enumerable: true // for local getters
    })
  })

  // use a Vue instance to store the state tree
  // suppress warnings just in case the user has added
  // some funky global mixins
  const silent = Vue.config.silent
  Vue.config.silent = true
  store._vm = new Vue({
    data: {
      $$state: state
    },
    computed
  })
  Vue.config.silent = silent

  // enable strict mode for new vm
  if (store.strict) {
    enableStrictMode(store)
  }

  if (oldVm) {
    if (hot) {
      // dispatch changes in all subscribed watchers
      // to force getter re-evaluation for hot reloading.
      store._withCommit(() => {
        oldVm._data.$$state = null
      })
    }
    Vue.nextTick(() => oldVm.$destroy())
  }
}
```



#### store.$onAction

```js
$onAction: addSubscription.bind(null, actionSubscriptions),
```

`$onAction`内部通过发布订阅模式实现。在`pinia`中有个专门的订阅模块`subscriptions.ts`，其中包含两个主要方法：`addSubscription`（添加订阅）、`triggerSubscriptions`（触发订阅）。

**如何触发订阅**

首先在`store`的初始化过程中，会将`action`使用`wrapAction`函数进行包装，`wrapAction`返回一个函数，在这个函数中会先触发`actionSubscriptions`，这个触发过程中会将`afterCallback`、`onErrorCallback`添加到对应列表。然后调用`action`，如果调用过程中出错，则触发`onErrorCallbackList`，否则触发`afterCallbackList`。如果`action`的结果是`Promise`的话，则在`then`中触发`onErrorCallbackList`，在`catch`中触发`onErrorCallbackList`。然后会将包装后的`action`覆盖原始`action`，这样每次调用`action`时就是调用的包装后的`action`。

#### store.$patch

```js
function $patch(
  partialStateOrMutator:
    | _DeepPartial<UnwrapRef<S>>
    | ((state: UnwrapRef<S>) => void)
): void {
  // 合并的相关信息
  let subscriptionMutation: SubscriptionCallbackMutation<S>
  // 是否触发状态修改后的回调，isListening代表异步触发，isSyncListening代表同步触发
  // 此处先关闭回调的触发，防止修改state的过程中频繁触发回调
  isListening = isSyncListening = false
  if (__DEV__) {
    debuggerEvents = []
  }
  // 如果partialStateOrMutator是个function，执行方法，传入当前的store
  if (typeof partialStateOrMutator === 'function') {
    partialStateOrMutator(pinia.state.value[$id] as UnwrapRef<S>)
    subscriptionMutation = {
      type: MutationType.patchFunction,
      storeId: $id,
      events: debuggerEvents as DebuggerEvent[],
    }
  } else { // 如果不是function，则调用mergeReactiveObjects合并state
    mergeReactiveObjects(pinia.state.value[$id], partialStateOrMutator)
    subscriptionMutation = {
      type: MutationType.patchObject,
      payload: partialStateOrMutator,
      storeId: $id,
      events: debuggerEvents as DebuggerEvent[],
    }
  }
  // 当合并完之后，将isListening、isSyncListening设置为true，意味着可以触发状态改变后的回调函数了
  const myListenerId = (activeListener = Symbol())
  nextTick().then(() => {
    if (activeListener === myListenerId) {
      isListening = true
    }
  })
  isSyncListening = true
  // 因为在修改pinia.state.value[$id]的过程中关闭（isSyncListening与isListening）了监听，所以需要手动触发订阅列表
  triggerSubscriptions(
    subscriptions,
    subscriptionMutation,
    pinia.state.value[$id] as UnwrapRef<S>
  )
}
```

#### store.$reset

```js
// 只在options配置下有效
store.$reset = function $reset() {
    // 重新执行state，获取一个新的state
    const newState = state ? state() : {}
    // 通过$patch，使用assign将newState合并到$state中
    this.$patch(($state) => {
    	assign($state, newState)
    })
}
```

#### store.$subscribe

```js
$subscribe(callback, options = {}) {
    // 将callback添加到subscriptions中，以便使用$patch更新状态时，触发回调
    // 当使用removeSubscription移除callback时，停止对pinia.state.value[$id]监听
    const removeSubscription = addSubscription(
        subscriptions,
        callback,
        options.detached,
        () => stopWatcher()
    )
    const stopWatcher = scope.run(() =>
                                  // 监听pinia.state.value[$id]，以触发callback，当使用$patch更新state时，不会进入触发这里的callback
                                  watch(
        () => pinia.state.value[$id] as UnwrapRef<S>,
        (state) => {
        // options.flush === 'sync' 是否同步触发回调
        if (options.flush === 'sync' ? isSyncListening : isListening) {
            callback(
                {
                    storeId: $id,
                    type: MutationType.direct,    // 表示是通过什么方式更新的state
                    events: debuggerEvents as DebuggerEvent,
                },
                state
            )
            /** MutationType.direct：通过state.name='xxx'/store.$state.name='xxx'等方式修改
                  MutationType.patchObject：通过store.$patch({ name: 'xxx' })方式修改
                  MutationType.patchFunction：通过store.$patch((state) =&gt; state.name='xxx')方式修改 
              */
        }
    },
                                  assign({}, $subscribeOptions, options)
                                 )
    )!

        return removeSubscription
},
```

