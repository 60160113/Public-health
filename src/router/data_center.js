export default [
  {
    path: "/data-center/check-in",
    name: "Check-in",
    component: () => import("@/views/data_center/CheckIn.vue")
  },
  {
    path: "/data-center/list-approve-permission",
    name: "List Approve Permission",
    component: () => import("@/views/data_center/ListApprovePermission.vue")
  },
  {
    path: "/data-center/approve-permission",
    name: "Approve Permission",
    component: () => import("@/views/data_center/ApprovePermission.vue")
  },
  {
    path: "/data-center/consider-requirement",
    name: "Consider Requirement",
    component: () => import("@/views/data_center/ConsiderRequirement.vue")
  },
  {
    path: "/data-center/check-out",
    name: "Check-out",
    component: () => import("@/views/data_center/CheckOut.vue")
  },
  {
    path: "/data-center/review",
    name: "Entering Data Center Review",
    component: () => import("@/views/data_center/Review.vue")
  }
];
