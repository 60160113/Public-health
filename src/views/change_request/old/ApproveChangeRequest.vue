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
              <CCol sm="9">{{ changeRequestList.requester }}</CCol>
            </CRow>
          </CCol>
          <CCol sm="12">
            <CRow>
              <CCol sm="3">วันที่ร้องขอ</CCol>
              <CCol sm="9">{{ changeRequestList.dateCreated }}</CCol>
            </CRow>
          </CCol>
          <CCol sm="12">
            <CRow>
              <CCol sm="3">มีความประสงค์ขอเปลี่ยนแปลงเรื่อง</CCol>
              <CCol sm="9">{{ changeRequestList.subject }}</CCol>
            </CRow>
          </CCol>
          <CCol sm="12">
            <CRow>
              <CCol sm="3">เหตุผลที่ขอเปลี่ยนแปลง</CCol>
              <CCol sm="9">{{ changeRequestList.reason }}</CCol>
            </CRow>
          </CCol>
          <CCol sm="12">
            <CRow>
              <CCol sm="3">วันที่เริ่มดำเนินการ</CCol>
              <CCol sm="9">{{ changeRequestList.startDateTime }}</CCol>
            </CRow>
          </CCol>
          <CCol sm="12">
            <CRow>
              <CCol sm="3">วันที่คาดว่าแล้วเสร็จ</CCol>
              <CCol sm="9">{{ changeRequestList.endDateTime }}</CCol>
            </CRow>
          </CCol>
          <CCol sm="12">
            <CRow>
              <CCol sm="3">ประเภทของการเปลี่ยนแปลง</CCol>
              <CCol sm="9">{{ changeRequestList.changeType }}</CCol>
            </CRow>
          </CCol>
          <CCol sm="12">
            <CRow>
              <CCol sm="3">ระบบที่เกี่ยวข้อง</CCol>
              <CCol sm="9">{{ changeRequestList.relatedSystem }}</CCol>
            </CRow>
          </CCol>
          <CCol sm="12">
            <CRow>
              <CCol sm="3">เอกสารที่แนบมาด้วย</CCol>
              <CCol sm="9">{{ changeRequestList.attachment }}</CCol>
            </CRow>
          </CCol>
          <CCol sm="12">
            <CRow>
              <CCol sm="3">รายละเอียดการเปลี่ยนแปลง</CCol>
              <CCol sm="9">{{ changeRequestList.detail }}</CCol>
            </CRow>
          </CCol>
          <CCol sm="12">
            <CRow>
              <CCol sm="3">ผลกระทบจากการเปลี่ยนแปลง</CCol>
              <CCol sm="9">{{ changeRequestList.effect }}</CCol>
            </CRow>
          </CCol>
          <CCol sm="12">
            <CRow>
              <CCol sm="3">แนวทาง / ขั้นตอนการดำเนินงาน</CCol>
              <CCol sm="9">{{ changeRequestList.operation }}</CCol>
            </CRow>
          </CCol>
        </CRow>
        <CRow>
          <CCol sm="12">
            <p>
              <strong class="text-primary">
                ส่วนที่ 2 การพิจารณาอนุมัติการเปลี่ยนแปลง</strong
              >
            </p>
          </CCol>
          <CCol sm="12">
            <p>
              <strong>ผลพิจารณาอนุมัติให้ดำเนินการ</strong>
            </p>
          </CCol>
          <CCol sm="12">
            <CRow>
              <CCol sm="12">
                <div v-for="item in considerComment" :key="item.id">
                  <div>
                    {{ item.considerName }} :
                    {{ item.comment }}
                  </div>
                </div></CCol
              >
            </CRow>
          </CCol>
        </CRow>
      </CCardBody>
      <CCardFooter>
        <CRow>
          <CCol sm="12">
            <p>
              <strong class="text-primary">
                ส่วนที่ 3 รายงานผลการดำเนินการเปลี่ยนแปลง
                (ผู้ดำเนินการเปลี่ยนแปลง)</strong
              >
            </p>
          </CCol>
          <CCol>
            <template>
              <CRow form class="form-group">
                <CCol lg="3" sm="3"><strong>เลือก</strong></CCol>
                <CInputRadio
                  horizontal
                  v-for="(option, optionKey) in optionsSuccess"
                  :key="optionKey"
                  :label="option.label"
                  :value="option.value"
                  :inline="true"
                  :checked="
                    changeRequestSuccess.operationStatus === option.value
                  "
                  @update:checked="
                    () => (changeRequestSuccess.operationStatus = option.value)
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
                v-if="changeRequestSuccess.operationStatus == 'fail'"
                label="เนื่องจาก"
                rows="3"
                horizontal
                :lazy="false"
                v-model="changeRequestSuccess.comment"
              />
            </strong>
          </CCol>
        </CRow>
        <CRow>
          <CCol>
            <strong>
              <CTextarea
                label="รายละเอียดการดำเนินงาน"
                rows="3"
                horizontal
                :lazy="false"
                v-model="changeRequestSuccess.operationDetail"
              />
            </strong>
          </CCol>
        </CRow>
        <CButton
          class="mb-3"
          size="sm"
          color="success"
          block
          @click="reviewSuccess()"
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
      loading: false,
      infoAuth: [],
      changeRequestList: [],
      newChangeRequest: {
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
      changeRequestSuccess: {
        processId: "",
        changeOperator: "",
        operationStatus: "",
        comment: "",
        operationDetail: "",
      },
      optionsSuccess: [
        { value: "success", label: "ดำเนินการสำเร็จ" },
        {
          value: "fail",
          label: "ดำเนินการไม่สำเร็จ (โปรดระบุสาเหตุและการดำเนินงาน)",
        },
      ],
      considerComment: [],
    };
  },
  created() {
    this.getChangeRequest();
    this.getConsider();
    this.newChangeRequest.changeRequestId = this.$route.query.data;
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
          paramValue: this.newChangeRequest.changeRequestId,
        },
      ];
      await jogetService
        .list("mophApp", "list_moph_change_request", searchData)
        .then((res) => {
          this.changeRequestList = res.data.data[0];
          this.newChangeRequest = res.data.data[0];
          this.newChangeRequest.processName = "เสร็จสิ้น";
        });
    },
    async getConsider() {
      const searchData = [
        {
          paramName: "processId",
          paramValue: this.changeRequestList.processId,
        },
      ];
      await jogetService
        .list("mophApp", "list_moph_change_request_approve", searchData)
        .then((res) => {
          this.considerComment = res.data.data;
        });
    },
    async reviewSuccess() {
      this.changeRequestSuccess.processId = this.newChangeRequest.processId;
      this.changeRequestSuccess.changeOperator = this.infoAuth.fullname;
      await jogetService
        .formSubmit(
          "mophApp",
          "moph_change_request_success",
          "",
          this.changeRequestSuccess
        )
        .then((res) => {
          var assignTo = "";
          var processName = "เสร็จสิ้น";
          const formData = {
            processName: processName,
            assignTo: assignTo,
          };
          jogetService
            .formSubmit(
              "mophApp",
              "moph_change_request",
              this.newChangeRequest.id,
              formData
            )
            .then((res) => {
              const processId = this.newChangeRequest.processId;
              jogetService.getCurrentActivity(processId).then((res) => {
                jogetService
                  .processComplete(res.data.activityId)
                  .then((res) => {
                    this.changeRequestMain();
                  });
              });
            });
        });
    },
    changeRequestMain() {
      this.$router.push({ name: "changeRequest" });
    },
  },
};
</script>
