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
    path: "/document_control/IST_secretary_review/:id/:process_id",
    name: "IST Secretary Review",
    component: () => import("@/views/document_control/ISTSecretaryReview.vue")
  },
  {
    path: "/document_control/ISM_approve/:id/:process_id",
    name: "ISM Approve",
    component: () => import("@/views/document_control/ISMApprove.vue")
  },
  {
    path: "/document_control/edit_document/:id/:process_id",
    name: "Edit document",
    component: () => import("@/views/document_control/EditDocument.vue")
  },
  {
    path: "/document_control/ISMR_approve/:id/:process_id",
    name: "ISMR Approve",
    component: () => import("@/views/document_control/ISMRApprove.vue")
  },
  {
    path: "/document_control/DC_review/:id/:process_id",
    name: "Document Control Review",
    component: () => import("@/views/document_control/DCReview.vue")
  },
  {
    path: "/files/:id",
    name: "Files",
    component: () => import("@/views/document_control/file/File.vue")
  }
];
