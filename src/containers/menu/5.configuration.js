export default [{
        _name: "CSidebarNavTitle",
        _children: ["Configuration"]
    },
    // data center
    {
        _name: "CSidebarNavDropdown",
        name: "Data Center",
        icon: "cil-circle",
        items: [{
                _name: "CSidebarNavItem",
                name: "วัตถุประสงค์",
                to: "/configuration/data_center/objectives",
            },
            {
                _name: "CSidebarNavItem",
                name: "หมายเลขบัตรเข้าอาคาร",
                to: "/configuration/data_center/building_cards",
            },
            {
                _name: "CSidebarNavItem",
                name: "หมายเลขบัตรเข้าศูนย์ปฏิบัติการ",
                to: "/configuration/data_center/data_center_cards",
            }
        ]
    },
];