// data center
const data_center = [{
        path: "/configuration/data_center/objectives",
        name: "Data center objectives",
        component: () =>
            import ("@/views/configuration/data_center/Objectives.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/configuration/data_center/building_cards",
        name: "Data center building card numbers",
        component: () =>
            import ("@/views/configuration/data_center/BuildingCards.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/configuration/data_center/data_center_cards",
        name: "Data center card numbers",
        component: () =>
            import ("@/views/configuration/data_center/DataCenterCards.vue"),
        meta: {
            requiresAuth: true
        }
    }
]

// change request
const change_request = [{
        path: "/configuration/change_request/reasons",
        name: "Change Request Reasons",
        component: () =>
            import ("@/views/configuration/change_request/Reasons.vue"),
        meta: {
            requiresAuth: true
        }
    }, {
        path: "/configuration/change_request/related-systems",
        name: "Change Request Related Systems",
        component: () =>
            import ("@/views/configuration/change_request/RelatedSystems.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/configuration/change_request/attachments",
        name: "Change Request Attachments",
        component: () =>
            import ("@/views/configuration/change_request/Attachments.vue"),
        meta: {
            requiresAuth: true
        }
    },
]

export default [
    ...data_center,
    ...change_request
];