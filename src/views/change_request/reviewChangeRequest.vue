<template>
  <div>
    <CCard>
      <CCardHeader>
        <strong class="text-primary"
          >แบบขออนุมัติดำเนินการเปลี่ยนแปลง (Change Request Form)</strong
        >
      </CCardHeader>

      <CCardBody>
        <CRow>
          <CCol sm="12">
            <p>
              <strong class="text-primary">
                ส่วนที่ 1 รายละเอียดการขออนุมัติดำเนินการเปลี่ยนแปลง</strong
              >
            </p>
          </CCol>
          <CCol sm="12">
            <CRow>
              <CCol sm="3">ผู้ร้องขอ</CCol>
              <CCol sm="9">{{ form.requester }}</CCol>
            </CRow>
          </CCol>
          <CCol sm="12">
            <CRow class="mt-2">
              <CCol sm="3">วันที่ร้องขอ</CCol>
              <CCol sm="9">{{ form.dateCreated }}</CCol>
            </CRow>
          </CCol>
          <CCol sm="12">
            <CRow class="mt-2">
              <CCol sm="3">มีความประสงค์ขอเปลี่ยนแปลงเรื่อง</CCol>
              <CCol sm="9">{{ form.subject }}</CCol>
            </CRow>
          </CCol>
          <CCol sm="12">
            <CRow class="mt-2">
              <CCol sm="3">เหตุผลที่ขอเปลี่ยนแปลง</CCol>
              <CCol sm="9">{{ form.reason }}</CCol>
            </CRow>
          </CCol>
        </CRow>
        <CRow>
          <CCol sm="12">
            <CRow class="mt-2">
              <CCol col="3">
                <label style="margin-top: 6px">วันที่เริ่มดำเนินการ</label>
              </CCol>
              <CCol
                ><v-date-picker
                  :min-date="new Date()"
                  mode="date"
                  :masks="{
                    input: 'DD/MM/YYYY',
                  }"
                  v-model="form.startDateTime"
              /></CCol>
            </CRow>
            <CRow class="mt-3 mb-3">
              <CCol col="3">
                <label style="margin-top: 6px">วันที่คาดว่าแล้วเสร็จ</label>
              </CCol>
              <CCol
                ><v-date-picker
                  :min-date="new Date()"
                  mode="date"
                  :masks="{
                    input: 'DD/MM/YYYY',
                  }"
                  v-model="form.endDateTime"
              /></CCol>
            </CRow>
          </CCol>
          <CCol sm="12">
            <CSelect
              label="ประเภทของการเปลี่ยนแปลง"
              placeholder="กรุณาเลือกประเภทของการเปลี่ยนแปลง"
              :value.sync="form.changeType"
              horizontal
              :options="changeTypeList"
            />
          </CCol>
          <CCol sm="12">
            <CRow>
              <CCol sm="3">ระบบที่เกี่ยวข้อง</CCol>
              <CCol sm="9">
                <ul>
                  <li
                    :key="index"
                    v-for="(val, index) in form.relatedSystem.split(',')"
                  >
                    {{ val }}
                  </li>
                </ul>
              </CCol>
            </CRow>
          </CCol>
          <CCol sm="12">
            <CInput
              disabled
              label="เอกสารที่แนบมาด้วย"
              v-model="form.attachment"
              horizontal
            />
          </CCol>
        </CRow>
        <CTextarea
          label="รายละเอียดการเปลี่ยนแปลง"
          horizontal
          v-model="form.detail"
        />
        <CTextarea
          label="ผลกระทบจากการเปลี่ยนแปลง"
          horizontal
          v-model="form.effect"
        />
        <CTextarea
          label="แนวทาง / ขั้นตอนการดำเนินงาน"
          horizontal
          v-model="form.operation"
        />
      </CCardBody>
      <CCardFooter>
        <CButton color="success" @click="submit()">บันทึก</CButton>
      </CCardFooter>
    </CCard>

    <CElementCover :opacity="0.8" v-if="loading" />
  </div>
</template>

<script>
import { jogetService } from "@/helpers/joget-helper";
import { authHeader } from "@/helpers/auth-header";
import { DatePicker } from "v-calendar";

import axios from "axios";

export default {
  components: {
    "v-date-picker": DatePicker,
    jogetService,
    authHeader,
  },
  data() {
    return {
      axiosOptions: {
        headers: authHeader(),
      },
      infoAuth: [],

      loading: false,
      form: {
        id: "",
        changeRequestId: "",
        subject: "",
        reason: "",
        modiflyBy: "",
        processId: "",
        processName: "",
        startDateTime: new Date(),
        endDateTime: new Date(),
        changeType: "",
        relatedSystem: "",
        attachment: "",
        detail: "",
        effect: "",
        operation: "",
        requester: "",
        teamLeader: "",
        assignTo: "",
      },
      changeTypeList: [
        { value: "Minor", label: "Minor" },
        { value: "Major", label: "Major" },
        { value: "Emergency", label: "Emergency" },
      ],
      relatedSystemList: [
        { value: "pc", label: "PC" },
        { value: "network", label: "Network" },
        { value: "server", label: "Server" },
        { value: "systemSoftware", label: "System Software" },
        { value: "applicationSoftware", label: "Application Software" },
        { value: "storage", label: "Storage" },
        { value: "security", label: "Security" },
        { value: "other", label: "other" },
      ],
      attachmentList: [
        { value: "rollback", label: "Rollback Plan" },
        { value: "other", label: "other" },
      ],
    };
  },
  created() {
    this.getChangeRequest();
    this.form.changeRequestId = this.$route.query.data;
  },
  methods: {
    async getChangeRequest() {
      const searchData = [
        {
          paramName: "changeRequestStatus",
          paramValue: "active",
        },
        {
          paramName: "changeRequestId",
          paramValue: this.form.changeRequestId,
        },
        {
          paramName: "processName",
          paramValue: "รอตรวจสอบ",
        },
      ];
      await jogetService
        .list("mophApp", "list_moph_change_request", searchData)
        .then((res) => {
          this.form = res.data.data[0];
          this.form.processName = "รออนุมัติ";
        });
    },
    async submit() {
      this.loading = true;
      // submit
      var axiosData = {
        app: {
          appId: "mophApp",
          formId: "moph_change_request",
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
          processId: this.form.processId,
        },
        this.axiosOptions
      );

      await axios.post(
        `${process.env.VUE_APP_BACKEND_URL}/process/completeWithVariable`,
        {
          activityId: viewProcess.data.activityId,
          variables: [
            {
              paramName: "type",
              paramValue: this.form.changeType.toLowerCase(),
            },
          ],
        },
        this.axiosOptions
      );
      this.loading = false;
      this.changeRequestMain();
    },
    changeRequestMain() {
      this.$router.push({ name: "changeRequest" });
    },
  },
};
</script>
