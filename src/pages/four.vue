<!--
    插件
 -->
<template>
    <div class="four">
        <div><span class="font-color-red">userStore</span>容器里面的secret：{{uStore.secret}}</div>
        <div><span class="font-color-red">goodsStore</span>容器里面的secret：{{gStore.secret}}</div>

        <hr />

        <div>
            <span>
                <span class="font-color-red">userStore</span>容器里面的count的值：{{uStore.count}}
            </span>
            <button @click="changeCount">change count</button>
        </div>

        <hr />

        <div class="goods-list">
            <div v-for="item in gStore.goodsList" :key="item.id">
                <span>{{item.name}}</span>
                <span style="margin: 0 100px">价格：{{item.price}}</span>
                <button @click="addGoods(item)">+1</button> <button  @click="delGoods(item)">-1</button>
            </div>
        </div>
        <div class="txt-left">
            <p v-if="gStore.selectedGoods.length <= 0">未选商品</p>
            <p v-else>已选商品</p>
            <ul>
                <li  v-for="item in gStore.selectedGoods" :key="item.id">
                    {{item.name}}------- x{{item.num}}
                </li>
            </ul>
            <div>总金额：{{gStore.allPrice}}</div>
        </div>
    </div>
</template>

<script setup>
import { userStore } from "../store/userStore";
import { goodsStore } from "../store/goodsStore";
import { mapState, mapWritableState } from 'pinia';

const uStore = userStore();
const gStore = goodsStore();

function changeCount() {
    uStore.count++;
}

const addGoods = function addGoods(goods) {
    console.log(goods);
    gStore.selectGoods(goods);
}

function delGoods(goods) {
    gStore.delGoods(goods);
}

</script>
