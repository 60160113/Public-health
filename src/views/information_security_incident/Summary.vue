<template>
  <div>
    <CCard>
      <CCardHeader>
        <h4>ตรวจสอบ</h4>
      </CCardHeader>
      <CCardBody>
        <CSelect
          label="เรียน ISMR"
          placeholder="กรุณาเลือกรายละเอียด"
          :value.sync="form.inform_ISMR"
          horizontal
          :options="inform_ISMR_options"
        />
        <CTextarea
          v-if="form.inform_ISMR"
          horizontal
          label="รายละเอียด"
          v-model="form.inform_ISMR_detail"
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
  </div>
</template>

<script>
import { authHeader } from "@/helpers/auth-header";
import axios from "axios";

export default {
  data() {
    return {
      form: {
        inform_ISMR: "",
        inform_ISMR_detail: "",

        inform_ISMR_date: new Date(),

        process_name: "Review",
      },

      inform_ISMR_options: [
        "รับทราบการดำเนินงาน และให้เจ้าหน้าที่จัดเก็บเอกสารเข้าแฟ้ม",
        "เสนอให้ ISMR พิจารณาการลงโทษ",
        "อื่น ๆ",
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