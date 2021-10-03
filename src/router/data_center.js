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
    path: "/data-center/approve-permission/:processId",
    name: "Approve Permission",
    component: () => import("@/views/data_center/ApprovePermission.vue")
  },
  {
    path: "/data-center/list-consider-requirement",
    name: "List Consider Requirement",
    component: () => import("@/views/data_center/ListConsiderRequirement.vue")
  },
  {
    path: "/data-center/consider-requirement/:processId",
    name: "Consider Requirement",
    component: () => import("@/views/data_center/ConsiderRequirement.vue")
  },
  {
    path: "/data-center/list-check-out",
    name: "List Check-out",
    component: () => import("@/views/data_center/ListCheckOut.vue")
  },
  {
    path: "/data-center/check-out/:processId",
    name: "Check-out",
    component: () => import("@/views/data_center/CheckOut.vue")
  },
  {
    path: "/data-center/list-review",
    name: "List Entering Data Center Review",
    component: () => import("@/views/data_center/ListReview.vue")
  },
  {
    path: "/data-center/review/:processId",
    name: "Entering Data Center Review",
    component: () => import("@/views/data_center/Review.vue")
  }
];
