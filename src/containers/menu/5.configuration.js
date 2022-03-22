export default [
  {
    _name: "CSidebarNavTitle",
    _children: ["Configuration"]
  },
  {
    _name: "CSidebarNavItem",
    name: "วัตถุประสงค์",
    to: "/configuration/data_center/objectives",
    icon: "cil-circle"
  },
  {
    _name: "CSidebarNavItem",
    name: "หมายเลขบัตรเข้าอาคาร",
    to: "/configuration/data_center/building_cards",
    icon: "cil-circle"
  },
  {
    _name: "CSidebarNavItem",
    name: "หมายเลขบัตรเข้าศูนย์ปฏิบัติการ",
    to: "/configuration/data_center/data_center_cards",
    icon: "cil-circle"
  }
];
