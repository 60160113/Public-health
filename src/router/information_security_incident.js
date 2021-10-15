export default [
    {
      path: "/information_security_incident",
      name: "Information Security Incident",
      component: () => import("@/views/information_security_incident/index.vue")
    },
    {
      path: "/information_security_incident/inform",
      name: "Information Security Incident Inform",
      component: () => import("@/views/information_security_incident/AnalyzeIncident.vue")
    }
]