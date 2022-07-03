import { createRouter, createWebHashHistory } from "vue-router";

const routes = [{
    path: "/",
    redirect: "home",
}, {
    path: "/home",
    name: "home",
    component: () => import("../pages/Home.vue")
}, {
    path: "/first",
    name: "first",
    component: () => import("../pages/first.vue")
}, {
    path: "/second",
    name: "second",
    component: () => import("../pages/second.vue")
}, {
    path: "/third",
    name: "third",
    component: () => import("../pages/third.vue")
}, {
    path: "/four",
    name: "four",
    component: () => import("../pages/four.vue")
},]

export default createRouter({
    history: createWebHashHistory(),
    routes,
});