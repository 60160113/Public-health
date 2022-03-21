export default [
  {
    path: "/configuration/data_center/objectives",
    name: "Data center objectives",
    component: () => import("@/views/configuration/data_center/Objectives.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/configuration/data_center/building_cards",
    name: "Data center building card numbers",
    component: () => import("@/views/configuration/data_center/BuildingCards.vue"),
    meta: {
      requiresAuth: true
    }
  }
];
