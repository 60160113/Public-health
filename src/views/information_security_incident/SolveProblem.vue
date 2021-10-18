<template>
  <div>
    <CCard>
      <CCardHeader>
        <h4>แก้ไขปัญญา</h4>
      </CCardHeader>
      <CCardBody>
        <CTextarea
          horizontal
          label="รายละเอียดเหตุการณ์"
          v-model="form.solving_detail"
        />
        <CTextarea
          horizontal
          label="วิธีการแก้ไขเหตุการณ์ไม่พึงประสงค์"
          v-model="form.solving_solution"
        />
        <hr />

        <CSelect
          label="รายละเอียดการแก้ไขเบื้องต้น"
          placeholder="กรุณาเลือกรายละเอียด"
          :value.sync="form.inform_ISM_solving_preliminary"
          horizontal
          :options="solving_preliminary_options"
        />
        <CTextarea
          v-if="form.inform_ISM_solving_preliminary"
          horizontal
          label="รายละเอียด"
          v-model="form.inform_ISM_solving_preliminary_detail"
        />
        <hr />

        <CSelect
          label="รายละเอียดการแก้ไขถาวร"
          placeholder="กรุณาเลือกรายละเอียด"
          :value.sync="form.inform_ISM_solving_closed"
          horizontal
          :options="solving_closed_options"
        />
        <CTextarea
          v-if="form.inform_ISM_solving_closed"
          horizontal
          label="รายละเอียด"
          v-model="form.inform_ISM_solving_closed_detail"
        />

        <CButton
          :disabled="disabled_button"
          block
          color="primary"
          class="mt-3"
          @click.prevent="submit()"
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

export default {
  data() {
    return {
      form: {
        solving_detail: "",
        solving_solution: "",

        inform_ISM_solving_preliminary: "",
        inform_ISM_solving_preliminary_detail: "",

        inform_ISM_solving_closed: "",
        inform_ISM_solving_closed_detail: "",

        inform_ISM_date: new Date(),
        process_name: "Inspect",
      },

      solving_preliminary_options: [
        "ดำเนินการแก้ไขเบื้องต้นแล้ว เสร็จเวลา..............................น.",
        "อื่น ๆ ",
      ],

      solving_closed_options: [
        "ดำเนินการแก้ไขถาวรแล้ว (Closed)",
        "Lesson Learned (กรณีที่เป็นเหตุการณ์สำคัญ)",
        "อื่น ๆ ",
      ],

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