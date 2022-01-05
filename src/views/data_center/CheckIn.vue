<template>
  <div>
    <!-- data center -->
    <CCard>
      <CCardHeader>
        <strong class="text-primary">ติดต่อเข้าอาคาร</strong>
      </CCardHeader>

      <CCardBody>
        <CRow>
          <CCol col="12">
            <CInput
              label="หมายเลขบัตร เข้า-ออก"
              v-model="checkIn.checkInCard"
            />
            <hr />
          </CCol>

          <CCol col="6">
            <CInput label="ผู้ร้องขอ" v-model="checkIn.requester" />
          </CCol>
          <CCol col="6">
            <CInput label="ตำแหน่ง" v-model="checkIn.position" />
          </CCol>

          <CCol col="6">
            <CInput label="สังกัด" v-model="checkIn.affiliation" />
          </CCol>
          <CCol col="6">
            <CInput
              label="เลขที่บัตรประชาชน"
              v-model="checkIn.idcard"
              maxlength="13"
            />
          </CCol>

          <CCol col="12">
            <hr />
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
                  v-model="checkIn.purpose"
                />
              </CCol>
            </CRow>
          </CCol>

          <CCol col="12">
            <CRow>
              <CCol>
                <label>วันที่ส่งคืน</label>
                <v-date-picker
                  :min-date="new Date()"
                  mode="date"
                  :masks="{
                    input: 'DD/MM/YYYY',
                  }"
                  v-model="checkIn.returnDate"
              /></CCol>
            </CRow>
          </CCol>
        </CRow>
        <hr />
        <CInputRadioGroup
          :options="[
            { value: 'true', label: 'เข้าศูนย์ปฏิบัติการ' },
            { value: 'false', label: 'ไม่เข้าศูนย์ปฏิบัติการ' },
          ]"
          :checked.sync="enter"
          custom
          inline
        />
      </CCardBody>
    </CCard>

    <!-- hardware -->
    <CCard v-if="JSON.parse(enter)">
      <CCardHeader>
        <strong class="text-primary">รายการ Hardwares</strong>
      </CCardHeader>

      <CCardBody
        ><CDataTable
          :items="hardwareList"
          :fields="[
            { key: 'name', label: 'Name', _style: 'width:25%' },
            { key: 'brand', label: 'Brand', _style: 'width:10%' },
            {
              key: 'serialNumber',
              label: 'Serial Number',
              _style: 'width:10%',
            },
            { key: 'unit', label: 'Unit', _style: 'width:15%' },
            { key: 'direction', label: 'Direction', _style: 'width:15%' },
            { key: 'type', label: 'Type', _style: 'width:15%' },
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
          <template #action="{ index }">
            <td>
              <CButton
                color="danger"
                shape="pill"
                @click="hardwareList.splice(index, 1)"
              >
                ลบ
              </CButton>
            </td>
          </template>
        </CDataTable>
      </CCardBody>
    </CCard>

    <CButton block color="primary" class="mt-3" @click="checkingIn()"
      >บันทึก</CButton
    >

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
          <CInput label="S/N" v-model="hardware.serialNumber" />
        </CCol>
        <CCol col="6">
          <CInput label="จำนวน" v-model="hardware.unit" />
        </CCol>
      </CRow>

      <CRow class="mt-3">
        <CCol col="3">
          <label style="margin-top: 6px">ดำเนินการ</label>
        </CCol>
        <CCol>
          <CInputRadioGroup
            :options="[
              { value: 'เข้า', label: 'เข้า' },
              { value: 'ออก', label: 'ออก' },
            ]"
            :checked.sync="hardware.direction"
            custom
            inline
          />
        </CCol>
      </CRow>

      <CRow class="mt-3">
        <CCol col="3">
          <label style="margin-top: 6px">รูปแบบ</label>
        </CCol>
        <CCol>
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
      <template #header>
        <h6 class="modal-title">นำเข้าสิ่งของเข้าศูนย์ปฏิบัติการฯ</h6>
        <CButtonClose @click="modal = false" class="text-white" />
      </template>
      <template #footer>
        <CButton @click="addHardware()" color="primary">บันทึก</CButton>
        <CButton @click="modal = false" color="secondary">ปิด</CButton>
      </template>
    </CModal>
    <CElementCover :opacity="0.8" v-if="loadingPage" />
  </div>
