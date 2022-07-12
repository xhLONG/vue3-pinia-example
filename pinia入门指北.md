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

#### store.$dispose

销毁pinia容器

```js
function $dispose() {
    // 停止监听
    scope.stop()
    // 清空subscriptions及actionSubscriptions
    subscriptions = []
    actionSubscriptions = []
    // 从pinia._s中删除store
    pinia._s.delete($id)
}
```

#### 总结

`defineStore`返回一个`useStore`函数，通过执行`useStore`可以获取对应的`store`。调用`useStore`时我们并没有传入`id`，为什么能准确获取`store`呢？这是因为`useStore`是个闭包，在执行`useStore`执行过程中会自动获取`id`。

获取`store`的过程：

1. 首先获取组件实例
2. 使用`inject(piniaSymbol)`获取`pinia`实例
3. 判断`pinia._s`中是否有对应`id`的键，如果有直接取对应的值作为`store`，如果没有则创建`store`

`store`创建流程分两种：`setup`方式与`options`方式

`setup`方式：

1. 首先在`pinia.state.value`中添加键为`$id`的空对象，以便后续赋值
2. 使用`reactive`声明一个响应式对象`store`
3. 将`store`存至`pinia._s`中
4. 执行`setup`获取返回值`setupStore`
5. 遍历`setupStore`的键值，如果值是`ref`（不是`computed`）或`reactive`，将键值添加到`pinia.state.value[$id]`中；如果值时`function`，首先将值使用`wrapAction`包装，然后用包装后的`function`替换`setupStore`中对应的值
6. 将`setupStore`合并到`store`中
7. 拦截`store.$state`，使`get`操作可以正确获取`pinia.state.value[$id]`，`set`操作使用`this.$patch`更新
8. 调用`pinia._p`中的扩展函数，扩展`store`

`options`方式：

1. 从`options`中提取`state`、`getter`、`actions`
2. 构建`setup`函数，在`setup`函数中会将`getter`处理成计算属性
3. 使用`setup`方式创建`store`
4. 重写`store.$reset`



#### storeToRefs

当使用`store`的过程中，如果直接对`store`进行解构，会破坏数据的响应，所以`pinia`提供了`storeToRefs`用来进行解构。

```js
export function storeToRefs<SS extends StoreGeneric>(
  store: SS
): ToRefs<
  StoreState<SS> & StoreGetters<SS> & PiniaCustomStateProperties<StoreState<SS>>
> {
  // See https://github.com/vuejs/pinia/issues/852
  // It's easier to just use toRefs() even if it includes more stuff
  if (isVue2) {
    // @ts-expect-error: toRefs include methods and others
    return toRefs(store)
  } else {
    // store的原始对象
    store = toRaw(store)

    const refs = {} as ToRefs<
      StoreState<SS> &
        StoreGetters<SS> &
        PiniaCustomStateProperties<StoreState<SS>>
    >
    for (const key in store) {
      const value = store[key]
      if (isRef(value) || isReactive(value)) {
        // @ts-expect-error: the key is state or getter
        refs[key] =
          // ---
          toRef(store, key)
      }
    }

    return refs
  }
}
```

### mapHelper

源码位置：packages\pinia\src\mapHelpers.ts

#### mapState

```js
export function mapState<
  Id extends string,
  S extends StateTree,
  G extends _GettersTree<S>,
  A
>(
  useStore: StoreDefinition<Id, S, G, A>,
  keysOrMapper: any
): _MapStateReturn<S, G> | _MapStateObjectReturn<Id, S, G, A> {
  return Array.isArray(keysOrMapper)
    ? keysOrMapper.reduce((reduced, key) => {
        reduced[key] = function (this: ComponentPublicInstance) {
          return useStore(this.$pinia)[key]
        } as () => any
        return reduced
      }, {} as _MapStateReturn<S, G>)
    : Object.keys(keysOrMapper).reduce((reduced, key: string) => {
        // @ts-expect-error
        reduced[key] = function (this: ComponentPublicInstance) {
          const store = useStore(this.$pinia)
          const storeKey = keysOrMapper[key]
          // for some reason TS is unable to infer the type of storeKey to be a
          // function
          return typeof storeKey === 'function'
            ? (storeKey as (store: Store<Id, S, G, A>) => any).call(this, store)
            : store[storeKey]
        }
        return reduced
      }, {} as _MapStateObjectReturn<Id, S, G, A>)
}
```



#### mapWritableState

```js
export function mapWritableState<
  Id extends string,
  S extends StateTree,
  G extends _GettersTree<S>,
  A,
  KeyMapper extends Record<string, keyof S>
>(
  useStore: StoreDefinition<Id, S, G, A>,
  keysOrMapper: Array<keyof S> | KeyMapper
): _MapWritableStateReturn<S> | _MapWritableStateObjectReturn<S, KeyMapper> {
  return Array.isArray(keysOrMapper)
    ? keysOrMapper.reduce((reduced, key) => {
        // @ts-ignore
        reduced[key] = {
          get(this: ComponentPublicInstance) {
            return useStore(this.$pinia)[key]
          },
          set(this: ComponentPublicInstance, value) {
            // it's easier to type it here as any
            return (useStore(this.$pinia)[key] = value as any)
          },
        }
        return reduced
      }, {} as _MapWritableStateReturn<S>)
    : Object.keys(keysOrMapper).reduce((reduced, key: keyof KeyMapper) => {
        // @ts-ignore
        reduced[key] = {
          get(this: ComponentPublicInstance) {
            return useStore(this.$pinia)[keysOrMapper[key]]
          },
          set(this: ComponentPublicInstance, value) {
            // it's easier to type it here as any
            return (useStore(this.$pinia)[keysOrMapper[key]] = value as any)
          },
        }
        return reduced
      }, {} as _MapWritableStateObjectReturn<S, KeyMapper>)
}
```



#### mapActions

```js
export function mapActions<
  Id extends string,
  S extends StateTree,
  G extends _GettersTree<S>,
  A,
  KeyMapper extends Record<string, keyof A>
>(
  useStore: StoreDefinition<Id, S, G, A>,
  keysOrMapper: Array<keyof A> | KeyMapper
): _MapActionsReturn<A> | _MapActionsObjectReturn<A, KeyMapper> {
  return Array.isArray(keysOrMapper)
    ? keysOrMapper.reduce((reduced, key) => {
        // @ts-expect-error
        reduced[key] = function (
          this: ComponentPublicInstance,
          ...args: any[]
        ) {
          return useStore(this.$pinia)[key](...args)
        }
        return reduced
      }, {} as _MapActionsReturn<A>)
    : Object.keys(keysOrMapper).reduce((reduced, key: keyof KeyMapper) => {
        // @ts-expect-error
        reduced[key] = function (
          this: ComponentPublicInstance,
          ...args: any[]
        ) {
          return useStore(this.$pinia)[keysOrMapper[key]](...args)
        }
        return reduced
      }, {} as _MapActionsObjectReturn<A, KeyMapper>)
}
```



#### mapGetter

```js
export const mapGetters = mapState
```



#### 总结

`mapStores`、`mapState`、`mapActions`等辅助函数会在内部通过调用`useStore`（在`useStore`调用时会传入`this.$pinia`，`this`为组件实例，这也是为什么辅助函数不能用在`setup`中，因为`setup`中是无法获取组件实例）获取`store`，然后在`store`中获取对应属性。
