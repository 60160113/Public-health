<template>
  <div>
    <CCard>
      <CCardHeader>
        <h4>พิจารณาเอกสาร</h4>
      </CCardHeader>
       <CCardBody>
        <h5 class="text-primary">รับเอกสารร้องขอ</h5>
        <CInputCheckbox
          class="mt-3"
          label="รับเอกสารเรียบร้อยแล้ว"
          :value="true"
          custom
          @update:checked="onCheck"
        />
      </CCardBody>
    </CCard>
    <CButton
      :disabled="!form.received_document"
      style="width: 100%"
      color="primary"
      @click="submit"
      >บันทึก</CButton
    >
    <CElementCover :opacity="0.8" v-if="loading" />
  </div>
</template>

<script>
import { authHeader } from "@/helpers/auth-header";
import axios from "axios";

const user = JSON.parse(localStorage.getItem("AuthUser"));

export default {
  data() {
    return {
      form: {
        IST_secretary_name: user.fullname,
        received_document: false,
        IST_secretary_date: new Date(),

        process_name: "ISM Approve",
      },

      loading: false,

      axiosOptions: {
        headers: authHeader(),
      },
    };
  },
  methods: {
    onCheck(value) {
      this.form.received_document = value;
    },
    async submit() {
      try {
        this.loading = true;

        // submit
        var axiosData = {
          app: {
            appId: "mophApp",
            formId: "document_control",
          },
          primaryKey: this.$route.params.id,
          formData: this.form,
        };

        await axios.post(
          `${process.env.VUE_APP_BACKEND_URL}/form/submit`,
          axiosData,
          this.axiosOptions
        );

        // process/view
        const viewProcess = await axios.post(
          `${process.env.VUE_APP_BACKEND_URL}/process/view`,
          {
            processId: this.$route.params.process_id,
          },
          this.axiosOptions
        );

        await axios.post(
          `${process.env.VUE_APP_BACKEND_URL}/process/complete`,
          {
            activityId: viewProcess.data.activityId,
          },
          this.axiosOptions
        );
        this.loading = false;
        this.$router.push("/document_control");
      } catch (error) {
        this.loading = false;
      }
    },
  },
};
</script>