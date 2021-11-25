<template>
  <div>
    <CCard>
      <CCardHeader>
        <h4>การควบคุมเอกสาร</h4>
      </CCardHeader>
      <CCardBody>
        <h5 class="text-primary">คณะทำงานหรือผู้ร้องขอ</h5>
        <CRow class="mt-3">
          <CCol col="6">
            <CInput label="ชื่อ - สกุล" v-model="form.requester_name" />
          </CCol>

          <CCol col="6">
            <CInput label="ตำแหน่ง" v-model="form.requester_position" />
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        requester_name: "",
        requester_position: "",
      },
    };
  },
  methods: {},
};
</script>