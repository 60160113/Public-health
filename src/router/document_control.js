export default [
    {
      path: "/document_control",
      name: "Document Control",
      component: () => import("@/views/document_control/index.vue")
    },
    {
      path: "/document_control/add_document",
      name: "Add document",
      component: () => import("@/views/document_control/AddDocument.vue")
    },
    {
      path: "/files/:id",
      name: "Files",
      component: () => import("@/views/document_control/file/File.vue")
    },
]