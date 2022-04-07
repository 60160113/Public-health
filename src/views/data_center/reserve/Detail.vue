<template>
  <div>
    <!-- reserve -->
    <CRow>
      <CCol
        ><p>
          <b>วันที่จอง: </b>{{ toThaiFormat(reserve_form.reserve_date)}}
        </p></CCol
      >
      <CCol
        ><p><b>เลขที่เอกสาร: </b>{{ reserve_form.request_id }}</p></CCol
      >
    </CRow>

    <!-- booker T A B L E -->
    <h5 class="text-primary">รายการผู้จอง</h5>
    <CDataTable
      :items="bookers"
      :fields="booker_field"
      pagination
      :items-per-page="5"
      :itemsPerPageSelect="{
        label: 'แสดง',
      }"
    >
      <template #no-items-view
        ><div class="text-center">ไม่พบข้อมูล</div>
      </template>
    </CDataTable>

    <!-- loading -->
    <CElementCover :opacity="0.8" v-if="loading">
      <h1 class="d-inline">Loading...</h1>
      <CSpinner size="5xl" color="success" />
    </CElementCover>
  </div>
</template>

<script>
import JogetHelper from "@/helpers/JogetHelper";
import dateFormat from "@/helpers/dateFormat.vue";
export default {
  mixins: [JogetHelper, dateFormat],
  props: {
    id: {
      type: String,
      default: "",
    },
  },
  async created() {
    this.loading = true;
    this.processId = this.id ? this.id : this.$route.query.processId;
    await this.getReserve();
    await this.getHardware();
    await this.getBooker();
    this.loading = false;
  },
  data() {
    return {
      processId: "",

      reserve_form: {},
      hardwares: [],
      bookers: [],

      loading: false,

      // table field
      booker_field: [
        { key: "name", label: "ชื่อ - สกุล", _style: "width:40%" },
        { key: "position", label: "ตำแหน่ง", _style: "width:15%" },

        { key: "affiliation", label: "สังกัด/บริษัท", _style: "width:15%" },
        { key: "idcard", label: "บัตรประชาชน", _style: "width:20%" },
      ],

      hardware_field: [
        { key: "name", label: "รายการ", _style: "width:25%" },
        { key: "brand", label: "ยี่ห้อ/รุ่น", _style: "width:10%" },
        {
          key: "serial_number",
          label: "S/N",
          _style: "width:10%",
        },
        { key: "unit", label: "จำนวน (ชุด)", _style: "width:15%" },
        { key: "status", label: "เข้า - ออก", _style: "width:15%" },
        { key: "type", label: "ชั่วคราว - ถาวร", _style: "width:15%" },
      ],
    };
  },
  methods: {
    async getReserve() {
      this.jogetGetOne("mophApp", "list_data_center_reserve", [
        {
          paramName: "processId",
          paramValue: this.processId,
        },
      ]).then((res) => {
        this.reserve_form = res.data;
      });
    },
    async getHardware() {
      this.jogetList("mophApp", "list_data_center_hardware", [
        {
          paramName: "processId",
          paramValue: this.processId,
        },
      ]).then((res) => {
        this.hardwares = res.data;
      });
    },
    async getBooker() {
      this.jogetList("mophApp", "list_data_center_booker", [
        {
          paramName: "reserve_id",
          paramValue: this.processId,
        },
      ]).then((res) => {
        this.bookers = res.data;
      });
    },
  },
};
</script>