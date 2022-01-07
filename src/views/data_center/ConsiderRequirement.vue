<template>
  <div>
    <PreviewData :id="$route.params.processId" />

    <CElementCover :opacity="0.8" v-if="loading" />
  </div>
</template>

<script>
import axios from "axios";
import { authHeader } from "@/helpers/auth-header";

import PreviewData from "@/views/data_center/components/PreviewData.vue";
export default {
  components: {
    PreviewData,
  },
  data() {
    return {
      loading: false,
      form: {
        ISM_name: "",
        ISM_approve: "",
        ISM_comment: "",
        ISM_approve_date: new Date(),

        processName: "",
      },

      axiosOptions: {
        headers: authHeader(),
      },
    };
  },
  methods: {
    async submit() {
      this.loading = true;

      // submit
      var formData = { ...this.form };

      const axiosData = {
        app: {
          appId: "mophApp",
          formId: "data_center",
        },
        primaryKey: this.$route.params.processId,
        formData: formData,
      };
      await axios
        .post(
          `${process.env.VUE_APP_BACKEND_URL}/form/submit`,
          axiosData,
          this.axiosOptions
        )
        .then(async () => {
          const processData = {
            processId: this.$route.params.processId,
          };
          await axios
            .post(
              `${process.env.VUE_APP_BACKEND_URL}/process/view`,
              processData,
              this.axiosOptions
            )
            .then(async (res) => {
              const activityId = res.data.activityId;
              const processData = {
                activityId: activityId,
                variables: [
                  {
                    paramName: "considerRequirementStatus",
                    paramValue: "approve",
                  },
                ],
              };
              await axios
                .post(
                  `${process.env.VUE_APP_BACKEND_URL}/process/completeWithVariable`,
                  processData,
                  this.axiosOptions
                )
                .then(() => {
                  this.loading = false;
                  this.$router.push("/data-center/view-tasks/");
                });
            });
        });
    },
  },
};
</script>