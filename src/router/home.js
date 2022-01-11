export default [
  {
    path: "/home",
    name: "Home",
    component: () => import("@/views/Home.vue"),
    meta: {
      requiresAuth: true
    }
  }
];
