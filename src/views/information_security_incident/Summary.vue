<template>
  <div></div>
</template>

<script>
import { authHeader } from "@/helpers/auth-header";
import axios from "axios";

export default {
  data() {
    return {};
  },
  methods: {},
  computed: {
    disabled_button() {
      return (
        Object.values(this.form).filter((item) => item === "").length > 0 ||
        this.loading
      );
    },
  },
};
</script>