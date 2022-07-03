<!--
    使用多个容器
 -->
<template>
    <div class="second">
        <div>我是来自<span class="font-color-red">userStore</span>的数据，count：{{userstore.count}}</div>
        <div>我是来自<span class="font-color-red">goodsStore</span>的数据，goodsList：{{goodsstore.goodsList}}</div>
    </div>
</template>

<script setup>
import { computed, defineComponent } from "vue";
import { userStore } from "../store/userStore";
import { goodsStore } from "../store/goodsStore";
import { storeToRefs } from "pinia";

const userstore = userStore();
const goodsstore = goodsStore();


</script>
