<template>
  <div>
    <PreviewData :id="$route.params.processId" />

    <CCard>
      <CCardHeader
        ><strong class="text-primary"
          >ติดต่อเข้าศูนย์ปฏิบัติการ</strong
        ></CCardHeader
      >
      <CCardBody>
        <CInput
          label="หมายเลขบัตร เข้า-ออกศูนย์ปฏิบัติการ"
          v-model="form.data_center_card"
        />
        <CTextarea label="ความคิดเห็น" v-model="form.IST_comment" />
      </CCardBody>
      <CCardFooter>
        <div class="float-right">
          <CButton
            color="success"
            :disabled="loading"
            @click="
              form.IST_approve = 'approve';
              submit();
            "
            >บันทึก</CButton
          >&nbsp;
          <CButton
            color="danger"
            :disabled="loading"
            @click="
              form.IST_approve = 'reject';
              submit();
            "
            >ยกเลิก</CButton
          >
        </div>
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
        IST_approve: "approve",
        IST_comment: "",
        IST_approve_date: new Date(),

        data_center_card: "",

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
        if (formData.IST_approve == "approve") {
          formData.processName = "Data Center Check Out";
        } else {
          formData.processName = "Check Out";
          formData.data_center_card = "";
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
                paramName: "IST_approve",
                paramValue: formData.IST_approve,
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