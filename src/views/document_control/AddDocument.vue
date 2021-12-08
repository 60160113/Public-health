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
        <CInput
          v-if="form.purpose_code == 'ADD'"
          type="file"
          label="อัปโหลดไฟล์"
          @change="uploadHandler"
        />

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
          v-if="!handler.detail"
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
          v-if="!handler.effect"
          label="ระบุรายละเอียด"
          v-model="form.effect"
        />
      </CCardBody>
    </CCard>
  </div>
</template>

<script>
import { authHeader } from "@/helpers/auth-header";
import axios from "axios";

export default {
  created() {
    this.get_document_list();
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
        origin_file_id: "",
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
        { value: false, label: "อื่นๆ (ระบุ)" },
      ],

      effect_options: [
        {
          value: "ไม่มีผลกระทบ",
          label: "ไม่มีผลกระทบ",
        },
        { value: false, label: "มีผลกระทบ (ระบุ)" },
      ],

      document_list: [],

      file: null,
    };
  },
  methods: {
    async get_document_list() {
      var ticket = await this.alf_login({
        username: "jack",
        password: "ivsoft",
      });
      var hasMoreItems = false;
      const maxItems = 1000;
      var skipCount = 0;
      var arr = [];
      do {
        const response = await axios.get(
          `${process.env.VUE_APP_ALF_API}alfresco/versions/1/nodes/${process.env.VUE_APP_ALF_DOCUMENT_FOLDER_ID}/children?maxItems=${maxItems}&skipCount=${skipCount}&alf_ticket=${ticket}`
        );

        arr.push(...response.data.list.entries.map((item) => item.entry));

        hasMoreItems = response.data.list.pagination.hasMoreItems;
        skipCount += maxItems;
      } while (hasMoreItems);
      this.document_list = arr;
    },
    async alf_login(user) {
      const response = await axios.post(
        `${process.env.VUE_APP_ALF_SERVICES}login`,
        user
      );
      return response.data.data.ticket;
    },
    uploadHandler() {
      this.file = event.currentTarget.files[0];
    },
  },
  watch: {
    "form.purpose_code": function (val) {
      const index = this.purpose_options.findIndex((item) => item.value == val);
      this.form.purpose = this.purpose_options[index].label;
    },
  },
};
</script>