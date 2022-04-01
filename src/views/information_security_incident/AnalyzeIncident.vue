<template>
  <div>
    <CCard>
      <CCardHeader>
        <h4>แจ้งเหตุการณ์ด้านความมั่นคงปลอดภัยสารสนเทศ</h4>
      </CCardHeader>
      <CCardBody>
        <h5 class="text-primary">รายละเอียดผู้แจ้ง</h5>
        <CRow class="mt-3">
          <CCol col="12">
            <CInput
              horizontal
              label="ชื่อ - สกุล"
              v-model="form.informer_name"
            />
          </CCol>

          <CCol col="6">
            <CInput
              horizontal
              label="ตำแหน่ง"
              v-model="form.informer_position"
            />
          </CCol>
          <CCol col="6">
            <CInput
              horizontal
              label="สำนัก/หน่วยงาน"
              v-model="form.informer_institution"
            />
          </CCol>

          <CCol col="6">
            <CInput
              horizontal
              label="โทรศัพท์"
              v-model="form.informer_phone_no"
            />
          </CCol>
          <CCol col="6">
            <CInput horizontal label="E-Mail" v-model="form.informer_email" />
          </CCol>

          <CCol col="12">
            <CInputRadio
              horizontal
              v-for="(option, key) in informer_type_options"
              :key="key"
              :label="option"
              :value="option"
              inline
              custom
              :checked="form.informer_type === option"
              @update:checked="() => (form.informer_type = option)"
            />
          </CCol>
        </CRow>
        <hr />

        <CSelect
          label="ประเภทของปัญหา"
          placeholder="กรุณาเลือกประเภทของปัญหา"
          :value.sync="variable.incident_type"
          horizontal
          :options="incident_type_options"
        />
        <CInput
          v-if="variable.incident_type === null"
          horizontal
          label="กรุณาระบุประเภทของปัญหา"
          v-model="form.incident_type"
        />
        <hr />

        <CSelect
          label="รายละเอียดเหตุการณ์"
          placeholder="กรุณาเลือกรายละเอียดเหตุการณ์"
          :value.sync="variable.incident_detail"
          horizontal
          :options="incident_detail_options"
        />
        <CInput
          v-if="variable.incident_detail === null"
          horizontal
          label="กรุณาระบุรายละเอียดเหตุการณ์"
          v-model="form.incident_detail"
        />
        <hr />

        <CSelect
          label="ระดับความสำคัญ"
          placeholder="กรุณาเลือกระดับความสำคัญ"
          :value.sync="form.incident_priority"
          horizontal
          :options="incident_priority_options"
        />
        <CSelect
          label="ระยะเวลาเป้าหมาย"
          placeholder="กรุณาเลือกระยะเวลาเป้าหมาย"
          :value.sync="form.incident_duration"
          horizontal
          :options="incident_duration_options"
        />
        <CInputRadio
          class="mt-2"
          horizontal
          v-for="(option, key) in incident_effect_options"
          :key="key"
          :label="option.label"
          :value="option.value"
          inline
          custom
          :checked="form.incident_effect === option.value"
          @update:checked="() => (form.incident_effect = option.value)"
        />

        <hr />

        <CButton
          :disabled="disabled_button"
          block
          color="primary"
          class="mt-3"
          @click.prevent="inform()"
          >บันทึก</CButton
        >
      </CCardBody>
    </CCard>
        <CElementCover :opacity="0.8" v-if="loading">
      <h1 class="d-inline">Loading...</h1>
      <CSpinner size="5xl" color="success" />
    </CElementCover>
  </div>
</template>

<script>
import { authHeader } from "@/helpers/auth-header";
import axios from "axios";