</template>

<script>
import { DatePicker } from "v-calendar";
import axios from "axios";
import { authHeader } from "@/helpers/auth-header";
export default {
  components: {
    "v-date-picker": DatePicker,
  },
  created() {
    if (this.$route.query.id) {
      const axiosData = {
        app: {
          appId: "mophApp",
          listId: "list_checkIn",
        },
        search: [
          {
            paramName: "id",
            paramValue: this.$route.query.id,
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
          this.checkIn = res.data.data[0];
          this.checkIn.date = new Date();
          this.checkIn.returnDate = null;
        });
    }

    this.getObjectives().then((res) => {
      this.objectiveOptions = res.data.data.map((item) => item.objective);
      this.objectiveOptions.push({
        value: "other",
        label: "อื่น ๆ",
      });
    });
  },
  data() {
    return {
      loadingPage: false,
      checkIn: {
        requester: "",
        position: "",
        affiliation: "",
        idcard: "",
        processId: "",
        processName: "",
        purpose: "",
        date: new Date(),
        returnDate: null,
        checkInCard: "",
        requestId: "",
      },

      handler: {
        purpose: "",
      },

      hardware: {
        processId: "",
        name: "",
        brand: "",
        serialNumber: "",
        unit: "",
        direction: "เข้า",
        type: "ชั่วคราว",
      },

      axiosOptions: {
        headers: authHeader(),
      },

      enter: "false",

      modal: false,

      hardwareList: [],

      objectiveOptions: [],
    };
  },
  methods: {
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
        this.axiosOptions
      );
    },
    addHardware() {
      this.hardwareList.push(this.hardware);
      this.hardware = {
        processId: "",
        name: "",
        brand: "",
        serialNumber: "",
        unit: "",
        direction: "เข้า",
        type: "ชั่วคราว",
      };
      this.modal = false;
    },
    async checkingIn() {
      this.loadingPage = true;
      const axiosData = {
        app: {
          appId: "mophApp",
          processDefId: "checkInOutProcess",
        },
      };
      await axios
        .post(
          `${process.env.VUE_APP_BACKEND_URL}/process/start`,
          axiosData,
          this.axiosOptions
        )
        .then(async (res) => {
          this.checkIn.processName = "Approve Permission";
          this.checkIn.requestId = "";
          this.checkIn.processId = res.data.processId;
          const axiosData = {
            app: {
              appId: "mophApp",
              formId: "checkIn",
            },
            primaryKey: res.data.processId,
            formData: this.checkIn,
          };
          await axios
            .post(
              `${process.env.VUE_APP_BACKEND_URL}/form/submit`,
              axiosData,
              this.axiosOptions
            )
            .then(async (res) => {
              await this.hardwareList.forEach(async (element) => {
                element.processId = this.checkIn.processId;
                const hardwareData = {
                  app: {
                    appId: "mophApp",
                    formId: "hardware",
                  },
                  primaryKey: "",
                  formData: {
                    processId: element.processId,
                    name: element.name,
                    brand: element.brand,
                    serialNumber: element.serialNumber,
                    unit: element.unit,
                    direction: element.direction,
                    type: element.type,
                  },
                };
                await axios.post(
                  `${process.env.VUE_APP_BACKEND_URL}/form/submit`,
                  hardwareData,
                  this.axiosOptions
                );
              });
              const processData = {
                processId: this.checkIn.processId,
              };
              await axios
                .post(
                  `${process.env.VUE_APP_BACKEND_URL}/process/view`,
                  processData,
                  this.axiosOptions
                )
                .then(async (res) => {
                  const activityId = res.data.activityId;
                  const processData = {
                    activityId: activityId,
                    variables: [
                      {
                        paramName: "enterStatus",
                        paramValue: JSON.parse(this.enter),
                      },
                    ],
                  };
                  await axios
                    .post(
                      `${process.env.VUE_APP_BACKEND_URL}/process/completeWithVariable`,
                      processData,
                      this.axiosOptions
                    )
                    .then(() => {
                      this.loadingPage = false;
                      this.$router.push("/data-center/view-tasks/");
                    });
                });
            });
        });
    },
  },
  watch: {
    "handler.purpose": function (val) {
      if (val == "other") {
        this.checkIn.purpose = "";
      } else {
        this.checkIn.purpose = val;
      }
    },
  },
};
</script>