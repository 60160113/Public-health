<template>
  <div>
    <!-- data center -->
    <CCard>
      <CCardHeader>
        <strong class="text-primary">รายละเอียดการติดต่อเข้าอาคาร</strong>
      </CCardHeader>

      <CCardBody>
        <CRow>
          <CCol md="6" v-if="form.checkin_card">
            <span
              ><b>หมายเลขบัตรเข้า - ออกอาคาร:</b>&nbsp;<CBadge
                color="success"
                style="font-size: 15px"
                >{{ form.checkin_card }}</CBadge
              ></span
            >
          </CCol>
          <CCol md="6" v-if="form.data_center_card">
            <span
              ><b>หมายเลขบัตรเข้า - ออกศูนย์ปฏิบัติการ:</b>&nbsp;<CBadge
                color="warning"
                style="font-size: 15px"
                >{{ form.data_center_card }}</CBadge
              ></span
            >
          </CCol>
        </CRow>
        <hr class="mb-2" v-if="form.checkin_card" />
        <CRow>
          <CCol md="6">
            <span><b>ผู้ร้องขอ:</b>&nbsp;{{ form.requester }}</span>
          </CCol>
          <CCol md="6">
            <span><b>ตำแหน่ง:</b>&nbsp;{{ form.position }}</span>
          </CCol>
        </CRow>
        <CRow class="mt-2">
          <CCol md="6">
            <span><b>สังกัด:</b>&nbsp;{{ form.affiliation }}</span>
          </CCol>
          <CCol md="6">
            <span><b>เลขที่บัตรประชาชน:</b>&nbsp;{{ form.idcard }}</span>
          </CCol>
        </CRow>
        <hr />
        <CRow class="mt-2">
          <CCol md="6">
            <span><b>วัตถุประสงค์:</b>&nbsp;{{ form.purpose }}</span>
          </CCol>
          <CCol md="6">
            <span><b>ผู้ติดต่อ:</b>&nbsp;{{ form.IST_name }}</span>
          </CCol>
        </CRow>
        <CRow class="mt-2">
          <CCol md="12">
            <span><b>หมายเหตุ:</b>&nbsp;{{ form.note }}</span>
          </CCol>
        </CRow>
      </CCardBody>
      <CElementCover :opacity="0.8" v-if="loading" />
    </CCard>
  </div>
</template>

<script>
import axios from "axios";
import { authHeader } from "@/helpers/auth-header";
export default {
  props: {
    id: {
      type: String,
      default: "",
    },
  },
  created() {
    this.loading = true;
    this.getData().then((res) => {
      this.form = res.data.data[0];
    });
    this.loading = false;
  },
  data() {
    return {
      form: {},

      loading: false,

      axiosOptions: {
        headers: authHeader(),
      },
    };
  },
  methods: {
    getData() {
      const axiosData = {
        app: {
          appId: "mophApp",
          listId: "list_data_center",
        },
        search: [
          {
            paramName: "processId",
            paramValue: this.id,
          },
        ],
      };
      return axios.post(
        `${process.env.VUE_APP_BACKEND_URL}/list/get`,
        axiosData,
        this.axiosOptions
      );
    },
  },
};
</script>