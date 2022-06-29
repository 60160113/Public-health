export default [
  {
    path: "/document_control",
    name: "Document Control",
    component: () => import("@/views/document_control/index.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/document_control/add_document",
    name: "Add document",
    component: () => import("@/views/document_control/AddDocument.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/document_control/IST_secretary_review/:id/:process_id",
    name: "IST Secretary Review",
    component: () => import("@/views/document_control/ISTSecretaryReview.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/document_control/ISM_approve/:id/:process_id",
    name: "ISM Approve",
    component: () => import("@/views/document_control/ISMApprove.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/document_control/edit_document/:id/:process_id",
    name: "Edit document",
    component: () => import("@/views/document_control/EditDocument.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/document_control/ISMR_approve/:id/:process_id",
    name: "ISMR Approve",
    component: () => import("@/views/document_control/ISMRApprove.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/document_control/DC_review/:id/:process_id",
    name: "Document Control Review",
    component: () => import("@/views/document_control/DCReview.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/document_control/report/:id/:process_id",
    name: "Document Control Report",
    component: () => import("@/views/document_control/Report.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/files/:id",
    name: "Files",
    component: () => import("@/views/document_control/file/File.vue"),
    meta: {
      requiresAuth: true
    }
  }
];
