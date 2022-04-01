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

        <hr />

        <CRow class="mt-2">
          <CCol>
            <b>มอบ:</b>&nbsp;{{ incident.operator_name }} <br />
            <div class="mt-2">{{ incident.operator_assignment }}</div>

            <div class="mt-2 text-right">
              <b>ลงชื่อ</b>&nbsp;{{ incident.ISMR_name }}&nbsp;<b>ผู้อนุมัติ</b
              ><br />
              <b>วันที่</b>&nbsp;{{
                new Date(incident.operator_assignment_date).toLocaleDateString()
              }}
            </div>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
    <CCard>
      <CCardHeader>
        <h4>แก้ไขปัญญา</h4>
      </CCardHeader>
      <CCardBody>
        <CTextarea
          horizontal
          label="รายละเอียดเหตุการณ์"
          v-model="form.solving_detail"
        />
        <CTextarea
          horizontal
          label="วิธีการแก้ไขเหตุการณ์ไม่พึงประสงค์"
          v-model="form.solving_solution"
        />
        <hr />

        <CSelect
          label="รายละเอียดการแก้ไขเบื้องต้น"
          placeholder="กรุณาเลือกรายละเอียด"
          :value.sync="form.inform_ISM_solving_preliminary"
          horizontal
          :options="solving_preliminary_options"
        />
        <CTextarea
          v-if="form.inform_ISM_solving_preliminary"
          horizontal
          label="รายละเอียด"
          v-model="form.inform_ISM_solving_preliminary_detail"
        />
        <hr />

        <CSelect
          label="รายละเอียดการแก้ไขถาวร"
          placeholder="กรุณาเลือกรายละเอียด"
          :value.sync="form.inform_ISM_solving_closed"
          horizontal
          :options="solving_closed_options"
        />
        <CTextarea
          v-if="form.inform_ISM_solving_closed"
          horizontal
          label="รายละเอียด"
          v-model="form.inform_ISM_solving_closed_detail"
        />

        <CButton
          :disabled="disabled_button"
          block
          color="primary"
          class="mt-3"
          @click.prevent="submit()"
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
        solving_detail: "",
        solving_solution: "",

        inform_ISM_solving_preliminary: "",
        inform_ISM_solving_preliminary_detail: "",

        inform_ISM_solving_closed: "",
        inform_ISM_solving_closed_detail: "",

        inform_ISM_date: new Date(),
        process_name: "Summary",
      },

      solving_preliminary_options: [
        "ดำเนินการแก้ไขเบื้องต้นแล้ว เสร็จเวลา..............................น.",
        "อื่น ๆ ",
      ],

      solving_closed_options: [
        "ดำเนินการแก้ไขถาวรแล้ว (Closed)",
        "Lesson Learned (กรณีที่เป็นเหตุการณ์สำคัญ)",
        "อื่น ๆ ",
      ],

      loading: false,

      axiosOptions: {
        headers: authHeader(),
      },
    };
  },
  methods: {
    async submit() {
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