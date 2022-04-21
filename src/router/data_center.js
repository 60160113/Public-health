export default [
  {
    path: "/data-center/reserve/list",
    name: "Reserve List",
    component: () => import("@/views/data_center/reserve/List.vue"),
    meta: {
      requiresAuth: true,
      restriction: [
        {
          key: "position",
          value: "IST"
        }
      ]
    }
  },
  {
    path: "/data-center/check-in/list",
    name: "Check-in List",
    component: () => import("@/views/data_center/check-in/List.vue"),
    meta: {
      requiresAuth: true,
      restriction: [
        {
          key: "position",
          value: "IST,ISS,guard"
        }
      ]
    }
  }
];
