<template>
  <div>
    <!-- B o o k e r -->
    <div id="booker_section">
      <CRow>
        <CCol>
          <p><b>เลขที่เอกสาร:</b> {{ booker.reserve_request_id }}</p>
        </CCol>
        <CCol
          ><p><b>วันที่:</b> {{ toThaiFormat(booker.dateCreated) }}</p></CCol
        >
      </CRow>
      <hr class="mt-1" />
      <CRow>
        <CCol>
          <p><b>ชื่อ - สกุล:</b> {{ booker.name }}</p>
        </CCol>
        <CCol
          ><p><b>เลขที่บัตรประชาชน:</b> {{ booker.idcard }}</p></CCol
        >
      </CRow>
      <CRow>
        <CCol>
          <p><b>ตำแหน่ง:</b> {{ booker.position }}</p>
        </CCol>
        <CCol
          ><p><b>สังกัด/บริษัท:</b> {{ booker.affiliation }}</p></CCol
        >
      </CRow>
      <hr class="mt-1" />
      <p><b>วันที่จอง:</b> {{ toThaiFormatWithTime(booker.reserve_date) }}</p>
      <p>
        <b>ผู้ติดต่อ:</b> {{ reserve.ISS ? reserve.ISS.split(";")[1] : "" }}
      </p>
      <p><b>วัตถุประสงค์: </b>{{ reserve.objective }}</p>
      <p v-if="reserve.note"><b>หมายเหตุ: </b>{{ reserve.note }}</p>
    </div>
    <!-- Check in -->
    <div id="checkin_section" v-if="booker.guard_approve">
      <hr class="mt-1" />
      <CRow>
        <CCol
          ><p>
            <b>สถานะการเช็คอินเข้าอาคาร:</b>&nbsp;
            <CBadge
              style="font-size: 16px"
              :color="JSON.parse(booker.guard_approve) ? 'success' : 'danger'"
              >{{
                JSON.parse(booker.guard_approve) ? "สำเร็จ" : "ยกเลิก"
              }}</CBadge
            >
          </p></CCol
        >
        <CCol>
          <p>
            <b>หมายเลขบัตรเข้าอาคาร:</b>&nbsp;
            <CBadge style="font-size: 16px" color="success">{{
              booker.building_card
            }}</CBadge>
          </p>
        </CCol>
      </CRow>

      <CRow>
        <CCol>
          <p>
            <b>ความคิดเห็น:</b>
            {{
              booker.guard_approve_comment ? booker.guard_approve_comment : "-"
            }}
          </p>
        </CCol>
        <CCol>
          <p>
            <b>เช็คอินเมื่อ:</b>
            {{ toThaiFormatWithTime(booker.guard_approve_date) }}
          </p>
        </CCol>
      </CRow>
    </div>
    <!-- Data Center Check In -->
    <div id="data_center_checkin_section" v-if="booker.ISS_approve">
      <hr class="mt-1" />
      <CRow>
        <CCol
          ><p>
            <b>สถานะการเช็คอินเข้าศูนย์ปฏิบัติการ:</b>&nbsp;
            <CBadge
              style="font-size: 16px"
              :color="JSON.parse(booker.ISS_approve) ? 'success' : 'danger'"
              >{{
                JSON.parse(booker.ISS_approve) ? "สำเร็จ" : "ยกเลิก"
              }}</CBadge
            >
          </p></CCol
        >
        <CCol>
          <p>
            <b>หมายเลขบัตรเข้าศูนย์ปฏิบัติการ:</b>&nbsp;
            <CBadge style="font-size: 16px" color="warning">{{
              booker.data_center_card
            }}</CBadge>
          </p>
        </CCol>
      </CRow>

      <CRow>
        <CCol>
          <p>
            <b>ความคิดเห็น:</b>
            {{ booker.ISS_approve_comment ? booker.ISS_approve_comment : "-" }}
          </p>
        </CCol>
        <CCol>
          <p>
            <b>เช็คอินเมื่อ:</b>
            {{ toThaiFormatWithTime(booker.ISS_approve_date) }}
          </p>
        </CCol>
      </CRow>
    </div>
    <div id="checkout_section" v-if="booker.return_data_center_card_date">
      <hr class="mt-1" />
      <p>
        <b>เช็คเอาท์ศูนย์ปฏิบัติการเมื่อ:</b>&nbsp;{{
          toThaiFormatWithTime(booker.return_data_center_card_date)
        }}
      </p>
      <p v-if="booker.return_building_card_date">
        <b>เช็คเอาท์อาคารเมื่อ:</b>&nbsp;{{
          toThaiFormatWithTime(booker.return_building_card_date)
        }}
      </p>
    </div>
    <!-- hardware T A B L E -->
    <hr class="mt-1" />
    <div id="hardware_section">
      <h5 class="text-primary">รายการ Hardwares</h5>
      <CDataTable
        :items="hardwares"
        :fields="hardware_field"
        pagination
        :items-per-page="5"
        :itemsPerPageSelect="{
          label: 'แสดง',
        }"
      >
        <template #no-items-view
          ><div class="text-center">ไม่พบข้อมูล</div>
        </template>
        <template #type="{ item }">
          <td>
            {{ item.type }}
            <p v-if="item.return_date">
              (ส่งคืนวันที่ {{ toThaiFormatWithTime(item.return_date) }})
            </p>
          </td>
        </template>
      </CDataTable>
    </div>

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
    processId: {
      type: String,
      default: "",
    },
    id: {
      type: String,
      default: "",
    },
  },
  async created() {
    this.loading = true;
    await this.getBooker();
    await this.getReserve();
    await this.getHardware();
    setTimeout(() => {
      this.loading = false;
    }, 500);
  },
  data() {
    return {
      booker: {},
      reserve: {},
      hardwares: [],

      loading: true,

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
    async getBooker() {
      this.jogetGetOne("mophApp", "data_center_checkin", [
        {
          paramName: "id",
          paramValue: this.id,
        },
      ]).then((res) => {
        this.booker = res.data;
      });
    },
    async getReserve() {
      this.jogetGetOne("mophApp", "list_data_center_reserve", [
        {
          paramName: "processId",
          paramValue: this.processId,
        },
      ]).then((res) => {
        this.reserve = res.data;
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
  },
};
</script>

<style scoped>
p {
  font-size: 16px;
}
</style>