export default [{
    path: "/data-center/reserve",
    name: "Reserve",
    component: () =>
        import ("@/views/data_center/reserve/Reserve.vue"),
    meta: {
        requiresAuth: false
    }
}, ]