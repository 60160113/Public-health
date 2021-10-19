<template>
  <div>
    <CCard>
      <CCardHeader>
        <h4>ความเห็นของ ISMR</h4>
      </CCardHeader>
      <CCardBody>
        <CTextarea
          horizontal
          label="ความเห็นของ ISMR"
          v-model="form.ISMR_opinion"
        />

        <CButton block color="primary" class="mt-3" @click.prevent="submit()"
          >บันทึก</CButton
        >
      </CCardBody>
    </CCard>
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
        ISMR_opinion: "",
        ISMR_opinion_date: new Date(),

        ISMR_name: user.fullname,
      },

      loading: false,

      axiosOptions: {
        headers: authHeader(),
      },
    };
  },
  methods: {
    async submit() {
      try {
        this.loading = true;

        // submit
        var axiosData = {
          app: {
            appId: "mophApp",
            formId: "information_security_incident",
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
        this.$router.push("/information_security_incident");
      } catch (error) {
        this.loading = false;
      }
    },
  },
};
</script>