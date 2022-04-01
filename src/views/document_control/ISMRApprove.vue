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
              v-model="dc.requester_name"
              disabled
            />
          </CCol>

          <CCol col="6">
            <CInput
              label="ตำแหน่ง"
              v-model="dc.requester_position"
              disabled
            />
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
        <CInput
          class="mt-3"
          label="รายละเอียด"
          v-model="dc.detail"
          disabled
        />
        <hr />
        <!-- ผลกระทบกับเอกสารอื่นที่เกี่ยวข้อง -->
        <h5 class="text-primary">ผลกระทบกับเอกสารอื่นที่เกี่ยวข้อง</h5>
        <CInput
          class="mt-3"
          label="รายละเอียด"
          v-model="dc.effect"
          disabled
        />
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
      </CCardBody>
    </CCard>
    <CCard>
      <CCardHeader>
        <h4>มติคณะกรรมการ</h4>
      </CCardHeader>
      <CCardBody>
        <h5 class="text-primary">
          คณะทำงานพิจารณาการจัดทำ/แก้ไข/ยกเลิกเอกสารในระบบ ISMS แล้ว
        </h5>
        <CInputRadioGroup
          class="mt-3"
          :options="verify_options"
          :checked.sync="verify"
          custom
          inline
        />

        <div v-if="verify !== 'approve'">
          <br />
          <CTextarea
            :label="verify == 'reject' ? 'สาเหตุ' : 'เพิ่มเติม'"
            v-model="form.ISMR_approve_reason"
          />
        </div>
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
        ISMR_name: user.fullname,
        ISMR_approve: "อนุมัติการจัดทำ/แก้ไข/ยกเลิกเอกสาร ตามที่เสนอ",
        ISMR_approve_reason: "",
        ISMR_date: new Date(),
        process_name: "Document Control Review",
      },

      verify: "approve",

      verify_options: [
        {
          value: "approve",
          label: "อนุมัติการจัดทำ/แก้ไข/ยกเลิกเอกสาร ตามที่เสนอ",
        },
        { value: "approve;", label: "อนุมัติโดยให้แก้ไข/เพิ่มเติม" },
        { value: "reject", label: "ไม่อนุมัติ" },
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
        const dc_data = await axios.post(
          `${process.env.VUE_APP_BACKEND_URL}/list/getOne`,
          {
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
          },
          this.axiosOptions
        );

        const dc = dc_data.data.data[0];

        if (this.verify == "reject") {
          this.form.process_name = "Edit document";
          this.form["file_id"] = "";

          if (dc.purpose_code != "CANCEL") {
            this.removeFile(dc.file_id);
          }
        } else if (dc.purpose_code == "CANCEL") {
          // CANCEL FILE
          this.removeFile(dc.file_id);
        } else if (dc.purpose_code == "EDIT") {
          // EDIT FILE
          this.updateFile(dc.original_file_id, dc.file_id).then(() => {
            this.removeFile(dc.file_id);
          });
        }

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
          `${process.env.VUE_APP_BACKEND_URL}/process/completeWithVariable`,
          {
            activityId: viewProcess.data.activityId,
            variables: [
              {
                paramName: "ISMR_approve",
                paramValue: this.verify.replace(";", ""),
              },
            ],
          },
          this.axiosOptions
        );
        this.loading = false;
        this.$router.push("/document_control");
      } catch (error) {
        this.loading = false;
      }
    },
    removeFile(id) {
      return this.$alf_request.delete(
        `${process.env.VUE_APP_ALF_API}alfresco/versions/1/nodes/${id}`
      );
    },
    async updateFile(source_id, id) {
      const file_data = await this.$alf_request({
        url: `${process.env.VUE_APP_ALF_API}alfresco/versions/1/nodes/${id}?fields=name`,
        method: "GET",
      });
      const blob = await this.$alf_request({
        url: `${process.env.VUE_APP_ALF_API}alfresco/versions/1/nodes/${id}/content`,
        method: "GET",
        responseType: "blob",
      });
      const file = new File([blob.data], file_data.data.entry.name);

      return await this.$alf_request.put(
        `${process.env.VUE_APP_ALF_API}alfresco/versions/1/nodes/${source_id}/content`,
        file
      );
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
  watch: {
    verify: function (val) {
      const index = this.verify_options.findIndex((item) => item.value == val);
      this.form.ISMR_approve = this.verify_options[index].label;

      if (val == "approve") {
        this.form.ISMR_approve_reason = "";
      }
    },
  },
};
</script>