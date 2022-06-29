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
            <CRow>
              <CCol sm="3">วันที่ร้องขอ</CCol>
              <CCol sm="9">{{ form.dateCreated }}</CCol>
            </CRow>
          </CCol>
          <CCol sm="12">
            <CRow>
              <CCol sm="3">มีความประสงค์ขอเปลี่ยนแปลงเรื่อง</CCol>
              <CCol sm="9">{{ form.subject }}</CCol>
            </CRow>
          </CCol>
          <CCol sm="12">
            <CRow>
              <CCol sm="3">เหตุผลที่ขอเปลี่ยนแปลง</CCol>
              <CCol sm="9">{{ form.reason }}</CCol>
            </CRow>
          </CCol>
          <CCol sm="12">
            <CRow>
              <CCol sm="3">วันที่เริ่มดำเนินการ</CCol>
              <CCol sm="9">{{ form.startDateTime }}</CCol>
            </CRow>
          </CCol>
          <CCol sm="12">
            <CRow>
              <CCol sm="3">วันที่คาดว่าแล้วเสร็จ</CCol>
              <CCol sm="9">{{ form.endDateTime }}</CCol>
            </CRow>
          </CCol>
          <CCol sm="12">
            <CRow>
              <CCol sm="3">ประเภทของการเปลี่ยนแปลง</CCol>
              <CCol sm="9">{{ form.changeType }}</CCol>
            </CRow>
          </CCol>
          <CCol sm="12">
            <CRow>
              <CCol sm="3">ระบบที่เกี่ยวข้อง</CCol>
              <CCol sm="9">{{ form.relatedSystem }}</CCol>
            </CRow>
          </CCol>
          <CCol sm="12">
            <CRow>
              <CCol sm="3">เอกสารที่แนบมาด้วย</CCol>
              <CCol sm="9">{{ form.attachment }}</CCol>
            </CRow>
          </CCol>
          <CCol sm="12">
            <CRow>
              <CCol sm="3">รายละเอียดการเปลี่ยนแปลง</CCol>
              <CCol sm="9">{{ form.detail }}</CCol>
            </CRow>
          </CCol>
          <CCol sm="12">
            <CRow>
              <CCol sm="3">ผลกระทบจากการเปลี่ยนแปลง</CCol>
              <CCol sm="9">{{ form.effect }}</CCol>
            </CRow>
          </CCol>
          <CCol sm="12">
            <CRow>
              <CCol sm="3">แนวทาง / ขั้นตอนการดำเนินงาน</CCol>
              <CCol sm="9">{{ form.operation }}</CCol>
            </CRow>
          </CCol>
        </CRow>
      </CCardBody>
      <CCardFooter>
        <CRow>
          <CCol sm="12">
            <p>
              <strong class="text-primary">
                ส่วนที่ 2 การพิจารณาอนุมัติการเปลี่ยนแปลง</strong
              >
            </p>
          </CCol>
          <CCol>
            <template>
              <p><strong>ผลพิจารณาอนุมัติให้ดำเนินการ</strong></p>
              <CRow form class="form-group">
                <CCol lg="3" sm="3"><strong>เลือก</strong></CCol>
                <CInputRadio
                  horizontal
                  v-for="(option, optionKey) in optionsConsider"
                  :key="optionKey"
                  :label="option.label"
                  :value="option.value"
                  :inline="true"
                  :checked="
                    changeRequestConsider.considerStatus === option.value
                  "
                  @update:checked="
                    () => (changeRequestConsider.considerStatus = option.value)
                  "
                />
              </CRow>
            </template>
          </CCol>
        </CRow>
        <CRow>
          <CCol>
            <strong>
              <CTextarea
                label="ความคิดเห็น"
                placeholder="ช่องกรอกความคิดเห็น"
                rows="3"
                horizontal
                :lazy="false"
                v-model="changeRequestConsider.comment"
              />
            </strong>
          </CCol>
        </CRow>
        <CButton
          class="mb-3"
          size="sm"
          color="success"
          block
          @click="submit()"
          >บันทึก</CButton
        >
      </CCardFooter>
    </CCard>
        <CElementCover :opacity="0.8" v-if="loading">
      <h1 class="d-inline">Loading...</h1>
      <CSpinner size="5xl" color="success" />
    </CElementCover>
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
      changeRequestConsider: {
        processId: "",
        considerName: "",
        considerStatus: "",
        comment: "",
      },
      optionsConsider: [
        { value: "consider", label: "อนุมัติให้ดำเนินการและทดสอบ" },
        { value: "nontest", label: "อนุมัติให้ดำเนินการโดยไม่ต้องทดสอบ" },
        { value: "reject", label: "ไม่อนุมัติ" },
      ],
    };
  },
  created() {
    this.getChangeRequest();
    this.form.changeRequestId = this.$route.query.data;
    this.infoAuth = JSON.parse(localStorage.getItem("AuthUser"));
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
      //data
      this.changeRequestConsider.processId = this.form.processId;
      this.changeRequestConsider.considerName = this.infoAuth.fullname;

      // submit approve
      var axiosData = {
        app: {
          appId: "mophApp",
          formId: "moph_change_request_approve",
        },
        primaryKey: "",
        formData: this.changeRequestConsider,
      };

      await axios.post(
        `${process.env.VUE_APP_BACKEND_URL}/form/submit`,
        axiosData,
        this.axiosOptions
      );

      // submit
      var assignTo = "";
      var processName =
        this.changeRequestConsider.considerStatus == "reject"
          ? "เสร็จสิ้น"
          : "รอผลดำเนินการ";
      const formData = {
        processName: processName,
        assignTo: assignTo,
      };

      axiosData = {
        app: {
          appId: "mophApp",
          formId: "moph_change_request",
        },
        primaryKey: this.form.id,
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
              paramName: "change_approve",
              paramValue:
                this.changeRequestConsider.considerStatus == "reject"
                  ? "reject"
                  : "approve",
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
