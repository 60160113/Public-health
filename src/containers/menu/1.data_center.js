export default [
  {
    _name: "CSidebarNavTitle",
    _children: ["Data Center"],
    restriction: [
      {
        key: "position",
        value: "IST,ISS,guard"
      }
    ]
  },
  {
    _name: "CSidebarNavItem",
    name: "รายการคำขอเข้าศูนย์ปฏิบัติการ",
    to: "/data-center/reserve/list",
    icon: "cilList"
  },
  {
    _name: "CSidebarNavItem",
    name: "ถาดงานศูนย์ปฏิบัติการ",
    to: "/data-center/check-in/list",
    icon: "cilLayers"
  }
];
