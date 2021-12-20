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
            <CRow class="mt-2">
              <CCol sm="4">ผู้ร้องขอ</CCol>
              <CCol sm="8">{{ changeRequestList.requester }}</CCol>
            </CRow>
          </CCol>
          <CCol sm="12">
            <CRow class="mt-2">
              <CCol sm="4">วันที่ร้องขอ</CCol>
              <CCol sm="8"
                >{{
                  new Date(changeRequestList.dateCreated).toLocaleDateString()
                }}&nbsp;{{
                  new Date(changeRequestList.dateCreated).toLocaleTimeString()
                }}</CCol
              >
            </CRow>
          </CCol>
          <CCol sm="12">
            <CRow class="mt-2">
              <CCol sm="4">มีความประสงค์ขอเปลี่ยนแปลงเรื่อง</CCol>
              <CCol sm="8">{{ changeRequestList.subject }}</CCol>
            </CRow>
          </CCol>
          <CCol sm="12">
            <CRow class="mt-2">
              <CCol sm="4">เหตุผลที่ขอเปลี่ยนแปลง</CCol>
              <CCol sm="8">{{ changeRequestList.reason }}</CCol>
            </CRow>
          </CCol>
          <CCol sm="12">
            <CRow class="mt-2">
              <CCol sm="4">วันที่เริ่มดำเนินการ</CCol>
              <CCol sm="8">{{
                new Date(changeRequestList.startDateTime).toLocaleDateString()
              }}</CCol>
            </CRow>
          </CCol>
          <CCol sm="12">
            <CRow class="mt-2">
              <CCol sm="4">วันที่คาดว่าแล้วเสร็จ</CCol>
              <CCol sm="8">{{
                new Date(changeRequestList.endDateTime).toLocaleDateString()
              }}</CCol>
            </CRow>
          </CCol>
          <CCol sm="12">
            <CRow class="mt-2">
              <CCol sm="4">ประเภทของการเปลี่ยนแปลง</CCol>
              <CCol sm="8">{{ changeRequestList.changeType }}</CCol>
            </CRow>
          </CCol>
          <CCol sm="12">
            <CRow class="mt-2">
              <CCol sm="4">ระบบที่เกี่ยวข้อง</CCol>
              <CCol sm="8">{{ changeRequestList.relatedSystem }}</CCol>
            </CRow>
          </CCol>
          <CCol sm="12">
            <CRow class="mt-2">
              <CCol sm="4">เอกสารที่แนบมาด้วย</CCol>
              <CCol sm="8">{{ changeRequestList.attachment }}</CCol>
            </CRow>
          </CCol>
          <CCol sm="12">
            <CRow class="mt-2">
              <CCol sm="4">รายละเอียดการเปลี่ยนแปลง</CCol>
              <CCol sm="8">{{ changeRequestList.detail }}</CCol>
            </CRow>
          </CCol>
          <CCol sm="12">
            <CRow class="mt-2">
              <CCol sm="4">ผลกระทบจากการเปลี่ยนแปลง</CCol>
              <CCol sm="8">{{ changeRequestList.effect }}</CCol>
            </CRow>
          </CCol>
          <CCol sm="12">
            <CRow class="mt-2">
              <CCol sm="4">แนวทาง / ขั้นตอนการดำเนินงาน</CCol>
              <CCol sm="8">{{ changeRequestList.operation }}</CCol>
            </CRow>
          </CCol>
        </CRow>
        <hr />
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
              <strong>ผลพิจารณาอนุมัติให้ดำเนินการ</strong>:
              {{ getConsiderStatus(considerComment.considerStatus) }}
            </p>
          </CCol>
          <CCol sm="12">
            <CRow>
              <CCol sm="12">
                <CTextarea
                  disabled
                  label="รายละเอียด"
                  v-model="considerComment.comment"
                />
                <b>ผู้รับรองผล: </b>&nbsp;{{ considerComment.considerName }}
              </CCol>
            </CRow>
          </CCol>
        </CRow>
        <hr />
        <CRow>
          <CCol sm="12">
            <p>
              <strong class="text-primary">
                ส่วนที่ 3 รายงานผลการดำเนินการเปลี่ยนแปลง
                (ผู้ดำเนินการเปลี่ยนแปลง)</strong
              >
            </p>
          </CCol>
          <CCol sm="12">
            <p>
              <strong>ผลดำเนินการ</strong>:
              {{ getOperationStatus(successComment.operationStatus) }}
            </p>
          </CCol>
          <CCol sm="12">
            <CRow>
              <CCol sm="12">
                <CTextarea
                  disabled
                  label="รายละเอียด"
                  v-model="successComment.operationDetail"
                />
                <b>ผู้ดำเนินการการเปลี่ยนแปลง: </b>&nbsp;{{
                  successComment.changeOperator
                }}
              </CCol>
            </CRow>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
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
      considerComment: {},
      successComment: {},
    };
  },
  created() {
    // this.tableLoading = true;
    this.getChangeRequest();

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

          this.getConsider();
          this.getSuccess();
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
          this.considerComment = res.data.data[0];
        });
    },
    async getSuccess() {
      const searchData = [
        {
          paramName: "processId",
          paramValue: this.changeRequestList.processId,
        },
      ];
      await jogetService
        .list("mophApp", "list_moph_change_request_success", searchData)
        .then((res) => {
          this.successComment = res.data.data[0];
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
                const variableData = [
                  {
                    paramName: "result",
                    paramValue: this.changeRequestSuccess.operationStatus,
                  },
                ];
                jogetService
                  .processCompleteWithVariable(
                    res.data.activityId,
                    variableData
                  )
                  .then((res) => {
                    this.changeRequestMain();
                  });
              });
            });
        });
    },
    getConsiderStatus(val) {
      switch (val) {
        case "reject":
          return "อนุมัติให้ดำเนินการและทดสอบ";
        case "nontest":
          return "อนุมัติให้ดำเนินการโดยไม่ต้องทดสอบ";
        default:
          return "อนุมัติให้ดำเนินการและทดสอบ";
      }
    },
    getOperationStatus(val) {
      switch (val) {
        case "success":
          return "ดำเนินการสำเร็จ";
        default:
          return "ดำเนินการไม่สำเร็จ";
      }
    },
    changeRequestMain() {
      this.$router.push({ name: "changeRequest" });
    },
  },
};
</script>
