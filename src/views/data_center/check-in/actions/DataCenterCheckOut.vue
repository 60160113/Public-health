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
        <template #over-table>
          <div style="margin-bottom: 10px">
            <CButton color="success" @click.prevent="modal = true"
              >เพิ่ม Hardware</CButton
            >
          </div>
        </template>
        <template #type="{ item }">
          <td>
            {{ item.type }}
            <p v-if="item.return_date">
              (ส่งคืนวันที่ {{ toThaiFormatWithTime(item.return_date) }})
            </p>
          </td>
        </template>
        <template #action="{ index }">
          <td>
            <CButton color="danger" @click.prevent="hardwares.splice(index, 1)"
              >ลบ</CButton
            >
          </td>
        </template>
      </CDataTable>
    </div>

    <hr />
    <CButton color="primary" block :disabled="loading" @click.prevent="submit()"
      ><b>บันทึก</b></CButton
    >

    <!-- M O D A L -->
    <CModal :show.sync="modal" :centered="true" size="lg" color="success">
      <CRow>
        <CCol col="6">
          <CInput label="ชื่อ" v-model="hardware_form.name" />
        </CCol>
        <CCol col="6">
          <CInput label="ยี่ห้อ" v-model="hardware_form.brand" />
        </CCol>

        <CCol col="6">
          <CInput label="S/N" v-model="hardware_form.serial_number" />
        </CCol>
        <CCol col="6">
          <CInput label="จำนวน" type="number" v-model="hardware_form.unit" />
        </CCol>
      </CRow>
      <hr />

      <label>นำเข้า - นำออก</label>
      <CInputRadioGroup
        :options="[
          { value: 'เข้า', label: 'เข้า' },
          { value: 'ออก', label: 'ออก' },
        ]"
        :checked.sync="hardware_form.status"
        custom
        inline
      />

      <hr />
      <label>รูปแบบ</label>
      <CInputRadioGroup
        :options="[
          { value: 'ชั่วคราว', label: 'ชั่วคราว' },
          { value: 'ถาวร', label: 'ถาวร' },
        ]"
        :checked.sync="hardware_form.type"
        custom
        inline
      />

      <div v-if="hardware_form.type == 'ชั่วคราว'">
        <hr />
        <CRow class="mt-3">
          <CCol>
            <label>วันที่ส่งคืน</label>
            <v-date-picker
              :min-date="disabledDate"
              mode="dateTime"
              :masks="{
                input: 'YYYY-MM-DD',
              }"
              is24hr
              v-model="hardware_form.return_date"
            >
              <template v-slot="{ inputValue, inputEvents }">
                <CInput :value="inputValue" v-on="inputEvents" />
              </template>
            </v-date-picker>
          </CCol>
        </CRow>
      </div>

      <template #header>
        <h5 class="modal-title">เพิ่ม hardware</h5>
        <CButtonClose @click="modal = false" class="text-white" />
      </template>
      <template #footer>
        <CButton color="secondary" @click="modal = false">ยกเลิก</CButton>&nbsp;
        <CButton color="success" @click.prevent="addItem()">บันทึก</CButton>
      </template>
    </CModal>

    <CElementCover :opacity="0.8" v-if="loading">
      <h1 class="d-inline">Loading...</h1>
      <CSpinner size="5xl" color="success" />
    </CElementCover>
  </div>
</template>

<script>
import JogetHelper from "@/helpers/JogetHelper";
import dateFormat from "@/helpers/dateFormat.vue";

import { DatePicker } from "v-calendar";

const AuthUser = JSON.parse(localStorage.getItem("AuthUser"));
export default {
  mixins: [JogetHelper, dateFormat],
  components: { "v-date-picker": DatePicker },
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
      hardware_form: {
        name: "",
        brand: "",
        serial_number: "",
        unit: "",
        status: "เข้า",
        type: "ชั่วคราว",
        return_date: null,
      },
      hardwares: [],

      previousHardwares: [],

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
        { key: "action", label: "", _style: "width:10%" },
      ],

      form: {
        checkout_ISS_name: AuthUser.fullname,
        activity: "",
        assign: "position;guard",

        return_data_center_card_date: new Date(),
      },

      loading: false,
      modal: false,
    };
  },
  methods: {
    addItem() {
      this.hardwares.push(this.hardware_form);
      this.modal = false;
    },
    getBooker() {
      this.loading = true;

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
      this.loading = true;
      this.jogetList("mophApp", "list_data_center_hardware", [
        {
          paramName: "processId",
          paramValue: this.booker.reserve_id,
        },
      ]).then((res) => {
        this.hardwares = res.data;
        this.previousHardwares = this.hardwares.map((item) => item.id);
      });
      setTimeout(() => {
        this.loading = false;
      }, 500);
    },
    async submit() {
      this.loading = true;

      // hardwares
      await this.jogetMultipleFormDelete(
        "mophApp",
        "data_center_hardware",
        this.previousHardwares
      );
      await this.jogetMultipleFormSubmit(
        "mophApp",
        "data_center_hardware",
        this.hardwares.map((item) => {
          item.processId = this.booker.reserve_id;
          return {
            primaryKey: "",
            data: item,
          };
        })
      );

      // process complete
      const currentActivity = this.booker.activity.split(";")[2];
      await this.jogetProcessComplete(currentActivity);

      // activity
      const Activity = await this.jogetGetCurrentActivity(this.processId);
      this.form.activity = `${Activity.data.activityDefId};${Activity.data.activityName};${Activity.data.activityId}`;

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
  watch: {
    modal: function (val) {
      if (!val) {
        this.hardware_form = {
          name: "",
          brand: "",
          serial_number: "",
          unit: "",
          status: "เข้า",
          type: "ชั่วคราว",
          return_date: null,
        };
      }
    },
  },
};
</script>