import Vue from "vue";
import Router from "vue-router";

import Meta from "vue-meta";

Vue.use(Router);
Vue.use(Meta);

// Containers
const TheContainer = () => import("@/containers/TheContainer");

// Views - Pages
const Page404 = () => import("@/views/pages/Page404");
const Page500 = () => import("@/views/pages/Page500");
const Login = () => import("@/views/pages/Login");
const Register = () => import("@/views/pages/Register");

const requireRoute = require.context(".", false, /\.js$/); // Get js files inside routes folder
const routes = [];

requireRoute.keys().forEach(fileName => {
  // Avoid the index.js file
  if (fileName === "./index.js") {
    return;
  }
  const route = requireRoute(fileName).default;
  routes.push(...route);
});

const router = new Router({
  mode: "hash", // https://router.vuejs.org/api/#mode
  linkActiveClass: "open active",
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: "/",
      redirect: "/pages/login",
      name: "Home",
      component: TheContainer,
      children: routes
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
      children: [
        {
          path: "404",
          name: "Page404",
          component: Page404,
          meta: {
            requiresAuth: false
          }
        },
        {
          path: "500",
          name: "Page500",
          component: Page500,
          meta: {
            requiresAuth: false
          }
        },
        {
          path: "login",
          name: "Login",
          component: Login,
          meta: {
            requiresAuth: false
          }
        },
        {
          path: "register",
          name: "Register",
          component: Register,
          meta: {
            requiresAuth: false
          }
        },
        {
          path: "/data-center/reserve",
          name: "Reserve",
          component: () => import("@/views/data_center/Reserve.vue"),
          meta: {
            requiresAuth: false
          }
        },
      ]
    }
  ]
});

// Before each
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const user = JSON.parse(localStorage.getItem("AuthUser"));
    if (user) {
      if (to.name == "Login") {
        return next("/data-center/check-in");
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
