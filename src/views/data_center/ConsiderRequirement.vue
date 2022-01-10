<template>
  <div>
    <PreviewData :id="$route.params.processId" />

    <CCard>
      <CCardHeader
        ><strong class="text-primary"
          >พิจารณาความต้องการเข้าศูนย์ปฏิบัติการ</strong
        ></CCardHeader
      >
      <CCardBody>
        <label>ได้พิจารณาและตรวจสอบรายละเอียดของผู้ร้องขอแล้ว เห็นสมควร</label>
        <CInputRadioGroup
          :options="[
            { value: 'approve', label: 'อนุมัติ' },
            { value: 'reject', label: 'ไม่อนุมัติ' },
          ]"
          :checked.sync="form.ISM_approve"
          custom
          inline
        />
        <hr />
        <CTextarea label="ความคิดเห็น" v-model="form.ISM_comment" />
      </CCardBody>
      <CCardFooter
        ><CButton
          color="primary"
          block
          @click.prevent="submit"
          :disabled="loading"
          >บันทึก</CButton
        ></CCardFooter
      >
    </CCard>

    <CElementCover :opacity="0.8" v-if="loading" />
  </div>
</template>

<script>
import axios from "axios";
import { authHeader } from "@/helpers/auth-header";

import PreviewData from "@/views/data_center/components/PreviewData.vue";

const user = JSON.parse(localStorage.getItem("AuthUser"));
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
        ISM_name: user.fullname,
        ISM_approve: "approve",
        ISM_comment: "",
        ISM_approve_date: new Date(),

        processName: "",
        id: "",
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
        var formData = { ...this.form };
        if (formData.ISM_approve == "approve") {
          formData.processName = "Data Center Check In";
        } else {
          formData.processName = "Check Out";
        }

        var axiosData = {
          app: {
            appId: "mophApp",
            formId: "data_center",
          },
          primaryKey: formData.id,
          formData: formData,
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
          `${process.env.VUE_APP_BACKEND_URL}/process/completeWithVariable`,
          {
            activityId: viewProcess.data.activityId,
            variables: [
              {
                paramName: "ISM_approve",
                paramValue: formData.ISM_approve,
              },
            ],
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