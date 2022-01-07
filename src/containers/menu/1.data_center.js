export default [
    {
      _name: "CSidebarNavTitle",
      _children: ["Data Center"]
    },
    {
      _name: "CSidebarNavItem",
      name: "รายการทั้งหมด",
      to: "/data-center/list-all",
      icon: "cilLayers"
    },
    {
      _name: "CSidebarNavItem",
      name: "เช็คอิน",
      to: "/data-center/check-in",
      icon: "cilLocationPin"
    },
    {
      _name: "CSidebarNavItem",
      name: "งานของฉัน",
      to: "/data-center/view-tasks",
      icon: "cilInbox"
    }
]