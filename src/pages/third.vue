<!--
    辅助函数map
 -->
<template>
    <div class="third">
        <h5 class="txt-left">mapState</h5>
        <div>
            <span>count：{{count}}</span>
            <button @click="changeCount">change count</button>
        </div>
        <p>foo: {{foo}}</p>
        <p>bar: {{bar}}</p>

        <hr />

        <h5 class="txt-left">mapGetters</h5>
        <p>foobar: {{foobar}}</p>
        <p>foobar10: {{foobar10}}</p>

        <hr />

        <h5 class="txt-left">mapActions</h5>
        <button @click="resetState">resetState</button>
        <button @click="increate">increate</button>
    </div>
</template>

<script>
import { userStore } from "../store/userStore";
import { mapActions, mapGetters, mapState, mapWritableState } from "pinia";

// options api 使用map辅助函数
export default {
    computed: {
        ...mapState(userStore, ['count', 'foo', 'bar']),
        // ...mapWritableState(userStore, ['count', 'foo', 'bar']),

        ...mapGetters(userStore, ['foobar', 'foobar10'])
    },

    methods: {
        changeCount() {
            /**
             * mapState: 只能读
             * mapWritableState: 读和写
             */
            this.count += 1;
        },

        ...mapActions(userStore, ['resetState', 'increate']),
    }
}
</script>
