<template>
  <div>
    <CCard>
      <CCardHeader>
        <h4>แบบควบคุมเอกสาร</h4>
      </CCardHeader>
      <CCardBody>
        <!-- คณะทำงานหรือผู้ร้องขอ -->
        <h5 class="text-primary">คณะทำงานหรือผู้ร้องขอ</h5>
        <CRow class="mt-3">
          <CCol col="6">
            <CInput label="ชื่อ - สกุล" v-model="dc.requester_name" disabled />
          </CCol>

          <CCol col="6">
            <CInput label="ตำแหน่ง" v-model="dc.requester_position" disabled />
          </CCol>
        </CRow>

        <hr />
        <!-- มีความประสงค์ -->
        <h5 class="text-primary">มีความประสงค์</h5>
        <CInput
          class="mt-3"
          v-model="dc.purpose"
          label="มีความประสงค์"
          disabled
        />

        <!-- title, doc id -->
        <CInput v-model="dc.document_id" label="รหัสเอกสาร" disabled />
        <CInput v-model="dc.title" label="เรื่อง" disabled />

        <hr />
        <!-- รายละเอียดเพิ่มเติม -->
        <h5 class="text-primary">รายละเอียดเพิ่มเติม</h5>
        <CInput class="mt-3" label="รายละเอียด" v-model="dc.detail" disabled />
        <hr />
        <!-- ผลกระทบกับเอกสารอื่นที่เกี่ยวข้อง -->
        <h5 class="text-primary">ผลกระทบกับเอกสารอื่นที่เกี่ยวข้อง</h5>
        <CInput class="mt-3" label="รายละเอียด" v-model="dc.effect" disabled />
        <div class="mt-4 text-right">
          <b>ลงชื่อ</b>&nbsp;{{ dc.requester_name }}&nbsp; <b>ผู้ร้องขอ</b>
          <br /><b>วันที่</b>&nbsp;{{
            new Date(dc.dateCreated).toLocaleDateString()
          }}
        </div>

        <hr />
        <h5 class="text-primary">รับเอกสารร้องขอ</h5>
        <p>รับเอกสารเรียบร้อยแล้ว</p>

        <div class="mt-4 text-right">
          <b>ลงชื่อ</b>&nbsp;{{ dc.IST_secretary_name }}&nbsp;
          <b>เลขาคณะทำงาน</b> <br /><b>วันที่</b>&nbsp;{{
            new Date(dc.IST_secretary_date).toLocaleDateString()
          }}
        </div>

        <hr />

        <h5 class="text-primary">มติคณะกรรมการ</h5>
        <CInput
          class="mt-3"
          label="คณะทำงานพิจารณาการจัดทำ/แก้ไข/ยกเลิกเอกสารในระบบ ISMS แล้ว"
          v-model="dc.ISM_approve"
          disabled
        />
        <div class="mt-4 text-right">
          <b>ลงชื่อ</b>&nbsp;{{ dc.ISM_name }}&nbsp; <b>ประธานคณะทำงาน</b>
          <br /><b>วันที่</b>&nbsp;{{
            new Date(dc.ISM_date).toLocaleDateString()
          }}
        </div>

        <hr />
        <CInput
          class="mt-3"
          label="คณะทำงานพิจารณาการจัดทำ/แก้ไข/ยกเลิกเอกสารในระบบ ISMS แล้ว"
          v-model="dc.ISMR_approve"
          disabled
        />
        <CTextarea
          v-if="dc.ISMR_approve_reason"
          class="mt-3"
          label="รายละเอียด"
          v-model="dc.ISMR_approve_reason"
          disabled
        />
        <div class="mt-4 text-right">
          <b>ลงชื่อ</b>&nbsp;{{ dc.ISMR_name }}&nbsp; <b>ISMR</b> <br /><b
            >วันที่</b
          >&nbsp;{{ new Date(dc.ISMR_date).toLocaleDateString() }}
        </div>
      </CCardBody>
    </CCard>
    <CCard>
      <CCardHeader>
        <h4>Document Controller</h4>
      </CCardHeader>
      <CCardBody>
        <CRow>
          <!-- Hard Copy -->
          <CCol
            ><h5 class="text-primary">Hard Copy</h5>
            <br />
            <CInputCheckbox
              class="mt-1"
              v-for="(option, index) in hard_copy_options"
              :key="index"
              :label="option"
              :value="option"
              custom
              @update:checked="onHardCopyChecked"
          /></CCol>
          <!-- Soft Copy -->
          <CCol>
            <h5 class="text-primary">Soft Copy</h5>
            <br />
            <CInputCheckbox
              class="mt-1"
              v-for="(option, index) in soft_copy_options"
              :key="index"
              :label="option"
              :value="option"
              custom
              @update:checked="onSoftCopyChecked"
            />
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>

    <CButton style="width: 100%" color="primary" @click="submit"
      >บันทึก</CButton
    >

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
    this.getDC().then((res) => {
      this.dc = res.data.data[0];
    });
  },
  data() {
    return {
      dc: {},
      form: {
        DC_name: user.fullname,
        hard_copy_list: "",
        soft_copy_list: "",
        DC_date: new Date(),

        process_name: "Complete",
      },

      handler: {
        hard_copy_list: [],
        soft_copy_list: [],
      },

      hard_copy_options: [
        "ปรับเอกสาร Master List",
        "แจ้งให้ผู้ที่เกี่ยวข้องทราบ",
        "จัดเก็บเอกสาร",
        "เรียกคืนเอกสาร (เรียกเก็บเอกสารเดิม)",
      ],

      soft_copy_options: [
        "นำเอกสารเดิมออกจากโฟลเดอร์ Current ไปไว้ที่โฟลเดอร์ Obsoleted",
        "นำเอกสารจากโฟลเดอร์ Draft ไปไว้ที่โฟลเดอร์ Current",
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

        // data
        Object.keys(this.handler).forEach((key) => {
          this.form[key] = this.handler[key].toString();
        });

        // submit
        var axiosData = {
          app: {
            appId: "mophApp",
            formId: "document_control",
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
        this.$router.push("/document_control");
      } catch (error) {
        this.loading = false;
      }
    },
    onHardCopyChecked(value, event) {
      if (value) {
        this.handler.hard_copy_list.push(event.target.value);
      } else {
        this.handler.hard_copy_list.forEach((item, index) => {
          if (item === event.target.value) {
            this.handler.hard_copy_list.splice(index, 1);
          }
        });
      }
    },
    onSoftCopyChecked(value, event) {
      if (value) {
        this.handler.soft_copy_list.push(event.target.value);
      } else {
        this.handler.soft_copy_list.forEach((item, index) => {
          if (item === event.target.value) {
            this.handler.soft_copy_list.splice(index, 1);
          }
        });
      }
    },
    getDC() {
      const axiosData = {
        app: {
          appId: "mophApp",
          listId: "list_document_control",
        },
        search: [
          {
            paramName: "process_id",
            paramValue: this.$route.params.process_id,
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
};
</script>