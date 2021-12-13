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
            <CInput
              label="ชื่อ - สกุล"
              v-model="form.requester_name"
              disabled
            />
          </CCol>

          <CCol col="6">
            <CInput
              label="ตำแหน่ง"
              v-model="form.requester_position"
              disabled
            />
          </CCol>
        </CRow>

        <hr />
        <!-- มีความประสงค์ -->
        <h5 class="text-primary">มีความประสงค์</h5>
        <CInput
          class="mt-3"
          v-model="form.purpose"
          label="มีความประสงค์"
          disabled
        />

        <!-- title, doc id -->
        <CInput v-model="form.document_id" label="รหัสเอกสาร" disabled />
        <CInput v-model="form.title" label="เรื่อง" disabled />

        <hr />
        <!-- รายละเอียดเพิ่มเติม -->
        <h5 class="text-primary">รายละเอียดเพิ่มเติม</h5>
        <CInput
          class="mt-3"
          label="รายละเอียด"
          v-model="form.detail"
          disabled
        />
        <hr />
        <!-- ผลกระทบกับเอกสารอื่นที่เกี่ยวข้อง -->
        <h5 class="text-primary">ผลกระทบกับเอกสารอื่นที่เกี่ยวข้อง</h5>
        <CInput
          class="mt-3"
          label="รายละเอียด"
          v-model="form.effect"
          disabled
        />
        <div class="mt-4 text-right">
          <b>ลงชื่อ</b>&nbsp;{{ form.requester_name }}&nbsp; <b>ผู้ร้องขอ</b>
          <br /><b>วันที่</b>&nbsp;{{
            new Date(form.dateCreated).toLocaleDateString()
          }}
        </div>

        <hr />
        <h5 class="text-primary">รับเอกสารร้องขอ</h5>
        <p>รับเอกสารเรียบร้อยแล้ว</p>

        <div class="mt-4 text-right">
          <b>ลงชื่อ</b>&nbsp;{{ form.IST_secretary_name }}&nbsp;
          <b>เลขาคณะทำงาน</b> <br /><b>วันที่</b>&nbsp;{{
            new Date(form.IST_secretary_date).toLocaleDateString()
          }}
        </div>

        <hr />

        <h5 class="text-primary">มติคณะกรรมการ</h5>
        <CInput
          class="mt-3"
          label="คณะทำงานพิจารณาการจัดทำ/แก้ไข/ยกเลิกเอกสารในระบบ ISMS แล้ว"
          v-model="form.ISM_approve"
          disabled
        />
        <div class="mt-4 text-right">
          <b>ลงชื่อ</b>&nbsp;{{ form.ISM_name }}&nbsp; <b>ประธานคณะทำงาน</b>
          <br /><b>วันที่</b>&nbsp;{{
            new Date(form.ISM_date).toLocaleDateString()
          }}
        </div>

        <hr />
        <CInput
          class="mt-3"
          label="คณะทำงานพิจารณาการจัดทำ/แก้ไข/ยกเลิกเอกสารในระบบ ISMS แล้ว"
          v-model="form.ISMR_approve"
          disabled
        />
        <CTextarea
          v-if="form.ISMR_approve_reason"
          class="mt-3"
          label="รายละเอียด"
          v-model="form.ISMR_approve_reason"
          disabled
        />
        <div class="mt-4 text-right">
          <b>ลงชื่อ</b>&nbsp;{{ form.ISMR_name }}&nbsp; <b>ISMR</b> <br /><b
            >วันที่</b
          >&nbsp;{{ new Date(form.ISMR_date).toLocaleDateString() }}
        </div>

        <hr />
        <h5 class="text-primary">Document Controller</h5>

        <CRow class="mt-3">
          <CCol>
            <b class="text-info">Hard copy</b>
            <ul class="mt-3">
              <li
                :key="index"
                v-for="(item, index) in form.hard_copy_list.split(',')"
              >
                {{ item }}
              </li>
            </ul>
          </CCol>
          <CCol>
            <b class="text-info">Soft copy</b>
            <ul class="mt-3">
              <li
                :key="index"
                v-for="(item, index) in form.soft_copy_list.split(',')"
              >
                {{ item }}
              </li>
            </ul></CCol
          >
        </CRow>

        <div class="mt-4 text-right">
          <b>ลงชื่อ</b>&nbsp;{{ form.DC_name }}&nbsp; <b>Document Control</b>
          <br /><b>วันที่</b>&nbsp;{{
            new Date(form.DC_date).toLocaleDateString()
          }}
        </div>
      </CCardBody>
    </CCard>
  </div>
</template>

<script>
import { authHeader } from "@/helpers/auth-header";
import axios from "axios";

export default {
  created() {
    this.getDC().then((res) => {
      this.form = res.data.data[0];
    });
  },
  data() {
    return {
      form: { hard_copy_list: "", soft_copy_list: "" },

      axiosOptions: {
        headers: authHeader(),
      },
    };
  },
  methods: {
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