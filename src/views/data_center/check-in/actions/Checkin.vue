<template>
  <div>
    <CSelect
      label="ดำเนินการ"
      placeholder="กรุณาเลือก"
      :options="[
        { value: 'true', label: 'เช็คอิน' },
        { value: 'false', label: 'ยกเลิก' },
      ]"
      :value.sync="form.guard_approve"
    />
    <CSelect
      v-if="form.guard_approve == 'true'"
      label="หมายเลขบัตรเข้าอาคาร"
      placeholder="กรุณาเลือก"
      :options="building_card_list"
      :value.sync="form.building_card"
    />
    <CTextarea label="ความคิดเห็น" v-model="form.guard_approve_comment" />

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
export default {
  mixins: [JogetHelper],
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
    this.getBuildingCards();
  },
  data() {
    return {
      form: {
        processId: "",
        activity: "",
        assign: "",

        building_card: "",

        guard_approve: "",
        guard_approve_comment: "",
        guard_approve_date: new Date(),
      },

      building_card_list: [],

      loading: false,
    };
  },
  methods: {
    getBuildingCards() {
      this.jogetListAll("mophApp", "list_data_center_building_card").then(
        (res) => {
          this.building_card_list = res.data.map((item) => item.number);
        }
      );
    },
    async submit() {
      this.loading = true;
      // start process
      const startProcess = await this.jogetStartProcess(
        "mophApp",
        "data_center_checkin_process"
      );
      const processId = startProcess.data.processId;

      // activity
      const checkInActivity = await this.jogetGetCurrentActivity(processId);
      // process complete
      const variableData = [
        {
          paramName: "security_guard_approve",
          paramValue: this.form.guard_approve == "true",
        },
      ];
      await this.jogetProcessComplete(
        checkInActivity.data.activityId,
        variableData
      );

      // submit form
      if (this.form.guard_approve == "true") {
        // activity
        const Activity = await this.jogetGetCurrentActivity(processId);
        this.form.activity = `${Activity.data.activityDefId};${Activity.data.activityName}`;
        this.form.processId = processId;
        this.form.assign = "position;ISS";
      } else {
        this.form.activity = `complete;เสร็จสิ้น`;
      }
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
        this.form.guard_approve == "" ||
        (this.form.guard_approve == "true" && this.form.building_card == "") ||
        this.loading
      );
    },
  },
};
</script>