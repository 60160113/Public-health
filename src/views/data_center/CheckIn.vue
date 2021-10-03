<template>
  <div>
    <CCard>
      <CCardHeader>
        <strong class="text-primary">ติดต่อเข้าอาคาร</strong>
      </CCardHeader>

      <CCardBody>
        <CRow>
          <CCol col="6">
            <CInput horizontal label="ผู้ร้องขอ" v-model="form.requester" />
          </CCol>
          <CCol col="6">
            <CInput horizontal label="ตำแหน่ง" v-model="form.position" />
          </CCol>

          <CCol col="6">
            <CInput horizontal label="สังกัด" v-model="form.affiliation" />
          </CCol>
          <CCol col="6">
            <CInput
              horizontal
              label="เลขที่บัตรประชาชน"
              v-model="form.idcard"
            />
          </CCol>

          <CCol col="12">
            <CTextarea horizontal label="วัตถุประสงค์" v-model="form.purpose" />
          </CCol>

          <CCol col="6">
            <CInput
              horizontal
              label="หมายเลขบัตร เข้า-ออก"
              v-model="form.checkInCard"
            />
          </CCol>
          <CCol col="6">
            <CRow>
              <CCol col="3">
                <label style="margin-top: 6px">วันที่ส่งคืน</label>
              </CCol>
              <CCol
                ><v-date-picker
                  :min-date="new Date()"
                  mode="date"
                  :masks="{
                    input: 'DD/MM/YYYY',
                  }"
                  v-model="form.returnDate"
              /></CCol>
            </CRow>
          </CCol>
        </CRow>

        <CButton block color="primary" class="mt-3">บันทึก</CButton>
      </CCardBody>
    </CCard>
  </div>
</template>

<script>
import { DatePicker } from "v-calendar";
export default {
  components: {
    "v-date-picker": DatePicker,
  },
  data() {
    return {
      form: {
        requester: "",
        position: "",
        affiliation: "",
        idcard: "",
        purpose: "",
        date: new Date(),
        returnDate: null,
        checkInCard: "",
      },
    };
  },
};
</script>