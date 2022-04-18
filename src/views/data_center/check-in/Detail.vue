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
      <hr />
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

      <p v-if="booker.guard_approve_comment">
        <b>ความคิดเห็น:</b> {{ booker.guard_approve_comment }}
      </p>
    </div>
    <!-- hardware T A B L E -->
    <hr />
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
    await this.getBooker();
    await this.getReserve();
    await this.getHardware();
  },
  data() {
    return {
      booker: {},
      reserve: {},
      hardwares: [],

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