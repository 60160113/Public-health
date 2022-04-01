<template>
  <div>
    <CCard>
      <CCardHeader>
        <h4>แบบแจ้งเหตุการณ์ด้านความมั่นคงปลอดภัยสารสนเทศ</h4>
      </CCardHeader>
      <CCardBody>
        <h5 class="text-primary">รายละเอียดผู้แจ้ง</h5>
        <br />
        <CRow class="mt-2">
          <CCol><b>ชื่อ – สกุล:</b>&nbsp;{{ incident.informer_name }} </CCol>
        </CRow>
        <CRow class="mt-2">
          <CCol><b>ตำแหน่ง:</b>&nbsp;{{ incident.informer_position }} </CCol>
          <CCol
            ><b>สำนัก/หน่วยงาน:</b>&nbsp;{{ incident.informer_institution }}
          </CCol>
        </CRow>
        <CRow class="mt-2">
          <CCol><b>โทรศัพท์:</b>&nbsp;{{ incident.informer_phone_no }} </CCol>
          <CCol><b>E-Mail:</b>&nbsp;{{ incident.informer_email }} </CCol>
        </CRow>
        <CRow class="mt-2">
          <CCol><b>แจ้งในฐานะ:</b>&nbsp;{{ incident.informer_type }} </CCol>
        </CRow>

        <hr />
        <h5 class="text-primary">ประเภทของปัญหา</h5>
        <br />
        <CRow class="mt-2">
          <CCol><b>ประเภทของปัญหา:</b>&nbsp;{{ incident.incident_type }} </CCol>
        </CRow>
        <CRow class="mt-2">
          <CCol
            ><b>รายละเอียดเหตุการณ์:</b>&nbsp;{{ incident.incident_detail }}
          </CCol>
        </CRow>

        <hr />
        <h5 class="text-primary">ระดับความสำคัญของเหตุขัดข้อง</h5>
        <br />
        <CRow class="mt-2">
          <CCol
            ><b>ระดับความสำคัญของเหตุขัดข้อง:</b>&nbsp;{{
              incident.incident_priority
            }}
          </CCol>
          <CCol
            ><b>ระยะเวลาเป้าหมาย:</b>&nbsp;{{ incident.incident_duration }}
          </CCol>
        </CRow>
        <CRow class="mt-2">
          <CCol
            ><b>ระบบที่เกี่ยวข้อง/ผลกระทบที่ได้รับ:</b>&nbsp;{{
              incidentEffectLabel[incident.incident_effect]
            }}</CCol
          >
        </CRow>

        <div class="mt-4 text-right">
          <b>ลงชื่อ</b>&nbsp;{{ incident.IST_name }}
        </div>
        <div class="mt-2 text-right">
          IST (ผู้รับแจ้งหรือผู้ดูแลระบบที่ตรวจพบ)
        </div>
      </CCardBody>
    </CCard>
    <CCard>
      <CCardHeader>
        <h4>มอบหมายงาน</h4>
      </CCardHeader>
      <CCardBody>
        <CInput
          horizontal
          label="ชื่อ - สกุล ผู้ดำเนินการ"
          v-model="form.operator_name"
        />
        <CSelect
          label="รายละเอียด"
          placeholder="กรุณาเลือกรายละเอียด"
          :value.sync="variable.operator_assignment"
          horizontal
          :options="operator_assignment_options"
        />
        <CInput
          v-if="variable.operator_assignment === null"
          horizontal
          label="กรุณารายละเอียด"
          v-model="form.operator_assignment"
        />
        <CButton
          :disabled="disabled_button"
          block
          color="primary"
          class="mt-3"
          @click.prevent="assign()"
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
  created() {
    this.getIncident().then((res) => {
      this.incident = res.data.data[0];
    });
  },
  data() {
    return {
      incident: {},

      incidentEffectLabel: {
        legal: "เกี่ยวข้องกับการดำเนินคดีด้านกฎหมาย",
        BCP: "เกี่ยวข้องกับ BCP",
        neither: "ไม่เกี่ยวข้องกับการดำเนินคดีทางกฎหมาย และ BCP",
      },

      form: {
        operator_name: "",
        operator_assignment: "",
        operator_assignment_date: new Date(),

        approver_name: user.fullname,

        process_name: "Solve Problem",
      },

      variable: {
        operator_assignment: "",
      },

      operator_assignment_options: [
        {
          value: "โปรดดำเนินการต่อไป",
          label: "โปรดดำเนินการต่อไป",
        },
        {
          value: null,
          label: "อื่น ๆ ",
        },
      ],

      loading: false,

      axiosOptions: {
        headers: authHeader(),
      },
    };
  },
  methods: {
    async assign() {
      try {
        this.loading = true;

        // submit
        var axiosData = {
          app: {
            appId: "mophApp",
            formId: "information_security_incident",
          },
          primaryKey: this.$route.params.id,
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
            processId: this.$route.params.process_id,
          },
          this.axiosOptions
        );

        await axios.post(
          `${process.env.VUE_APP_BACKEND_URL}/process/complete`,
          {
            activityId: viewProcess.data.activityId,
          },
          this.axiosOptions
        );
        this.loading = false;
        this.$router.push("/information_security_incident");
      } catch (error) {
        this.loading = false;
      }
    },
    getIncident() {
      const axiosData = {
        app: {
          appId: "mophApp",
          listId: "list_information_security_incident",
        },
        search: [
          {
            paramName: "id",
            paramValue: this.$route.params.id,
          },
        ],
      };
      return axios.post(
        `${process.env.VUE_APP_BACKEND_URL}/list/getOne`,
        axiosData,
        this.axiosOptions
      );
    },
  },
  watch: {
    "variable.operator_assignment": function (val) {
      if (!val) {
        this.form.operator_assignment = "";
      } else {
        this.form.operator_assignment = val;
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