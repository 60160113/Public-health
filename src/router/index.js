import Vue from "vue";
import Router from "vue-router";

import Meta from "vue-meta";

Vue.use(Router);
Vue.use(Meta);

// Containers
const TheContainer = () =>
    import ("@/containers/TheContainer");

// Views - Pages
import full from "./full";

import main from "./main";

const router = new Router({
    mode: "hash", // https://router.vuejs.org/api/#mode
    linkActiveClass: "open active",
    scrollBehavior: () => ({ y: 0 }),
    routes: [{
            path: "/",
            redirect: "/pages/login",
            name: "Home",
            component: TheContainer,
            children: main
        },
        {
            path: "/pages",
            redirect: "/pages/404",
            name: "Pages",
            component: {
                render(c) {
                    return c("router-view");
                }
            },
            children: full
        }
    ]
});

// Before each
router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth) {
        const user = JSON.parse(localStorage.getItem("AuthUser"));
        if (user) {
            if (to.name == "Login") {
                return next("/home");
            } else {
                return next();
            }
        } else {
            return next({ name: "Login" });
        }
    } else {
        return next();
    }
});

export default router;