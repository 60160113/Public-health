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
    <hr class="mt-1" />

    <CSelect
      label="ดำเนินการ"
      placeholder="กรุณาเลือก"
      :options="[
        { value: 'true', label: 'เช็คอิน' },
        { value: 'false', label: 'ยกเลิก' },
      ]"
      :value.sync="form.ISS_approve"
    />

    <CSelect
      v-if="form.ISS_approve == 'true'"
      label="หมายเลขบัตรเข้าศูนย์ปฏิบัติการ"
      placeholder="กรุณาเลือก"
      :options="data_center_cards"
      :value.sync="form.data_center_card"
    />
    <CTextarea label="ความคิดเห็น" v-model="form.ISS_approve_comment" />

    <hr />
    <CButton
      color="primary"
      block
      :disabled="disabledButton"
      @click.prevent="submit()"
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
  async created() {
    await this.getBooker();
    await this.getCardNumber();
  },
  data() {
    return {
      booker: {},
      data_center_cards: [],

      form: {
        activity: "",
        assign: "",

        data_center_card: "",

        ISS_approve: "",
        ISS_approve_comment: "",
        ISS_approve_date: new Date(),
      },

      loading: false,
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
    async getCardNumber() {
      this.jogetListAll("mophApp", "list_data_center_card").then((res) => {
        this.data_center_cards = res.data.map((item) => item.number);
      });
    },
    async submit() {
      this.loading = true;
      // process complete
      const variableData = [
        {
          paramName: "ISS_approve",
          paramValue: this.form.ISS_approve == "true",
        },
      ];
      const currentActivity = this.booker.activity.split(";")[2];
      await this.jogetProcessComplete(currentActivity, variableData);

      // activity
      const Activity = await this.jogetGetCurrentActivity(this.processId);
      this.form.activity = `${Activity.data.activityDefId};${Activity.data.activityName};${Activity.data.activityId}`;

      // set form
      if (this.form.ISS_approve == "true") {
        this.form.assign = "position;ISS";
      } else {
        this.form.assign = "position;guard";
      }

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
  computed: {
    disabledButton() {
      return (
        this.form.ISS_approve == "" ||
        (this.form.ISS_approve == "true" && this.form.data_center_card == "") ||
        this.loading
      );
    },
  },
};
</script>