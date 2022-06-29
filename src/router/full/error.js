export default [{
        path: "404",
        name: "Page404",
        component: () =>
            import ("@/views/pages/Page404"),
        meta: {
            requiresAuth: false
        }
    },
    {
        path: "500",
        name: "Page500",
        component: () =>
            import ("@/views/pages/Page500"),
        meta: {
            requiresAuth: false
        }
    },
]