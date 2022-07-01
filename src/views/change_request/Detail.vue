<template>
  <div>
    <p><b>เลขที่เอกสาร:</b>&nbsp;{{ form.change_request_id }}</p>
    <hr />
    <!-- SECTION 1 -->
    <div id="section-1">
      <h5 class="text-primary">
        <b>ส่วนที่ 1 รายละเอียดการขออนุมัติดำเนินการเปลี่ยนแปลง</b>
      </h5>
      <br />
      <p>
        <b>วันที่ร้องขอ:</b>&nbsp;{{ toThaiFormatWithTime(form.dateCreated) }}
      </p>
      <CRow>
        <CCol>
          <p>
            <b>วันที่เริ่มดำเนินการ:</b>&nbsp;{{
              toThaiFormatWithTime(form.start_date)
            }}
          </p></CCol
        >
        <CCol
          ><p>
            <b>วันที่คาดว่าแล้วเสร็จ:</b>&nbsp;{{
              toThaiFormatWithTime(form.end_date)
            }}
          </p></CCol
        >
      </CRow>
      <p><b>มีความประสงค์ขอเปลี่ยนแปลงเรื่อง:</b>&nbsp;{{ form.subject }}</p>
      <p><b>เหตุผลที่ขอเปลี่ยนแปลง:</b>&nbsp;{{ form.reason }}</p>
      <div v-if="form.type">
        <p><b>ประเภทของการเปลี่ยนแปลง:</b>&nbsp;{{ form.type }}</p>
      </div>
      <p><b>ระบบที่เกี่ยวข้อง:</b>&nbsp;{{ form.related_system }}</p>
      <p><b>เอกสารที่แนบมาด้วย:</b>&nbsp;{{ form.attachment }}</p>
      <p><b>รายละเอียดการเปลี่ยนแปลง:</b>&nbsp;{{ form.change_detail }}</p>
      <p><b>ผลกระทบจากการเปลี่ยนแปลง:</b>&nbsp;{{ form.change_effect }}</p>
      <p>
        <b>แนวทาง / ขั้นตอนการดำเนินงาน:</b>&nbsp;{{ form.change_procedure }}
      </p>
      <hr />
      <CRow>
        <CCol>
          <p><b>ผู้ร้องขอดำเนินการ:</b>&nbsp;{{ form.requester_name }}</p>
          <p><b>ตำแหน่ง:</b>&nbsp;{{ form.requester_position }}</p>
          <p>
            <b>วันที่:</b>&nbsp;{{ toThaiFormatWithTime(form.dateCreated) }}
          </p>
        </CCol>

        <CCol v-if="form.ISM_name" style="border-left: 4px solid #39f">
          <p><b>หัวหน้าทีม:</b>&nbsp;{{ form.ISM_name }}</p>
          <p><b>ตำแหน่ง:</b>&nbsp;{{ form.ISM_position }}</p>
          <p><b>วันที่:</b>&nbsp;{{ toThaiFormatWithTime(form.ISM_date) }}</p>
        </CCol>
      </CRow>
    </div>

    <!-- SECTION 2 -->
    <div id="section-2" v-if="form.change_approve">
      <hr />
      <h5 class="text-primary">ส่วนที่ 2 การพิจารณาอนุมัติการเปลี่ยนแปลง</h5>
      <br />
      <p>
        <b>ผลพิจารณาอนุมัติให้ดำเนินการ:</b>&nbsp;{{
          form.change_approve_label
        }}
      </p>

      <div v-if="form.change_approve_comment">
        <p><b>เนื่องจาก:</b>&nbsp;{{ form.change_approve_comment }}</p>
      </div>
      <p><b>ผู้รับรองผล: </b>&nbsp;{{ form.approver_name }}</p>
      <p><b>ตำแหน่ง: </b>&nbsp;{{ form.approver_position }}</p>
      <p><b>วันที่: </b>&nbsp;{{ toThaiFormatWithTime(form.approver_date) }}</p>
    </div>

    <!-- SECTION 3 -->
    <div id="section-3" v-if="form.operation_status">
      <hr />
      <h5 class="text-primary">
        ส่วนที่ 3 รายงานผลการดำเนินการเปลี่ยนแปลง (ผู้ดำเนินการเปลี่ยนแปลง)
      </h5>
      <br />
      <p><b>ผลดำเนินการ: </b>&nbsp;{{ form.operation_status }}</p>

      <div v-if="form.operation_comment">
        <p><b>เนื่องจาก:</b>&nbsp;{{ form.operation_comment }}</p>
      </div>
      <p><b>รายละเอียดการดำเนินงาน: </b>&nbsp;{{ form.operation_detail }}</p>
      <p><b>ผู้ดำเนินการการเปลี่ยนแปลง: </b>&nbsp;{{ form.operator_name }}</p>
      <p><b>ตำแหน่ง: </b>&nbsp;{{ form.operator_position }}</p>
      <p><b>วันที่: </b>&nbsp;{{ toThaiFormatWithTime(form.operator_date) }}</p>
    </div>

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
    processId: {
      type: String,
      default: "",
    },
  },
  created() {
    this.loading = true;
    this.jogetGetOne("mophApp", "list_change_request", [
      {
        paramName: "processId",
        paramValue: this.processId,
      },
    ])
      .then((res) => {
        this.form = res.data;
        this.loading = false;
      })
      .catch((err) => {
        this.loading = false;
      });
  },
  data() {
    return {
      form: {},
      loading: true,
    };
  },
};
</script>

<style scoped>
p {
  font-size: 16px;
}
</style>