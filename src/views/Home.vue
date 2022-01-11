<template>
  <div>
    <!-- Data Center -->
    <CCard>
      <CCardHeader
        ><strong class="text-primary">Data center</strong></CCardHeader
      >
      <CCardBody>
        <CRow>
          <CCol md="4">
            <CCard>
              <CCardHeader color="warning">
                <h4 style="color: white">จอง</h4></CCardHeader
              >
              <CCardBody
                ><CButton
                  @click="openPage('/data-center/reserve', true)"
                  color="primary"
                  >เปิดในแท็บใหม่</CButton
                ></CCardBody
              >
            </CCard>
          </CCol>
          <CCol md="4"
            ><CCard>
              <CCardHeader color="primary">
                <h4 style="color: white">เช็คอิน</h4></CCardHeader
              >
              <CCardBody
                ><CButton
                  @click="openPage('/data-center/check-in')"
                  color="primary"
                  >เปิด</CButton
                >&nbsp;<CButton
                  @click="openPage('/data-center/check-in', true)"
                  color="primary"
                  >เปิดในแท็บใหม่</CButton
                ></CCardBody
              >
            </CCard></CCol
          >
          <CCol md="4"
            ><CCard>
              <CCardHeader color="success">
                <h4 style="color: white">งานของฉัน</h4></CCardHeader
              >
              <CCardBody
                ><CButton
                  @click="openPage('/data-center/view-tasks')"
                  color="primary"
                  >เปิด</CButton
                >&nbsp;<CButton
                  @click="openPage('/data-center/view-tasks', true)"
                  color="primary"
                  >เปิดในแท็บใหม่</CButton
                ></CCardBody
              >
            </CCard></CCol
          >
          <CCol md="4">
            <CCard>
              <CCardHeader color="info">
                <h4 style="color: white">รายการทั้งหมด</h4></CCardHeader
              >
              <CCardBody
                ><CButton
                  @click="openPage('/data-center/list-all')"
                  color="primary"
                  >เปิด</CButton
                >&nbsp;<CButton
                  @click="openPage('/data-center/list-all', true)"
                  color="primary"
                  >เปิดในแท็บใหม่</CButton
                ></CCardBody
              >
            </CCard>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>

    <!-- Configuration -->
    <CCard>
      <CCardHeader
        ><strong class="text-primary">Configuration</strong></CCardHeader
      >
      <CCardBody>
        <CRow>
          <CCol md="4"
            ><CCard>
              <CCardHeader color="primary">
                <h4 style="color: white">วัตถุประสงค์</h4></CCardHeader
              >
              <CCardBody
                ><CButton
                  @click="openPage('/configuration/data_center/objectives')"
                  color="primary"
                  >เปิด</CButton
                >&nbsp;<CButton
                  @click="
                    openPage('/configuration/data_center/objectives', true)
                  "
                  color="primary"
                  >เปิดในแท็บใหม่</CButton
                ></CCardBody
              >
            </CCard></CCol
          >
        </CRow>
      </CCardBody>
    </CCard>
  </div>
</template>

<script>
export default {
  methods: {
    openPage(to, newTab = false) {
      if (newTab) {
        let routeData = this.$router.resolve(to);
        window.open(routeData.href, "_blank");
      } else {
        this.$router.push(to);
      }
    },
  },
};
</script>