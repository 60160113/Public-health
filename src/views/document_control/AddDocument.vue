<template>
  <div>
    <CCard>
      <CCardHeader>
        <h4>การควบคุมเอกสาร</h4>
      </CCardHeader>
      <CCardBody>
        <!-- คณะทำงานหรือผู้ร้องขอ -->
        <h5 class="text-primary">คณะทำงานหรือผู้ร้องขอ</h5>
        <CRow class="mt-3">
          <CCol col="6">
            <CInput label="ชื่อ - สกุล" v-model="form.requester_name" />
          </CCol>

          <CCol col="6">
            <CInput label="ตำแหน่ง" v-model="form.requester_position" />
          </CCol>
        </CRow>

        <hr />
        <!-- มีความประสงค์ -->
        <h5 class="text-primary">มีความประสงค์</h5>
        <CInputRadioGroup
          class="mt-3"
          :options="purpose_options"
          :checked.sync="form.purpose_code"
          custom
          inline
        />

        <br />
        <!-- มีความประสงค์ (ADD, EDIT, CANCEL) -->
        <!-- ADD -->
        <div v-if="form.purpose_code == 'ADD'">
          <CInput type="file" label="อัปโหลดไฟล์" @change="uploadHandler" />
        </div>

        <!-- EDIT, CANCEL -->
        <div v-else class="mb-2">
          <label>เลือกเอกสาร</label>&nbsp;
          <CButton
            style="width: 100%"
            color="primary"
            @click.prevent="
              modal = true;
              file_name = '';
              form.original_file_id = '';
            "
            >เลือกเอกสาร</CButton
          >
          <div v-if="file_name">
            <br />
            <CInput disabled v-model="file_name" label="ชื่อเอกสาร" />
            <div v-if="form.purpose_code == 'EDIT'">
              <CInput
                type="file"
                label="อัปโหลดไฟล์ที่แก้ไข"
                @change="uploadHandler"
              />
            </div>
          </div>
        </div>

        <!-- title, doc id -->
        <CInput v-model="form.document_id" label="รหัสเอกสาร" />
        <CInput v-model="form.title" label="เรื่อง" />

        <hr />
        <!-- รายละเอียดเพิ่มเติม -->
        <h5 class="text-primary">รายละเอียดเพิ่มเติม</h5>
        <CInputRadioGroup
          class="mt-3"
          :options="detail_options"
          :checked.sync="handler.detail"
          custom
          inline
        />
        <CInput
          class="mt-3"
          v-if="handler.detail == 'false'"
          label="ระบุรายละเอียด"
          v-model="form.detail"
        />
        <hr />
        <!-- ผลกระทบกับเอกสารอื่นที่เกี่ยวข้อง -->
        <h5 class="text-primary">ผลกระทบกับเอกสารอื่นที่เกี่ยวข้อง</h5>
        <CInputRadioGroup
          class="mt-3"
          :options="effect_options"
          :checked.sync="handler.effect"
          custom
          inline
        />
        <CInput
          class="mt-3"
          v-if="handler.effect == 'false'"
          label="ระบุรายละเอียด"
          v-model="form.effect"
        />
      </CCardBody>
    </CCard>

    <CButton style="width: 100%" color="primary" @click="submit"
      >บันทึก</CButton
    >

    <!-- browse file modal -->
    <CModal
      v-if="modal"
      :show.sync="modal"
      :no-close-on-backdrop="true"
      :centered="true"
      size="lg"
      color="primary"
    >
      <BrowseFile :onComplete="selectFile" />
      <template #header>
        <h6 class="modal-title">เลือกเอกสาร</h6>
        <CButtonClose @click="modal = false" class="text-white" />
      </template>
      <template #footer><div /></template>
    </CModal>

    <CElementCover :opacity="0.8" v-if="loading" />
  </div>
</template>

<script>
import { authHeader } from "@/helpers/auth-header";
import axios from "axios";

import BrowseFile from "./file/BrowseFile.vue";

