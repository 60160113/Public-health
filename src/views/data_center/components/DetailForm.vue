<template>
  <div>
    <!-- data center -->
    <CCard>
      <CCardHeader>
        <strong class="text-primary">รายละเอียดการติดต่อเข้าอาคาร</strong>
      </CCardHeader>

      <CCardBody>
        <!-- Request ID -->
        <div id="request_id" v-if="form.request_id">
          <span
            ><b>ID:</b>&nbsp;<CBadge color="primary" style="font-size: 15px">{{
              form.request_id
            }}</CBadge></span
          >
          <hr class="mb-2" />
        </div>
        <!-- Card(s) ID -->
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

        <!-- Check-in form -->
        <div id="check-in-form">
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
        </div>

        <!-- ISM approve -->
        <div id="ISM" v-if="form.ISM_approve">
          <hr />
          <h5 class="text-primary">ผลการอนุมัติโดย ISM</h5>
          <br />
          <CRow>
            <CCol md="6">
              <span><b>ISM:</b>&nbsp;{{ form.ISM_name }}</span>
            </CCol>
            <CCol md="6">
              <span
                ><b>ผลการอนุมัติ:</b>&nbsp;{{
                  form.ISM_approve !== "approve" ? "ไม่" : ""
                }}อนุมัติให้เข้าศูนย์ปฏิบัติการ</span
              >
            </CCol>
          </CRow>
          <div class="mt-2">
            <span><b>ความคิดเห็น:</b>&nbsp;{{ form.ISM_comment }}</span>
          </div>
          <div class="mt-2">
            <span
              ><b>วันที่:</b>&nbsp;{{
                new Date(form.ISM_approve_date).toLocaleDateString()
              }}</span
            >
          </div>
        </div>

        <!-- IST approve -->
        <div id="IST" v-if="form.IST_approve">
          <hr />
          <h5 class="text-primary">ผลการเช็คอินเข้าศูนย์ปฏิบัติการ</h5>
          <br />
          <CRow>
            <CCol md="6">
              <span><b>IST:</b>&nbsp;{{ form.IST_name }}</span>
            </CCol>
            <CCol md="6">
              <span
                ><b>สถานะการเข้าศูนย์ปฏิบัติการ:</b>&nbsp;{{
                  form.IST_approve !== "approve" ? "ยกเลิกการ" : ""
                }}เข้าศูนย์ปฏิบัติการ</span
              >
            </CCol>
          </CRow>
          <div class="mt-2">
            <span><b>ความคิดเห็น:</b>&nbsp;{{ form.IST_comment }}</span>
          </div>
          <div class="mt-2">
            <span
              ><b>วันที่:</b>&nbsp;{{
                new Date(form.IST_approve_date).toLocaleDateString()
              }}</span
            >
          </div>
        </div>

        <!-- Security Guard -->
        <div id="security-guard" v-if="form.security_guard_review_date">
          <hr />
          <h5 class="text-primary">รปภ. ตรวจสอบความถูกต้อง (กรณีนำของออก)</h5>
          <br />
          <CInputCheckbox
            custom
            checked
            disabled
            readonly
            inline
            style="padding-top: 5px"
          />
          <b>ตรวจสอบแล้ว</b>
          <div class="mt-2">
            <span><b>รปภ.:</b>&nbsp;{{ form.security_guard_name }}</span>
          </div>
          <div class="mt-2">
            <span
              ><b>วันที่:</b>&nbsp;{{
                new Date(form.security_guard_review_date).toLocaleDateString()
              }}</span
            >
          </div>
        </div>
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
    this.getData()
      .then((res) => {
        this.form = res.data.data[0];
        this.loading = false;
      })
      .catch((err) => {
        this.loading = false;
      });
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