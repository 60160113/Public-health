<template>
  <div>
    <CCard>
      <CCardHeader>
        <h4>ตรวจสอบ</h4>
      </CCardHeader>
      <CCardBody> </CCardBody>
    </CCard>
  </div>
</template>

<script>
import { authHeader } from "@/helpers/auth-header";
import axios from "axios";

export default {
  data() {
    return {
      loading: false,

      axiosOptions: {
        headers: authHeader(),
      },
    };
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