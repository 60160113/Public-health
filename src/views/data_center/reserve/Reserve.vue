<template>
  <div style="margin: 30px">
    <CCard v-if="!completed">
      <CCardHeader>
        <strong class="text-primary">ติดต่อเข้าอาคาร</strong>
      </CCardHeader>

      <CCardBody>
        <CRow>
          <CCol>
            <label>วันที่ต้องการจอง</label>
            <v-date-picker
              :min-date="disabledDate"
              mode="dateTime"
              :masks="{
                input: 'YYYY-MM-DD',
              }"
              v-model="reserve_form.reserve_date"
            />
          </CCol>
        </CRow>
        <CRow class="mt-2">
          <CCol md="6">
            <CInput label="ผู้ร้องขอ" />
          </CCol>
          <CCol md="6">
            <CInput label="ตำแหน่ง" />
          </CCol>

          <CCol md="6">
            <CInput label="สังกัด" />
          </CCol>
          <CCol md="6">
            <label for="idcard">เลขที่บัตรประชาชน</label>
            <masked-input
              id="idcard"
              type="text"
              class="form-control"
              :mask="idCardMaskInput"
              :guide="true"
              placeholderChar="#"
            />
          </CCol>
        </CRow>

        <hr />
        <CRow>
          <CCol md="6">
            <CSelect
              label="ผู้ติดต่อ"
              placeholder="กรุณาเลือกผู้ติดต่อ"
              :options="ISS_options"
            />
          </CCol>
          <CCol md="6">
            <CSelect
              label="วัตถุประสงค์"
              placeholder="กรุณาเลือกวัตถุประสงค์"
              :options="objective_options"
            />
          </CCol>
        </CRow>

        <CRow>
          <CCol col="12">
            <CTextarea label="หมายเหตุ" />
          </CCol>
        </CRow>
      </CCardBody>

      <CCardFooter>
        <CButton
          style="width: 100%"
          color="primary"
          @click.prevent="submit()"
          :disabled="disabledButton"
          >บันทึก</CButton
        >
      </CCardFooter>
    </CCard>

    <CCard v-else>
      <CCardHeader><strong class="text-primary">เสร็จสิ้น</strong></CCardHeader>
      <CCardBody>ข้อมูลการจองของคุณถูกจัดเก็บไปยังฐานข้อมูลเสร็จสิ้น</CCardBody>
    </CCard>

    <CElementCover :opacity="0.8" v-if="loading" />
  </div>
</template>

<script>
import JogetHelper from "@/helpers/JogetHelper";
import { DatePicker } from "v-calendar";
import MaskedInput from "vue-text-mask";
export default {
  mixins: [JogetHelper],
  components: { "v-date-picker": DatePicker, MaskedInput },
  created() {
    this.loading = true;
    this.login("application", "application").then(async (res) => {
      // get objectives
      const objectives = await this.jogetList(
        "mophApp",
        "list_data_center_objectives",
        [
          {
            paramName: "status",
            paramValue: "active",
          },
        ]
      );
      this.objective_options = objectives.data.map((item) => item.objective);
      // get ISS
      const ISS_list = await this.jogetList("mophApp", "user_accounts", [
        {
          paramName: "position",
          paramValue: "ISS",
        },
      ]);
      this.ISS_options = ISS_list.data.map((item) => {
        return { value: `${item.id};${item.fullname}`, label: item.fullname };
      });
      this.loading = false;
    });
  },
  beforeRouteLeave(to, from, next) {
    localStorage.removeItem("AuthUser");
  },
  data() {
    return {
      // form
      reserve_form: {
        reserve_date: new Date(),
        objective: "",
        note: "",

        ISS: "", // id;name
      },

      booker_form: [
        {
          name: "",
          position: "",
          affiliation: "",
          idcard: "",
        },
      ],

      hardware_form: [
        {
          name: "",
          brand: "",
          serial_number: "",
          unit: "",
          type: "ชั่วคราว",
          return_date: null,
        },
      ],

      // options
      objective_options: [],
      ISS_options: [],

      // etc
      loading: false,
      completed: false,

      idCardMaskInput: [
        /\d/,
        "-",
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        "-",
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        "-",
        /\d/,
        /\d/,
        "-",
        /\d/,
      ],
    };
  },
  methods: {
    login(email, password) {
      return this.jogetLogin({ email, password });
    },
    addBooker() {
      this.booker_form.push({
        name: "",
        position: "",
        affiliation: "",
        idcard: "",
      });
    },
    addHardware() {
      this.hardware_form.push({
        name: "",
        brand: "",
        serial_number: "",
        unit: "",
        type: "ชั่วคราว",
        return_date: null,
      });
    },
    async submit() {
      try {
        // reserve
        const reserveData = { ...this.reserve_form, processId: "" };
        // booker
        const bookerData = this.booker_form.map((item) => {
          item.processId = "";
          item.activity = ""; // id;name

          item.reserve_id = ""; // foreign key to processId of data_center_reserve
          item.assign = "position;IST"; // localStorage() field;value
          return item;
        });
        // hardware
        const hardwareData = this.hardware_form.map((item) => {
          item.processId = "";
          item.status = "เข้า";
          return item;
        });
      } catch (error) {}
    },
  },
  computed: {
    disabledButton() {
      return Object.values(this.reserve_form).includes("");
    },
    disabledDate() {
      const today = new Date();
      const tomorow = new Date();
      tomorow.setDate(today.getDate() + 1);
      return tomorow;
    },
  },
};
</script>