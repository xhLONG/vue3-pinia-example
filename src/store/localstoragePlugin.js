import { toRaw } from "vue";

const setStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
};

const getStorage = (key) => {
    return (localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : {})
};

// 指定某个容器，做持久化存储
export default function (storeId) {
    return function (context) {
        console.log(context)
        const { store } = context;

        if (store.$id == storeId) {
            const data = getStorage(store.$id)
            store.$subscribe(() => {
                setStorage(store.$id, toRaw(store.$state));
            })

            return {
                //返回值覆盖pinia 原始值
                ...data
            }
        }
    }
}
