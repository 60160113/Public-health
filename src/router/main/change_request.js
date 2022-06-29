export default [{
        path: "/change_request/request",
        name: "Change Request",
        component: () =>
            import ("@/views/change_request/ChangeRequest.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/change_request/list",
        name: "Change Request List",
        component: () =>
            import ("@/views/change_request/List.vue"),
        meta: {
            requiresAuth: true
        }
    },
];