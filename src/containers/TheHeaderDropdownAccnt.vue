<template>
  <CDropdown
    inNav
    class="c-header-nav-items"
    placement="bottom-end"
    add-menu-classes="pt-0"
  >
    <template #toggler>
      <CHeaderNavLink>
        <CButton size="sm" variant="outline" color="primary"
          ><CIcon name="cil-options"
        /></CButton>
      </CHeaderNavLink>
    </template>
    <CDropdownHeader tag="div" class="text-center" color="light">
      <strong>{{ user.fullname }}</strong>
    </CDropdownHeader>

    <CDropdownItem @click="logout">
      <CIcon name="cil-lock-locked" /> Logout
    </CDropdownItem>
  </CDropdown>
</template>

<script>
const user = JSON.parse(localStorage.getItem("AuthUser"));
export default {
  name: "TheHeaderDropdownAccnt",
  data() {
    return {
      itemsCount: 42,
      user: user,
    };
  },
  methods: {
    logout() {
      localStorage.removeItem("AuthUser");
      location.reload();
    },
  },
};
</script>

<style scoped>
.c-icon {
  margin-right: 0.3rem;
}
</style>