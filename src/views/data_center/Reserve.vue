<template>
  <div style="margin: 30px">
    <CCard v-if="!completed">
      <CCardHeader>
        <strong class="text-primary">ติดต่อเข้าอาคาร</strong>
      </CCardHeader>

      <CCardBody>
        <CRow>
          <CCol md="6">
            <CInput label="ผู้ร้องขอ" v-model="form.requester" />
          </CCol>
          <CCol md="6">
            <CInput label="ตำแหน่ง" v-model="form.position" />
          </CCol>

          <CCol md="6">
            <CInput label="สังกัด" v-model="form.affiliation" />
          </CCol>
          <CCol md="6">
            <CInput
              label="เลขที่บัตรประชาชน"
              v-model="form.idcard"
              maxlength="13"
            />
          </CCol>
        </CRow>

        <hr />
        <CRow>
          <CCol md="12">
            <CSelect
              label="ผู้ติดต่อ"
              placeholder="กรุณาเลือกผู้ติดต่อ"
              :value.sync="IST_index"
              :options="IST_options"
            />
          </CCol>
        </CRow>

        <CRow>
          <CCol :md="handler.purpose == 'other' ? 6 : 12">
            <CSelect
              label="วัตถุประสงค์"
              placeholder="กรุณาเลือกวัตถุประสงค์"
              :value.sync="handler.purpose"
              :options="objectiveOptions"
            />
          </CCol>
          <CCol :md="handler.purpose == 'other' ? 6 : 12">
            <CTextarea
              v-if="handler.purpose == 'other'"
              label="วัตถุประสงค์"
              v-model="form.purpose"
            />
          </CCol>
        </CRow>

        <CRow>
          <CCol col="12">
            <CTextarea label="หมายเหตุ" v-model="form.note" />
          </CCol>
        </CRow>
      </CCardBody>

      <CCardFooter>
        <CButton
          style="width: 100%"
          color="primary"
          @click="submit"
          :disabled="disabledButton"
          >บันทึก</CButton
        >
      </CCardFooter>
    </CCard>

    <CCard v-else>
      <CCardHeader><strong class="text-primary">เสร็จสิ้น</strong></CCardHeader>
      <CCardBody>ข้อมูลการจองของคุณถูกจัดเก็บไปยังฐานข้อมูลเสร็จสิ้น</CCardBody>
    </CCard>

    <CElementCover :opacity="0.8" v-if="loading" />
  </div>
</template>

<script>
import axios from "axios";

export default {
  async created() {
    try {
      this.loading = true;

      // login
      const login_res = await this.login("application", "application");
      this.headers = {
        headers: { Authorization: "Bearer " + login_res.data.token },
      };

      // IST
      const IST_res = await this.getAccounts();
      this.IST_options = IST_res.data.data.map((item, index) => {
        return {
          value: index,
          label: item.fullname,
          data: item,
        };
      });

      // objective
      const obj_res = await this.getObjectives();
      this.objectiveOptions = obj_res.data.data.map((item) => item.objective);
      this.objectiveOptions.push({
        value: "other",
        label: "อื่น ๆ",
      });

      this.loading = false;
    } catch (error) {
      this.loading = false;
    }
  },
  data() {
    return {
      form: {
        requester: "",
        position: "",
        affiliation: "",
        idcard: "",
        purpose: "",

        IST_id: "",
        IST_name: "",

        note: "",
      },

      handler: {
        purpose: "",
      },

      IST_index: "",

      objectiveOptions: [],
      IST_options: [],

      headers: {},

      loading: false,
      completed: false,
    };
  },
  methods: {
    login(email, password) {
      const axiosHeader = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      return axios.post(
        `${process.env.VUE_APP_BACKEND_URL}/auth/login`,
        {
          email,
          password,
        },
        axiosHeader
      );
    },
    getObjectives() {
      const axiosData = {
        app: {
          appId: "mophApp",
          listId: "list_data_center_objectives",
        },
        search: [
          {
            paramName: "status",
            paramValue: "active",
          },
        ],
      };
      return axios.post(
        `${process.env.VUE_APP_BACKEND_URL}/list/get`,
        axiosData,
        this.headers
      );
    },
    getAccounts() {
      const axiosData = {
        app: {
          appId: "mophApp",
          listId: "user_accounts",
        },
      };
      return axios.post(
        `${process.env.VUE_APP_BACKEND_URL}/list/getAll`,
        axiosData,
        this.headers
      );
    },
    submit() {
      this.loading = true;
      var formData = { ...this.form };
      if (this.handler.purpose !== "other") {
        formData.purpose = this.handler.purpose;
      }
      const axiosData = {
        app: {
          appId: "mophApp",
          formId: "data_center",
        },
        primaryKey: "",
        formData: formData,
      };
      axios
        .post(
          `${process.env.VUE_APP_BACKEND_URL}/form/submit`,
          axiosData,
          this.headers
        )
        .then(() => {
          setInterval(() => {
            this.completed = true;
            this.loading = false;
          }, 700);
        })
        .catch((err) => {
          this.loading = false;
        });
    },
  },
  computed: {
    disabledButton() {
      var form = { ...this.form };
      Object.keys(this.handler).forEach((key) => {
        form[key] = this.handler[key];
      });
      return Object.values(form).includes("");
    },
  },
  watch: {
    IST_index: function (val) {
      this.form.IST_id = this.IST_options[val].data.id;
      this.form.IST_name = this.IST_options[val].data.fullname;
    },
  },
};
</script>