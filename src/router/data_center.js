export default [
  {
    path: "/data-center/list-all",
    name: "List All",
    component: () => import("@/views/data_center/ListAll.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/data-center/check-in",
    name: "Check-in",
    component: () => import("@/views/data_center/CheckIn.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/data-center/list-approve-permission",
    name: "List Approve Permission",
    component: () => import("@/views/data_center/ListApprovePermission.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/data-center/approve-permission/:processId",
    name: "Approve Permission",
    component: () => import("@/views/data_center/ApprovePermission.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/data-center/list-consider-requirement",
    name: "List Consider Requirement",
    component: () => import("@/views/data_center/ListConsiderRequirement.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/data-center/consider-requirement/:processId",
    name: "Consider Requirement",
    component: () => import("@/views/data_center/ConsiderRequirement.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/data-center/list-check-out",
    name: "List Check-out",
    component: () => import("@/views/data_center/ListCheckOut.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/data-center/check-out/:processId",
    name: "Check-out",
    component: () => import("@/views/data_center/CheckOut.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/data-center/list-review",
    name: "List Entering Data Center Review",
    component: () => import("@/views/data_center/ListReview.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/data-center/review/:processId",
    name: "Entering Data Center Review",
    component: () => import("@/views/data_center/Review.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/data-center/list-report",
    name: "List Entering Data Center Report",
    component: () => import("@/views/data_center/ListReport.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/data-center/view-report/:processId",
    name: "Entering Data Center Report",
    component: () => import("@/views/data_center/ViewReport.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/data-center/view-tasks",
    name: "Tasks - Data Center",
    component: () => import("@/views/data_center/Tasks.vue"),
    meta: {
      requiresAuth: true
    }
  }
];
