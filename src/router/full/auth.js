export default [{
        path: "login",
        name: "Login",
        component: () =>
            import ("@/views/pages/Login"),
        meta: {
            requiresAuth: false
        }
    },
    {
        path: "register",
        name: "Register",
        component: () =>
            import ("@/views/pages/Register"),
        meta: {
            requiresAuth: false
        }
    },
]