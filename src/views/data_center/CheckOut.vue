<template>
  <div>
    <PreviewData :id="$route.params.processId" />

    <CCard>
      <CCardHeader>
        <strong class="text-primary">รายการ Hardwares ที่ต้องการนำออก</strong>
      </CCardHeader>
      <CCardBody>
        <CDataTable
          :items="hardwareList"
          :fields="[
            { key: 'name', label: 'รายการ', _style: 'width:25%' },
            { key: 'brand', label: 'ยี่ห้อ/รุ่น', _style: 'width:10%' },
            {
              key: 'serial_number',
              label: 'S/N',
              _style: 'width:10%',
            },
            { key: 'unit', label: 'จำนวน (ชุด)', _style: 'width:15%' },
            { key: 'type', label: 'ชั่วคราว - ถาวร', _style: 'width:15%' },
            { key: 'action', label: '', _style: 'width:10%' },
          ]"
          :tableFilter="{
            label: 'ค้นหา: ',
            placeholder: 'ค้นหา',
          }"
          pagination
          :items-per-page="5"
          :itemsPerPageSelect="{
            label: 'แสดง',
          }"
          :loading="loading"
          hover
          striped
          border
        >
          <template #no-items-view
            ><div class="text-center">ไม่พบข้อมูล</div>
          </template>
          <template #over-table>
            <div style="margin-bottom: 10px">
              <CButton color="primary" shape="pill" @click="modal = true">
                เพิ่ม
              </CButton>
            </div>
          </template>
          <template #type="{ item }">
            <td>
              {{ item.type }}
              <p v-if="item.return_date">
                (ส่งคืนวันที่ {{ item.return_date.toLocaleDateString() }})
              </p>
            </td>
          </template>
          <template #action="{ index }">
            <td class="text-center">
              <CButton
                color="danger"
                shape="pill"
                @click="hardwareList.splice(index, 1)"
              >
                ลบ
              </CButton>
            </td>
          </template>
        </CDataTable></CCardBody
      >
      <CCardFooter>
        <CButton block color="primary" :disabled="loading" @click="submit()"
          >บันทึก</CButton
        >
      </CCardFooter>
      <CElementCover :opacity="0.8" v-if="loading" />
    </CCard>

    <!-- add hardware modal -->
    <CModal
      :show.sync="modal"
      :no-close-on-backdrop="true"
      :centered="true"
      size="xl"
      color="primary"
    >
      <CRow>
        <CCol col="6">
          <CInput label="ชื่อ" v-model="hardware.name" />
        </CCol>
        <CCol col="6">
          <CInput label="ยี่ห้อ" v-model="hardware.brand" />
        </CCol>

        <CCol col="6">
          <CInput label="S/N" v-model="hardware.serial_number" />
        </CCol>
        <CCol col="6">
          <CInput label="จำนวน" type="number" v-model="hardware.unit" />
        </CCol>
      </CRow>
      <hr />
      <CRow class="mt-2">
        <CCol>
          <label style="margin-top: 6px">รูปแบบ</label>
          <CInputRadioGroup
            :options="[
              { value: 'ชั่วคราว', label: 'ชั่วคราว' },
              { value: 'ถาวร', label: 'ถาวร' },
            ]"
            :checked.sync="hardware.type"
            custom
            inline
          />
        </CCol>
      </CRow>

      <div v-if="hardware.type == 'ชั่วคราว'">
        <hr />
        <CRow class="mt-3">
          <CCol>
            <label>วันที่ส่งคืน</label>
            <v-date-picker
              :min-date="new Date()"
              mode="date"
              :masks="{
                input: 'DD/MM/YYYY',
              }"
              v-model="hardware.return_date"
          /></CCol>
        </CRow>
      </div>
      <template #header>
        <h6 class="modal-title">นำเข้าสิ่งของเข้าศูนย์ปฏิบัติการฯ</h6>
        <CButtonClose @click="modal = false" class="text-white" />
      </template>
      <template #footer>
        <CButton @click="addHardware()" color="primary">บันทึก</CButton>
        <CButton @click="modal = false" color="secondary">ปิด</CButton>
      </template>
    </CModal>
  </div>
</template>

<script>
import { DatePicker } from "v-calendar";

import axios from "axios";
import { authHeader } from "@/helpers/auth-header";

import PreviewData from "@/views/data_center/components/PreviewData.vue";
const user = JSON.parse(localStorage.getItem("AuthUser"));
export default {
  components: {
    PreviewData,
    "v-date-picker": DatePicker,
  },
  created() {
    const axiosData = {
      app: {
        appId: "mophApp",
        listId: "list_data_center",
      },
      search: [
        {
          paramName: "processId",
          paramValue: this.$route.params.processId,
        },
      ],
    };
    axios
      .post(
        `${process.env.VUE_APP_BACKEND_URL}/list/get`,
        axiosData,
        this.axiosOptions
      )
      .then((res) => {
        this.form.id = res.data.data[0].id;
      });
  },
  data() {
    return {
      loading: false,

      modal: false,

      form: {
        id: "",

        security_guard_name: user.fullname,
        security_guard_review_date: new Date(),

        processName: "Complete",
      },

      hardwareList: [],

      hardware: {
        processId: this.$route.params.processId,
        name: "",
        brand: "",
        serial_number: "",
        unit: "",
        status: "ออก",
        type: "ชั่วคราว",
        return_date: null,
      },

      axiosOptions: {
        headers: authHeader(),
      },
    };
  },
  methods: {
    addHardware() {
      this.hardwareList.push(this.hardware);
      this.hardware = {
        processId: this.$route.params.processId,
        name: "",
        brand: "",
        serial_number: "",
        unit: "",
        status: "ออก",
        type: "ชั่วคราว",
        return_date: null,
      };
      this.modal = false;
    },
    async submit() {
      try {
        this.loading = true;

        // submit
        var axiosData = {
          app: {
            appId: "mophApp",
            formId: "data_center",
          },
          primaryKey: this.form.id,
          formData: this.form,
        };

        await axios.post(
          `${process.env.VUE_APP_BACKEND_URL}/form/submit`,
          axiosData,
          this.axiosOptions
        );

        // hardwares submit
        this.hardwareList.forEach(async (element) => {
          await axios.post(
            `${process.env.VUE_APP_BACKEND_URL}/form/submit`,
            {
              app: {
                appId: "mophApp",
                formId: "data_center_hardware",
              },
              primaryKey: "",
              formData: element,
            },
            this.axiosOptions
          );
        });

        // process/view
        const viewProcess = await axios.post(
          `${process.env.VUE_APP_BACKEND_URL}/process/view`,
          {
            processId: this.$route.params.processId,
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
        this.$router.push("/data-center/view-tasks/");
      } catch (error) {
        this.loading = false;
      }
    },
  },
};
</script>