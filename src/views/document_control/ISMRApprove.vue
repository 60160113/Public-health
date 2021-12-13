<template>
  <div>
    <CCard>
      <CCardHeader>
        <h4>มติคณะกรรมการ</h4>
      </CCardHeader>
      <CCardBody>
        <h5 class="text-primary">
          คณะทำงานพิจารณาการจัดทำ/แก้ไข/ยกเลิกเอกสารในระบบ ISMS แล้ว
        </h5>
        <CInputRadioGroup
          class="mt-3"
          :options="verify_options"
          :checked.sync="verify"
          custom
          inline
        />

        <div v-if="verify !== 'approve'">
          <br />
          <CTextarea
            :label="verify == 'reject' ? 'สาเหตุ' : 'เพิ่มเติม'"
            v-model="form.ISMR_approve_reason"
          />
        </div>
      </CCardBody>
    </CCard>

    <CButton style="width: 100%" color="primary" @click="submit"
      >บันทึก</CButton
    >

    <CElementCover :opacity="0.8" v-if="loading" />
  </div>
</template>

<script>
import { authHeader } from "@/helpers/auth-header";
import axios from "axios";

const user = JSON.parse(localStorage.getItem("AuthUser"));

const $http = axios.create({
  headers: { Authorization: "Basic " + window.btoa(user.ticket) },
});
export default {
  data() {
    return {
      form: {
        ISMR_name: user.fullname,
        ISMR_approve: "อนุมัติการจัดทำ/แก้ไข/ยกเลิกเอกสาร ตามที่เสนอ",
        ISMR_approve_reason: "",
        ISMR_date: new Date(),
        process_name: "Document Control Review",
      },

      verify: "approve",

      verify_options: [
        {
          value: "approve",
          label: "อนุมัติการจัดทำ/แก้ไข/ยกเลิกเอกสาร ตามที่เสนอ",
        },
        { value: "approve;", label: "อนุมัติโดยให้แก้ไข/เพิ่มเติม" },
        { value: "reject", label: "ไม่อนุมัติ" },
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

        // data
        if (this.verify == "reject") {
          this.form.process_name = "Edit document";
          this.form["file_id"] = "";

          const dc_data = await axios.post(
            `${process.env.VUE_APP_BACKEND_URL}/list/getOne`,
            {
              app: {
                appId: "mophApp",
                listId: "list_document_control",
              },
              search: [
                {
                  paramName: "process_id",
                  paramValue: this.$route.params.process_id,
                },
              ],
            },
            this.axiosOptions
          );

          const dc = dc_data.data.data[0];

          if (dc.purpose_code != "CANCEL") {
            this.removeFile(dc.file_id);
          }
        }

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
          `${process.env.VUE_APP_BACKEND_URL}/process/completeWithVariable`,
          {
            activityId: viewProcess.data.activityId,
            variables: [
              {
                paramName: "ISMR_approve",
                paramValue: this.verify.replace(";", ""),
              },
            ],
          },
          this.axiosOptions
        );
        this.loading = false;
        this.$router.push("/document_control");
      } catch (error) {
        this.loading = false;
      }
    },
    removeFile(id) {
      return $http.delete(
        `${process.env.VUE_APP_ALF_API}alfresco/versions/1/nodes/${id}`
      );
    },
  },
  watch: {
    verify: function (val) {
      const index = this.verify_options.findIndex((item) => item.value == val);
      this.form.ISMR_approve = this.verify_options[index].label;

      if (val == "approve") {
        this.form.ISMR_approve_reason = "";
      }
    },
  },
};
</script>