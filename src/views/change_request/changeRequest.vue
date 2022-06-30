<template>
  <div>
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

    <CTextarea label="รายละเอียดการเปลี่ยนแปลง" v-model="form.change_detail" />

    <CTextarea label="ผลกระทบจากการเปลี่ยนแปลง" v-model="form.change_effect" />

    <CTextarea
      label="แนวทาง / ขั้นตอนการดำเนินงาน"
      v-model="form.change_procedure"
    />
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
  methods: {},
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