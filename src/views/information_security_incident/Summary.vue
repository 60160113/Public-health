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

        <CRow class="mt-3">
          <CCol>
            <b>(1) รายละเอียดเหตุการณ์:</b>&nbsp;{{ incident.solving_detail }}
          </CCol>
        </CRow>
        <CRow class="mt-3">
          <CCol>
            <b>(2) วิธีการแก้ไขเหตุการณ์ไม่พึงประสงค์:</b>&nbsp;{{
              incident.solving_solution
            }}
          </CCol>
        </CRow>

        <hr />

        <CRow class="mt-2">
          <CCol>
            <b>(3) มอบ:</b>&nbsp;{{ incident.operator_name }} <br />
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
        <hr />
        <CRow class="mt-2">
          <CCol>
            <b>(4) เรียน ISM</b> <br />
            <div class="mt-2">
              <b>(2.1)</b>&nbsp;{{ incident.inform_ISM_solving_preliminary }}
            </div>
            <div class="mt-2">
              {{ incident.inform_ISM_solving_preliminary_detail }}
            </div>

            <div class="mt-2">
              <b>(2.2)</b>&nbsp;{{ incident.inform_ISM_solving_closed }}
            </div>
            <div class="mt-2">
              {{ incident.inform_ISM_solving_closed_detail }}
            </div>

            <div class="mt-2 text-right">
              <b>ลงชื่อ</b>&nbsp;{{ incident.operator_name }}&nbsp;<b
                >ผู้ดำเนินการ</b
              ><br />
              <b>วันที่</b>&nbsp;{{
                new Date(incident.inform_ISM_date).toLocaleDateString()
              }}
            </div>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
    <CCard>
      <CCardHeader>
        <h4>ตรวจสอบ</h4>
      </CCardHeader>
      <CCardBody>
        <CSelect
          label="เรียน ISMR"
          placeholder="กรุณาเลือกรายละเอียด"
          :value.sync="form.inform_ISMR"
          horizontal
          :options="inform_ISMR_options"
        />
        <CTextarea
          v-if="form.inform_ISMR"
          horizontal
          label="รายละเอียด"
          v-model="form.inform_ISMR_detail"
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
        inform_ISMR: "",
        inform_ISMR_detail: "",

        inform_ISMR_date: new Date(),

        process_name: "Review",
      },

      inform_ISMR_options: [
        "รับทราบการดำเนินงาน และให้เจ้าหน้าที่จัดเก็บเอกสารเข้าแฟ้ม",
        "เสนอให้ ISMR พิจารณาการลงโทษ",
        "อื่น ๆ",
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