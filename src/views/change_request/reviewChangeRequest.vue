<template>
  <div>
    <CCard>
      <CCardHeader>
        <strong class="text-primary"
          >พิจารณาแบบฟอร์มขออนุมัติดำเนินการเปลี่ยนแปลง</strong
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
              <CCol sm="3">วันที่ร้องขอ</CCol>
              <CCol sm="9">ฟหกหฟกฟหก</CCol>
            </CRow>
          </CCol>
          <CCol sm="12">
            <CRow>
              <CCol sm="3">มีความประสงค์ขอเปลี่ยนแปลงเรื่อง</CCol>
              <CCol sm="9">ฟหกหฟกฟหก</CCol>
            </CRow>
          </CCol>
          <CCol sm="12">
            <CRow>
              <CCol sm="3">เหตุผลที่ขอเปลี่ยนแปลง</CCol>
              <CCol sm="9">ฟหกหฟกฟหก</CCol>
            </CRow>
          </CCol>
        </CRow>
        <CRow>
          <CCol sm="12">
            <CInput
              label="วันที่เริ่มดำเนินการ"
              horizontal
              v-model="newChangeRequest.startDateTime"
            ></CInput>
          </CCol>
          <CCol sm="12">
            <CInput
              label="วันที่คาดว่าแล้วเสร็จ"
              horizontal
              v-model="newChangeRequest.endDateTime"
            ></CInput>
          </CCol>
          <CCol sm="12">
            <CSelect
              label="ประเภทของการเปลี่ยนแปลง"
              placeholder="กรุณาเลือกประเภทของการเปลี่ยนแปลง"
              :value.sync="newChangeRequest.changeType"
              horizontal
              :options="changeTypeList"
            />
          </CCol>
          <CCol sm="12">
            <CSelect
              label="ระบบที่เกี่ยวข้อง"
              placeholder="กรุณาเลือกระบบที่เกี่ยวข้อง"
              :value.sync="newChangeRequest.relatedSystem"
              horizontal
              :options="relatedSystemList"
            />
          </CCol>
          <CCol sm="12">
            <CSelect
              label="เอกสารที่แนบมาด้วย"
              placeholder="กรุณาเลือกเอกสารที่แนบมาด้วย"
              :value.sync="newChangeRequest.attachment"
              horizontal
              :options="attachmentList"
            />
          </CCol>
        </CRow>
        <CRow> </CRow>
      </CCardBody>
    </CCard>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ChangeRequestList: [],
      newChangeRequest: {
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
      ]
    };
  }
};
</script>
