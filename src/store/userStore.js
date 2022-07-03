import { defineStore } from 'pinia'

/**
 * 参数1：容器id，必须唯一，以后会挂到根容器
 * 参数2：选项对象
 */
export const userStore = defineStore('user', {
    // 必须是函数，避免服务器渲染时交叉请求导致数据污染
    // 必须是箭头函数，方便ts类型推导
    state: () => {
        return {
            count: 1,
            foo: 'foo',
            bar: 'bar',
            price: 99,
            userInfo: {
                name: '张三',
                age: 18,
                token: 'jgfdoisnghlksadngoifd',
            },
        }
    },

    actions: {
        // 不能使用箭头函数，否者无法改变this的指向
        resetState() {
            this.count = 1;
            this.foo = 'foo';
            this.bar = 'bar';
        },

        increate() {
            this.count++;
        },
    },

    // 类似计算属性，也存在缓存
    getters: {
        foobar(state) {
            return state.foo + state.bar;
        },

        foobar10() {
            return this.foobar + 10;
        }
    },
})


/**
 * 也可以只传一个对象参数，id写到这个对象里面
 */
// export const useStore2 = defineStore({
//     id: 'main2',
//     state: () => {
//         return {
//             count: 1,
//             foo: 'foo',
//             bar: 'bar',
//         }
//     },

//     actions: {
//         resetState(){
//             this.count = 1;
//             this.foo = 'foo';
//             this.bar = 'bar';
//         }
//     },

//     getters: {
//         foobar(state){
//             return state.foo + state.bar;
//         },

//         foobar10(): string{
//             return this.foobar + 10;
//         }
//     },
// })