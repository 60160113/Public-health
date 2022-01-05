export default [
  {
    path: "/configuration/data_center/objectives",
    name: "Data center objectives",
    component: () => import("@/views/configuration/data_center/Objectives.vue"),
    meta: {
      requiresAuth: true
    }
  }
];
