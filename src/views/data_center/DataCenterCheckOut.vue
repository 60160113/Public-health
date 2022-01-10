<template>
  <div>
    <PreviewData :id="$route.params.processId" />

    <CCard>
      <CCardHeader
        ><strong class="text-primary"
          >เช็คเอาท์ศูนย์ปฏิบัติการ</strong
        ></CCardHeader
      >
      <CCardFooter>
        <CButton
          block
          color="primary"
          :disabled="loading"
          @click.prevent="submit()"
          >บันทึก</CButton
        >
      </CCardFooter>
    </CCard>
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
  created() {
    const axiosData = {
      app: {
        appId: "mophApp",
        listId: "list_data_center",
      },
      search: [
        {
          paramName: "processId",
          paramValue: this.$route.params.processId,
        },
      ],
    };
    axios
      .post(
        `${process.env.VUE_APP_BACKEND_URL}/list/get`,
        axiosData,
        this.axiosOptions
      )
      .then((res) => {
        this.form.id = res.data.data[0].id;
      });
  },
  data() {
    return {
      loading: false,

      form: {
        id: "",

        processName: "Check Out",
      },

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
            formId: "data_center",
          },
          primaryKey: this.form.id,
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
            processId: this.$route.params.processId,
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
        this.$router.push("/data-center/view-tasks/");
      } catch (error) {
        this.loading = false;
      }
    },
  },
};
</script>