const user = JSON.parse(localStorage.getItem("AuthUser"));
export default {
  data() {
    return {
      form: {
        dateCreated: new Date(),
        informer_name: "",
        informer_position: "",
        informer_institution: "",
        informer_phone_no: "",
        informer_email: "",
        informer_type: "ผู้ใช้งานระบบ",

        incident_type: "",
        incident_detail: "",
        incident_priority: "",
        incident_duration: "",
        incident_effect: "legal",

        IST_name: user.fullname,

        process_name: null,
        process_id: null,
      },

      variable: {
        incident_type: "",
        incident_detail: "",
      },

      informer_type_options: ["ผู้ใช้งานระบบ", "ผู้ดูแลระบบที่ตรวจพบ"],
      incident_type_options: [
        { value: "Server", label: "Server" },
        { value: "Network", label: "Network" },
        { value: "Security", label: "Security" },
        { value: "Storage", label: "Storage" },
        { value: "Auto Process", label: "Auto Process" },
        { value: "Facilities", label: "Facilities" },
        { value: "Software", label: "Software" },
        { value: "ระบบงาน", label: "ระบบงาน" },
        { value: "PC", label: "PC" },
        { value: null, label: "Other" },
      ],
      incident_detail_options: [
        {
          value:
            "ถูกโจมตีด้วยโปรแกรมมุ่งร้ายและก่อให้เกิดความเสียหายในระบบ เช่น ระบบไม่สามารถทำงานได้ เป็นต้น",
          label:
            "ถูกโจมตีด้วยโปรแกรมมุ่งร้ายและก่อให้เกิดความเสียหายในระบบ เช่น ระบบไม่สามารถทำงานได้ เป็นต้น",
        },
        {
          value:
            "ถูกโจมตีทางระบบเครือข่าย เช่น DoS หรือ Traffic Flood และก่อให้เกิดความเสียหายในระบบ เป็นต้น",
          label:
            "ถูกโจมตีทางระบบเครือข่าย เช่น DoS หรือ Traffic Flood และก่อให้เกิดความเสียหายในระบบ เป็นต้น",
        },
        {
          value: "ถูกเจาะระบบจากภายในองค์กร หรือจากภายนอกองค์กร",
          label: "ถูกเจาะระบบจากภายในองค์กร หรือจากภายนอกองค์กร",
        },
        {
          value: "ถูกเจาะระบบจากภายในองค์กร หรือจากภายนอกองค์กร",
          label: "ถูกเจาะระบบจากภายในองค์กร หรือจากภายนอกองค์กร",
        },
        {
          value: "ข้อมูลรั่วไหล (Data Breach)",
          label: "ข้อมูลรั่วไหล (Data Breach)",
        },
        {
          value: "ระบบหรืออุปกรณ์ที่ให้บริการล้มเหลวหรือเสียหาย",
          label: "ระบบหรืออุปกรณ์ที่ให้บริการล้มเหลวหรือเสียหาย",
        },
        { value: "ข้อมูลเสียหาย สูญหาย", label: "ข้อมูลเสียหาย สูญหาย" },
        {
          value: "เหตุการณ์หรือภัยทางธรรมชาติอันส่งผลกระทบต่อการให้บริการ",
          label: "เหตุการณ์หรือภัยทางธรรมชาติอันส่งผลกระทบต่อการให้บริการ",
        },
        {
          value: "การโจรกรรมเอกลักษณ์บุคคล (Identity Theft)",
          label: "การโจรกรรมเอกลักษณ์บุคคล (Identity Theft)",
        },
        {
          value: "ภัยคุกคามทางกายภาพ เช่น ลักขโมย",
          label: "ภัยคุกคามทางกายภาพ เช่น ลักขโมย",
        },
        { value: "Web-based Attacks", label: "Web-based Attacks" },
        {
          value: "สภาพแวดล้อมของศูนย์คอมพิวเตอร์ไม่เหมาะสม",
          label: "สภาพแวดล้อมของศูนย์คอมพิวเตอร์ไม่เหมาะสม",
        },
        {
          value: "ข้อมูลรั่วไหล (Data Breach)",
          label: "ข้อมูลรั่วไหล (Data Breach)",
        },
        {
          value:
            "ระบบหรืออุปกรณ์ควบคุมความมั่นคงปลอดภัยของศูนย์คอมพิวเตอร์ล้มเหลวหรือเสียหาย",
          label:
            "ระบบหรืออุปกรณ์ควบคุมความมั่นคงปลอดภัยของศูนย์คอมพิวเตอร์ล้มเหลวหรือเสียหาย",
        },
        {
          value: "BOTNET หรือ roBOT NETwork",
          label: "BOTNET หรือ roBOT NETwork",
        },
        {
          value: "การละเมิดนโยบายด้านความมั่นคงปลอดภัยของผู้ดูแลระบบ",
          label: "การละเมิดนโยบายด้านความมั่นคงปลอดภัยของผู้ดูแลระบบ",
        },
        {
          value: "การละเมิดนโยบายด้านความมั่นคงปลอดภัยของผู้ใช้งานระบบ",
          label: "การละเมิดนโยบายด้านความมั่นคงปลอดภัยของผู้ใช้งานระบบ",
        },
        {
          value: "การละเมิดนโยบายด้านความมั่นคงปลอดภัยของผู้ให้บริการภายนอก",
          label: "การละเมิดนโยบายด้านความมั่นคงปลอดภัยของผู้ให้บริการภายนอก",
        },
        { value: null, label: "อื่น ๆ " },
      ],

      incident_priority_options: [
        "Critical, Major Incident",
        "High",
        "Medium",
        "Low",
      ],

      incident_duration_options: [
        "4 ชั่วโมง",
        "6 ชั่วโมง",
        "8 ชั่วโมง",
        "10 ชั่วโมง",
        "24 ชั่วโมง",
        "48 ชั่วโมง",
      ],

      incident_effect_options: [
        { value: "legal", label: "เกี่ยวข้องกับการดำเนินคดีด้านกฎหมาย" },
        { value: "BCP", label: "เกี่ยวข้องกับ BCP" },
        {
          value: "neither",
          label: "ไม่เกี่ยวข้องกับการดำเนินคดีทางกฎหมาย และ BCP",
        },
      ],

      loading: false,

      axiosOptions: {
        headers: authHeader(),
      },
    };
  },
  methods: {
    async inform() {
      try {
        this.loading = true;

        // start Process
        var axiosData = {
          app: {
            appId: "mophApp",
            processDefId: "informationSecurityIncidentProcess",
          },
        };
        const startProcess = await axios.post(
          `${process.env.VUE_APP_BACKEND_URL}/process/start`,
          axiosData,
          this.axiosOptions
        );

        // submit
        this.form.process_name = "Assign Operator"
        this.form.process_id = startProcess.data.processId;
        axiosData = {
          app: {
            appId: "mophApp",
            formId: "information_security_incident",
          },
          primaryKey: this.form.process_id,
          formData: this.form,
        };

        await axios.post(
          `${process.env.VUE_APP_BACKEND_URL}/form/submit`,
          axiosData,
          this.axiosOptions
        );

        // process/view
        const viewProcess = await axios.post(
          `${process.env.VUE_APP_BACKEND_URL}/process/view`,
          {
            processId: this.form.process_id,
          },
          this.axiosOptions
        );

        await axios.post(
          `${process.env.VUE_APP_BACKEND_URL}/process/completeWithVariable`,
          {
            activityId: viewProcess.data.activityId,
            variables: [
              {
                paramName: "incident",
                paramValue: this.form.incident_effect,
              },
            ],
          },
          this.axiosOptions
        );
        this.loading = false;
        this.$router.push("/information_security_incident");
      } catch (error) {
        this.loading = false;
      }
    },
  },
  watch: {
    "variable.incident_type": function (val) {
      if (!val) {
        this.form.incident_type = "";
      } else {
        this.form.incident_type = val;
      }
    },
    "variable.incident_detail": function (val) {
      if (!val) {
        this.form.incident_detail = "";
      } else {
        this.form.incident_detail = val;
      }
    },
  },
  computed: {
    disabled_button() {
      return (
        Object.values(this.form).filter((item) => item === "").length > 0 ||
        this.loading
      );
    },
  },
};
</script>