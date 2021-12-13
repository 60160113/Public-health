<template>
  <div>
    <CCard>
      <CCardHeader>
        <h4>Document Controller</h4>
      </CCardHeader>
      <CCardBody>
        <CRow>
          <!-- Hard Copy -->
          <CCol
            ><h5 class="text-primary">Hard Copy</h5>
            <br />
            <CInputCheckbox
              class="mt-1"
              v-for="(option, index) in hard_copy_options"
              :key="index"
              :label="option"
              :value="option"
              custom
              @update:checked="onHardCopyChecked"
          /></CCol>
          <!-- Soft Copy -->
          <CCol>
            <h5 class="text-primary">Soft Copy</h5>
            <br />
            <CInputCheckbox
              class="mt-1"
              v-for="(option, index) in soft_copy_options"
              :key="index"
              :label="option"
              :value="option"
              custom
              @update:checked="onSoftCopyChecked"
            />
          </CCol>
        </CRow>
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

export default {
  data() {
    return {
      form: {
        DC_name: user.fullname,
        hard_copy_list: "",
        soft_copy_list: "",
        DC_date: new Date(),

        process_name: "Complete",
      },

      handler: {
        hard_copy_list: [],
        soft_copy_list: [],
      },

      hard_copy_options: [
        "ปรับเอกสาร Master List",
        "แจ้งให้ผู้ที่เกี่ยวข้องทราบ",
        "จัดเก็บเอกสาร",
        "เรียกคืนเอกสาร (เรียกเก็บเอกสารเดิม)",
      ],

      soft_copy_options: [
        "นำเอกสารเดิมออกจากโฟลเดอร์ Current ไปไว้ที่โฟลเดอร์ Obsoleted",
        "นำเอกสารจากโฟลเดอร์ Draft ไปไว้ที่โฟลเดอร์ Current",
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
        Object.keys(this.handler).forEach((key) => {
          this.form[key] = this.handler[key].toString();
        });

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
    onHardCopyChecked(value, event) {
      if (value) {
        this.handler.hard_copy_list.push(event.target.value);
      } else {
        this.handler.hard_copy_list.forEach((item, index) => {
          if (item === event.target.value) {
            this.handler.hard_copy_list.splice(index, 1);
          }
        });
      }
    },
    onSoftCopyChecked(value, event) {
      if (value) {
        this.handler.soft_copy_list.push(event.target.value);
      } else {
        this.handler.soft_copy_list.forEach((item, index) => {
          if (item === event.target.value) {
            this.handler.soft_copy_list.splice(index, 1);
          }
        });
      }
    },
  },
};
</script>