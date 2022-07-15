<!--
    pinia的简单使用用介绍
 -->
<template>
    <div class="first">
        <div>
            <h5 class="txt-left">访问pinia中的数据</h5>
            <div>count的值：{{store.count}} --- {{count}}</div>
            <div>foo的值：{{store.foo}} --- {{foo}}</div>
            <div>bar的值：{{store.bar}} --- {{bar}}</div>
            <div>foobar的值：{{store.foobar}}</div>
            <hr>
        </div>
        <div>
            <h5 class="txt-left">修改pinia中的数据</h5>
            <div>
                <span>count的值：{{store.count}}</span>
                <button @click="changeCount">change count</button>
            </div>
            <div>
                <span>具有响应式的foo：{{foo}}</span>
                <button @click="changeFoo">change foo</button>
            </div>
            <div>
                <span>不具有响应式的bar：{{bar}}</span>
                <button @click="changeBar">change bar</button>
            </div>
            <button @click="resetAll">重置所有数据</button>
            <hr>
        </div>
    </div>
</template>

<script setup>
import { computed, defineComponent } from "vue";
import { storeToRefs } from "pinia";
import { userStore } from "../store/userStore";

const store = userStore();
console.log(store.count);
// vueX  this.store.state.index.age

// count, foo 具有响应式, 用了reactive
const { count, foo } = storeToRefs(store);
// bar不具有响应式
const { bar } = store;

function changeCount() {
    store.count++;

    // store.$patch({
    //     count: store.count + 1,
    // })

    // store.increate();
}
function changeFoo() {
    store.foo = 'foo' + Math.ceil(Math.random() * 100);
}
function changeBar() {
    store.bar = 'bar' + Math.ceil(Math.random() * 100);
}

// 批量修改，优点：更新完所有数据后，最后只进行一次视图更新
function resetAll() {
    store.$patch(state => {
        state.count = 1;
        state.foo = 'foo';
        state.bar = 'bar';
    })
    // store.$reset();
}

</script>
