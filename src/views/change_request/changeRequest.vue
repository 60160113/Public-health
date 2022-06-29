<template>
  <div>
    <label>วันที่เริ่มดำเนินการ <b style="color: red">*</b></label>
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
      </template>
    </v-date-picker>

    <label>วันที่คาดว่าแล้วเสร็จ <b style="color: red">*</b></label>
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
      </template>
    </v-date-picker>

    <CTextarea
      label="มีความประสงค์ขอเปลี่ยนแปลงเรื่อง"
      horizontal
      v-model="form.subject"
    />
    <CSelect
      label="เหตุผลที่ขอเปลี่ยนแปลง"
      placeholder="กรุณาเลือกเหตุผลที่ขอเปลี่ยนแปลง"
      :value.sync="form.reason"
      horizontal
      :options="reasonOptions"
    />
    <CRow>
      <CCol md="3">
        <label for="">ระบบที่เกี่ยวข้อง</label>
      </CCol>
      <CCol>
        <CInputCheckbox
          v-for="(option, optionIndex) in systemOptions"
          :key="optionIndex"
          :label="option"
          :value="option"
          custom
          @change="
            $event.target.checked
              ? form.related_system.push(option)
              : (form.related_system = form.related_system.filter(
                  (e) => e !== option
                ))
          "
        />
      </CCol>
    </CRow>
    <CSelect
      class="mt-3"
      label="เอกสารที่แนบท้ายมาด้วย"
      :value.sync="form.attachment"
      :options="attachmentOptions"
      horizontal
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

      // options
      systemOptions: [],
      reasonOptions: [],
      attachmentOptions: [],
    };
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