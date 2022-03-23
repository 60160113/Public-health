export default [
  {
    path: "/data-center/reserve/list",
    name: "Reserve List",
    component: () => import("@/views/data_center/reserve/List.vue"),
    meta: {
      requiresAuth: true
    }
  },
];
