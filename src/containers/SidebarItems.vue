<script>
import menu from "./menu";
export default {
  name: "nav",
  data() {
    return {
      menu: menu,
    };
  },
  computed: {
    sidebarItems() {
      return [
        {
          _name: "CSidebarNav",
          _children: this.menu,
        },
      ];
    },
  },
};
</script>
