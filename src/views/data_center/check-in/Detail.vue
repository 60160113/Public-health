<template>
  <div>
    <!-- B o o k e r -->
    <div id="booker_section">
      <!-- {{ booker }} -->
      ชื่อ - สกุล: {{ booker.name }}

      เลขที่: {{ booker.reserve_request_id }}
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
    await this.getHardware();
  },
  data() {
    return {
      booker: {},
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