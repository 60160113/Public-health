<template>
  <div>
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

    <hr />
    <CButton color="primary" block :disabled="loading" @click.prevent="submit()"
      ><b>บันทึก</b></CButton
    >

    <CElementCover :opacity="0.8" v-if="loading">
      <h1 class="d-inline">Loading...</h1>
      <CSpinner size="5xl" color="success" />
    </CElementCover>
  </div>
</template>

<script>
import JogetHelper from "@/helpers/JogetHelper";
import dateFormat from "@/helpers/dateFormat.vue";

const AuthUser = JSON.parse(localStorage.getItem("AuthUser"));
export default {
  mixins: [JogetHelper, dateFormat],
  props: {
    onComplete: {
      type: Function,
      default: function () {
        return true;
      },
    },
    processId: {
      type: String,
      default: "",
    },
    id: {
      type: String,
      default: "",
    },
  },
  created() {
    this.getBooker();
  },
  data() {
    return {
      booker: { reserve_id: "", activity: "" },
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

      form: {
        activity: "",
        checkout_guard_name: AuthUser.fullname,

        return_building_card_date: new Date(),
      },

      loading: false,
    };
  },
  methods: {
    getBooker() {
      this.jogetGetOne("mophApp", "data_center_checkin", [
        {
          paramName: "id",
          paramValue: this.id,
        },
      ]).then((res) => {
        this.booker = res.data;
        this.getHardware();
      });
    },
    getHardware() {
      this.jogetList("mophApp", "list_data_center_hardware", [
        {
          paramName: "processId",
          paramValue: this.booker.reserve_id,
        },
      ]).then((res) => {
        this.hardwares = res.data;
        this.previousHardwares = this.hardwares.map((item) => item.id);
      });
    },
    async submit() {
      this.loading = true;

      // process complete
      const currentActivity = this.booker.activity.split(";")[2];
      await this.jogetProcessComplete(currentActivity);

      // activity
      this.form.activity = `complete;เสร็จสิ้น;none`;

      // submit form
      await this.jogetFormSubmit(
        "mophApp",
        "data_center_booker",
        this.id,
        this.form
      )
        .then((res) => {
          this.loading = false;
          this.onComplete();
        })
        .catch((err) => {
          this.loading = false;
        });
    },
  },
};
</script>