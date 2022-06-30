<template>
  <div>
    <CCard>
      <CCardHeader>
        <strong class="text-primary"
          >แบบขออนุมัติดำเนินการเปลี่ยนแปลง (Change Request Form)</strong
        >
      </CCardHeader>

      <CCardBody>
        <CRow>
          <CCol
            ><label>วันที่เริ่มดำเนินการ <b style="color: red">*</b></label>
            <v-date-picker
              :min-date="disabledDate"
              mode="dateTime"
              :masks="{
                input: 'YYYY-MM-DD',
              }"
              :model-config="{
                type: 'string',
                mask: 'iso',
              }"
              is24hr
              v-model="form.start_date"
            >
              <template v-slot="{ inputValue, inputEvents }">
                <CInput :value="inputValue" v-on="inputEvents" />
              </template> </v-date-picker
          ></CCol>
          <CCol
            ><label>วันที่คาดว่าแล้วเสร็จ <b style="color: red">*</b></label>
            <v-date-picker
              :min-date="disabledDate"
              mode="dateTime"
              :masks="{
                input: 'YYYY-MM-DD',
              }"
              :model-config="{
                type: 'string',
                mask: 'iso',
              }"
              is24hr
              v-model="form.end_date"
            >
              <template v-slot="{ inputValue, inputEvents }">
                <CInput :value="inputValue" v-on="inputEvents" />
              </template> </v-date-picker
          ></CCol>
        </CRow>

        <CTextarea
          label="มีความประสงค์ขอเปลี่ยนแปลงเรื่อง"
          v-model="form.subject"
        />
        <CSelect
          label="เหตุผลที่ขอเปลี่ยนแปลง"
          placeholder="กรุณาเลือกเหตุผลที่ขอเปลี่ยนแปลง"
          :value.sync="form.reason"
          :options="reasonOptions"
        />

        <label>ระบบที่เกี่ยวข้อง</label>
        <CMultiSelect
          v-if="!loading && systemOptions.length > 0"
          @update="(val) => (form.related_system = val)"
          :options="systemOptions"
          :search="true"
          :selection="true"
          optionsEmptyPlaceholder="ไม่มีข้อมูล"
          selectionType="tags"
          searchPlaceholder="ค้นหาระบบที่เกี่ยวข้อง"
        />

        <CSelect
          class="mt-3"
          label="เอกสารที่แนบท้ายมาด้วย"
          placeholder="กรุณาเลือกเอกสารที่แนบท้ายมาด้วย"
          :value.sync="form.attachment"
          :options="attachmentOptions"
        />

        <CTextarea
          label="รายละเอียดการเปลี่ยนแปลง"
          v-model="form.change_detail"
        />

        <CTextarea
          label="ผลกระทบจากการเปลี่ยนแปลง"
          v-model="form.change_effect"
        />

        <CTextarea
          label="แนวทาง / ขั้นตอนการดำเนินงาน"
          v-model="form.change_procedure"
        />
      </CCardBody>

      <CCardFooter>
        <CButton
          block
          color="primary"
          @click.prevent="submit()"
          :disabled="loading"
          >บันทึก</CButton
        >
      </CCardFooter>

      <CElementCover :opacity="0.8" v-if="loading">
        <h1 class="d-inline">Loading...</h1>
        <CSpinner size="5xl" color="success" />
      </CElementCover>
    </CCard>
  </div>
</template>

<script>
import JogetHelper from "@/helpers/JogetHelper";
import { DatePicker } from "v-calendar";
const AuthUser = JSON.parse(localStorage.getItem("AuthUser"));
export default {
  mixins: [JogetHelper],
  components: { "v-date-picker": DatePicker },
  async created() {
    try {
      this.loading = true;
      const getOptions = async (listId, valueField) => {
        const response = await this.jogetList("mophApp", listId, [
          {
            paramName: "status",
            paramValue: "active",
          },
        ]);
        return response.data.map((el) => el[valueField]);
      };
      this.reasonOptions = await getOptions(
        "list_change_request_reasons",
        "reason"
      );
      this.systemOptions = await getOptions(
        "list_change_request_related_systems",
        "system"
      );
      this.systemOptions = this.systemOptions.map((s) =>
        Object.assign({
          value: s,
          text: s,
        })
      );
      this.attachmentOptions = await getOptions(
        "list_change_request_attachment",
        "attachment"
      );
      this.loading = false;
    } catch (error) {
      this.loading = false;
    }
  },
  data() {
    return {
      form: {
        processId: "",
        activity: "",
        assign: "",

        start_date: new Date(),
        end_date: new Date(),

        subject: "",
        reason: "",
        related_system: [],
        attachment: "",
        change_detail: "",
        change_effect: "",
        change_procedure: "",

        requester_name: AuthUser.fullname,
        requester_position: AuthUser.position,
      },

      loading: false,

      // options
      reasonOptions: [],
      systemOptions: [],
      attachmentOptions: [],
    };
  },
  methods: {
    async submit() {
      try {
        this.loading = true;
        // start process
        const startProcess = await this.jogetStartProcess(
          "mophApp",
          "changeManagementProcess"
        );
        const processId = startProcess.data.processId;

        // activity
        const activity = await this.jogetGetCurrentActivity(processId);

        // process complete
        await this.jogetProcessComplete(activity.data.activityId);

        // submit form
        const considerRequestActivity = await this.jogetGetCurrentActivity(
          processId
        );
        this.form.activity = `${considerRequestActivity.data.activityDefId};${considerRequestActivity.data.activityName};${considerRequestActivity.data.activityId}`;
        this.form.processId = processId;
        this.form.assign = "position;ISM";

        await this.jogetFormSubmit("mophApp", "change_request", "", this.form);
        this.$router.push("/change_request/list");
        this.loading = false;
      } catch (error) {
        this.loading = false;
      }
    },
  },
  computed: {
    disabledDate() {
      const today = new Date();
      const tomorow = new Date();
      tomorow.setDate(today.getDate() + 1);
      return tomorow;
    },
  },
};
</script>