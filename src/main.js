import localstoragePlugin from './store/localstoragePlugin'
import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router/index'

// 创建pinia实例
const pinia = createPinia();

// pinia插件
function SecretPiniaPlugin(context) {
    console.log(context);
    return { secret: 'the cake is a lie' }
}
pinia.use(SecretPiniaPlugin);

pinia.use(localstoragePlugin('user'));
// pinia.use(localstoragePlugin('goods'));

const app = createApp(App);
app.use(pinia);
app.use(router);
app.mount('#app');