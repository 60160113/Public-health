<template>
  <div>
    <CCard>
      <CCardHeader color="primary">
        <h5 style="color: white"><b>Data center</b></h5>
      </CCardHeader>
      <CCardBody>
        <!-- Content -->
        <CRow>
          <CCol
            md="3"
            :key="index"
            v-for="(item, index) in dataCenterCards"
            class="pt-3"
          >
            <CCardGroup>
              <CCard>
                <CCardHeader color="info"
                  ><h4 style="color: white">{{ item.label }}</h4></CCardHeader
                >
                <CCardBody>
                  <CCardText
                    ><h5>{{ item.value }}</h5></CCardText
                  >
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
        <!-- Content -->
      </CCardBody>
      <CElementCover :opacity="0.8" v-if="loading">
        <h1 class="d-inline">Loading...</h1>
        <CSpinner size="5xl" color="success" />
      </CElementCover>
    </CCard>
  </div>
</template>

<script>
import JogetHelper from "@/helpers/JogetHelper";
export default {
  mixins: [JogetHelper],
  async created() {
    this.loading = true;
    await this.getDataCenterCards();
    this.loading = false;
  },
  data() {
    return {
      loading: false,

      dataCenterCards: [],
    };
  },
  methods: {
    async getDataCenterCards() {
      // จำนวนคำขอเข้าศูนย์ปฏิบัติการทั้งหมด
      const allReserve = await this.jogetListAll(
        "mophApp",
        "list_data_center_reserve"
      );
      this.dataCenterCards.push({
        label: "จำนวนคำขอเข้าศูนย์ปฏิบัติการทั้งหมด",
        value: allReserve.data.length,
      });
      // จำนวนคำขอเข้าศูนย์ปฏิบัติการในวันนี้
      this.dataCenterCards.push({
        label: "จำนวนคำขอเข้าศูนย์ปฏิบัติการในวันนี้",
        value: allReserve.data.filter((item) => {
          const today = new Date();
          const dateCreated = new Date(item.dateCreated);
          today.setHours(0, 0, 0, 0);
          dateCreated.setHours(0, 0, 0, 0);
          return today.toDateString() == dateCreated.toDateString();
        }).length,
      });
      // จำนวนคำขอเข้าศูนย์ปฏิบัติการที่รอดำเนินการ
      this.dataCenterCards.push({
        label: "จำนวนคำขอเข้าศูนย์ปฏิบัติการที่รอดำเนินการ",
        value: allReserve.data.filter((item) => item.IST_approve == "").length,
      });
      // จำนวนคำขอเข้าศูนย์ปฏิบัติการที่ได้รับการอนุมัติ
      this.dataCenterCards.push({
        label: "จำนวนคำขอเข้าศูนย์ปฏิบัติการที่ได้รับการอนุมัติ",
        value: allReserve.data.filter((item) => item.IST_approve == "true")
          .length,
      });
      // จำนวนคำขอเข้าศูนย์ปฏิบัติการที่ไม่ได้รับการอนุมัติ
      this.dataCenterCards.push({
        label: "จำนวนคำขอเข้าศูนย์ปฏิบัติการที่ไม่ได้รับการอนุมัติ",
        value: allReserve.data.filter((item) => item.IST_approve == "false")
          .length,
      });

      // จำนวนผู้เข้าศูนย์ปฏิบัติการในวันนี้
      const allBooker = await this.jogetListAll(
        "mophApp",
        "data_center_checkin"
      );
      this.dataCenterCards.push({
        label: "จำนวนผู้เข้าศูนย์ปฏิบัติการในวันนี้",
        value: allBooker.data.filter((item) => {
          const today = new Date();
          const reserve_date = new Date(item.reserve_date);
          today.setHours(0, 0, 0, 0);
          reserve_date.setHours(0, 0, 0, 0);
          return today.toDateString() == reserve_date.toDateString();
        }).length,
      });
    },
  },
};
</script>