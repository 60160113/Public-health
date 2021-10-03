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
                ส่วนที่ 3 รายงานผลการดำเนินการเปลี่ยนแปลง
                (ผู้ดำเนินการเปลี่ยนแปลง)</strong
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
      </CCardBody>
      <CCardFooter>
        <CCard body-wrapper>
          <CRow>
            <CCol>
              <template>
                <h5><strong>อนุมัติใบเบิก</strong></h5>
                <CRow form class="form-group">
                  <CCol lg="3" sm="3"><strong>เลือกอนุมัติ</strong></CCol>
                  <CInputRadio
                    horizontal
                    v-for="(option, optionKey) in optionsApprove"
                    :key="optionKey"
                    :label="option.label"
                    :value="option.value"
                    :inline="true"
                    :checked="
                      changeRequestApprove.approveStatus === option.value
                    "
                    @update:checked="
                      () => (changeRequestApprove.approveStatus = option.value)
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
                  label="เนื่องจาก"
                  rows="3"
                  horizontal
                  :lazy="false"
                  v-model="changeRequestApprove.comment"
                  v-if="changeRequestApprove.approveStatus == 'fail'"
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
                  v-model="changeRequestApprove.comment"
                />
              </strong>
            </CCol>
          </CRow>
          <CButton
            class="mb-3"
            size="sm"
            color="success"
            block
            @click="reviewApprove()"
            >บันทึก</CButton
          >
        </CCard>
      </CCardFooter>
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
    authHeader
  },
  data() {
    return {
      axiosOptions: {
        headers: authHeader()
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
        assignTo: ""
      },
      changeTypeList: [
        { value: "minor", label: "Minor" },
        { value: "major", label: "Major" },
        { value: "emergency", label: "Emergency" }
      ],
      relatedSystemList: [
        { value: "pc", label: "PC" },
        { value: "network", label: "Network" },
        { value: "server", label: "Server" },
        { value: "systemSoftware", label: "System Software" },
        { value: "applicationSoftware", label: "Application Software" },
        { value: "storage", label: "Storage" },
        { value: "security", label: "Security" },
        { value: "other", label: "other" }
      ],
      attachmentList: [
        { value: "rollback", label: "Rollback Plan" },
        { value: "other", label: "other" }
      ],
      changeRequestApprove: {
        processId: "",
        approveName: "",
        approveStatus: "",
        comment: ""
      },
      optionsApprove: [
        { value: "success", label: "ดำเนินการสำเร็จ" },
        {
          value: "fail",
          label: "ดำเนินการไม่สำเร็จ (โปรดระบุสาเหตุและการดำเนินงาน)"
        }
      ]
    };
  },
  created() {
    // this.tableLoading = true;
    // this.infoAuth = JSON.parse(localStorage.getItem("AuthUser"));
    // this.newChangeRequest.createBy = this.infoAuth.fullname;
    // this.newChangeRequest.modiflyBy = this.infoAuth.fullname;
    // this.editChangeRequest.modiflyBy = this.infoAuth.fullname;
    this.getChangeRequest();
    this.newChangeRequest.changeRequestId = this.$route.query.data;
  },
  methods: {
    async getChangeRequest() {
      const searchData = [
        {
          paramName: "changeRequestStatus",
          paramValue: "active"
        },
        {
          paramName: "changeRequestId",
          paramValue: this.newChangeRequest.changeRequestId
        }
      ];
      await jogetService
        .list("mophApp", "list_moph_change_request", searchData)
        .then(res => {
          this.changeRequestList = res.data.data[0];
          this.newChangeRequest = res.data.data[0];
          this.newChangeRequest.processName = "รออนุมัติ";
          console.log(this.newChangeRequest);
        });
    },
    async changeRequestCreate() {
      console.log("this.newChangeRequest", this.newChangeRequest);
      if (this.newChangeRequest.changeType == "minor") {
        this.newChangeRequest.assignTo = "หัวหน้าทีมนั้นๆ";
      } else if (this.newChangeRequest.changeType == "major") {
        this.newChangeRequest.assignTo = "หัวหน้าทีม";
      } else if (this.newChangeRequest.changeType == "emergency") {
        this.newChangeRequest.assignTo = "ผู้บริหาร";
      }

      await jogetService
        .formSubmit(
          "mophApp",
          "moph_change_request",
          this.newChangeRequest.id,
          this.newChangeRequest
        )
        .then(res => {});
    }
  }
};
</script>