const user = JSON.parse(localStorage.getItem("AuthUser"));

const $http = axios.create({
  headers: { Authorization: "Basic " + window.btoa(user.ticket) },
});

export default {
  components: {
    BrowseFile,
  },
  data() {
    return {
      form: {
        requester_name: "",
        requester_position: "",

        purpose: "จัดทำเอกสารใหม่",
        purpose_code: "ADD",

        detail: "",
        effect: "",

        file_id: "",
        original_file_id: "",

        document_id: "",
        title: "",

        process_name: "IST Secretary Review",
        process_id: "",
      },

      handler: {
        detail: "ปรับปรุงใหม่ให้เหมาะสมกับการปฏิบัติงาน",
        effect: "ไม่มีผลกระทบ",
      },

      purpose_options: [
        { value: "ADD", label: "จัดทำเอกสารใหม่" },
        { value: "EDIT", label: "แก้ไขเอกสาร" },
        { value: "CANCEL", label: "ยกเลิกเอกสาร" },
      ],

      detail_options: [
        {
          value: "ปรับปรุงใหม่ให้เหมาะสมกับการปฏิบัติงาน",
          label: "ปรับปรุงใหม่ให้เหมาะสมกับการปฏิบัติงาน",
        },
        { value: "ขอยกเลิกเอกสาร", label: "ขอยกเลิกเอกสาร" },
        { value: "false", label: "อื่นๆ (ระบุ)" },
      ],

      effect_options: [
        {
          value: "ไม่มีผลกระทบ",
          label: "ไม่มีผลกระทบ",
        },
        { value: "false", label: "มีผลกระทบ (ระบุ)" },
      ],

      document_list: [],

      file: null,

      file_name: "",

      modal: false,
      loading: false,

      axiosOptions: {
        headers: authHeader(),
      },
    };
  },
  methods: {
    uploadHandler() {
      this.file = event.currentTarget.files[0];
    },
    selectFile(id, name) {
      this.form.original_file_id = id;
      this.file_name = name;

      this.modal = false;
    },
    upload(folderId) {
      var formData = new FormData();
      formData.append("filedata", this.file);

      return $http.post(
        `${process.env.VUE_APP_ALF_API}alfresco/versions/1/nodes/${folderId}/children?autoRename=true`,
        formData
      );
    },
    async submit() {
      this.loading = true;
      // start Process
      var axiosData = {
        app: {
          appId: "mophApp",
          processDefId: "documentControlProcess",
        },
      };
      const startProcess = await axios.post(
        `${process.env.VUE_APP_BACKEND_URL}/process/start`,
        axiosData,
        this.axiosOptions
      );

      // manage form
      Object.keys(this.handler).forEach((key) => {
        if (this.handler[key] != "false") {
          this.form[key] = this.handler[key];
        }
      });
      if (this.form.purpose_code == "CANCEL") {
        this.form.file_id = this.form.original_file_id;
      } else {
        var nodeId =
          this.form.purpose_code == "ADD"
            ? process.env.VUE_APP_ALF_DOCUMENT_FOLDER_ID
            : process.env.VUE_APP_ALF_DRAFT_FOLDER_ID;
        const upload = await this.upload(nodeId);

        this.form.file_id = upload.data.entry.id;
      }
      console.log(this.form);

      // submit
      this.form.process_id = startProcess.data.processId;
      axiosData = {
        app: {
          appId: "mophApp",
          formId: "document_control",
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
        `${process.env.VUE_APP_BACKEND_URL}/process/complete`,
        {
          activityId: viewProcess.data.activityId,
        },
        this.axiosOptions
      );
      this.loading = false;
      this.$router.push("/document_control");
    },
  },
  watch: {
    "form.purpose_code": function (val) {
      const index = this.purpose_options.findIndex((item) => item.value == val);
      this.form.purpose = this.purpose_options[index].label;

      this.file_name = "";
      this.form.original_file_id = "";

      this.file = null;
    },
  },
};
</script>