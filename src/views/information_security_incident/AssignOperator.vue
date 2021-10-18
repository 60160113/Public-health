<template>
  <div>
    <CCard>
      <CCardHeader>
        <h4>มอบหมายงาน</h4>
      </CCardHeader>
      <CCardBody>
        <CInput
          horizontal
          label="ชื่อ - สกุล ผู้ดำเนินการ"
          v-model="form.operator_name"
        />
        <CSelect
          label="รายละเอียด"
          placeholder="กรุณาเลือกรายละเอียด"
          :value.sync="variable.operator_assignment"
          horizontal
          :options="operator_assignment_options"
        />
        <CInput
          v-if="variable.operator_assignment === null"
          horizontal
          label="กรุณารายละเอียด"
          v-model="form.operator_assignment"
        />
        <CButton
          :disabled="disabled_button"
          block
          color="primary"
          class="mt-3"
          @click.prevent="assign()"
          >บันทึก</CButton
        >
      </CCardBody>
    </CCard>
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
        operator_name: "",
        operator_assignment: "",
        operator_assignment_date: new Date(),

        approver_name: user.fullname,

        process_name: "Solve Problem",
      },

      variable: {
        operator_assignment: "",
      },

      operator_assignment_options: [
        {
          value: "โปรดดำเนินการต่อไป",
          label: "โปรดดำเนินการต่อไป",
        },
        {
          value: null,
          label: "อื่น ๆ ",
        },
      ],

      loading: false,

      axiosOptions: {
        headers: authHeader(),
      },
    };
  },
  methods: {
    async assign() {
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
  watch: {
    "variable.operator_assignment": function (val) {
      if (!val) {
        this.form.operator_assignment = "";
      } else {
        this.form.operator_assignment = val;
      }
    },
  },
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