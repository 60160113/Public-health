export default [
  {
    path: "/change_request/changeRequest",
    name: "changeRequest",
    component: () => import("@/views/change_request/changeRequest.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/change_request/reviewChangeRequest",
    name: "reviewChangeRequest",
    component: () => import("@/views/change_request/reviewChangeRequest.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/change_request/ConsiderChangeRequest",
    name: "ConsiderChangeRequest",
    component: () => import("@/views/change_request/ConsiderChangeRequest.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/change_request/ApproveChangeRequest",
    name: "ApproveChangeRequest",
    component: () => import("@/views/change_request/ApproveChangeRequest.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/change_request/InfoChangeRequest",
    name: "InfoChangeRequest",
    component: () => import("@/views/change_request/InfoChangeRequest.vue"),
    meta: {
      requiresAuth: true
    }
  }
];
