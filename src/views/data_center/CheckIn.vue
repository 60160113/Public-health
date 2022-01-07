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
              label="หมายเลขบัตร เข้า-ออกอาคาร"
              v-model="checkIn.checkin_card"
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

              <CCol md="12">
                <CSelect
                  label="ผู้ติดต่อ"
                  placeholder="กรุณาเลือกผู้ติดต่อ"
                  :value.sync="IST_index"
                  :options="IST_options"
                />
              </CCol>
            </CRow>
          </CCol>

          <CCol col="12">
            <CTextarea label="หมายเหตุ" v-model="checkIn.note" />
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
      <CElementCover :opacity="0.8" v-if="loadingPage" />
    </CCard>

    <!-- hardware -->
    <CCard v-if="JSON.parse(enter)">
      <CCardHeader>
        <strong class="text-primary">รายการ Hardwares ที่ต้องการนำเข้า</strong>
      </CCardHeader>

      <CCardBody
        ><CDataTable
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
        </CDataTable>
      </CCardBody>
      <CElementCover :opacity="0.8" v-if="loadingPage" />
    </CCard>

    <CButton
      block
      color="primary"
      class="mt-3"
      @click.prevent="checkingIn()"
      :disabled="loadingPage"
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
export default {
  components: {
    "v-date-picker": DatePicker,
  },
  async created() {
    this.loadingPage = true;
    // get user account
    await this.getAccounts().then((res) => {
      this.IST_options = res.data.data.map((item, index) => {
        return {
          value: index,
          label: item.fullname,
          data: item,
        };
      });
    });
    // get objective
    await this.getObjectives().then((res) => {
      this.objectiveOptions = res.data.data.map((item) => item.objective);
      this.objectiveOptions.push({
        value: "other",
        label: "อื่น ๆ",
      });
    });
    // get data
    if (this.$route.query.id) {
      const axiosData = {
        app: {
          appId: "mophApp",
          listId: "list_data_center",
        },
        search: [
          {
            paramName: "id",
            paramValue: this.$route.query.id,
          },
        ],
      };
      await axios
        .post(
          `${process.env.VUE_APP_BACKEND_URL}/list/get`,
          axiosData,
          this.axiosOptions
        )
        .then((res) => {
          this.checkIn = { ...res.data.data[0] };
          this.checkIn.contact_date = new Date();

          this.IST_index = this.IST_options.findIndex(
            (item) => item.data.id == res.data.data[0].IST_id
          );

          if (
            this.objectiveOptions.findIndex(
              (item) => item == res.data.data[0].purpose
            ) == -1
          ) {
            this.handler.purpose = "other";
          } else {
            this.handler.purpose = res.data.data[0].purpose;
          }
          setTimeout(() => {
            this.checkIn.purpose = res.data.data[0].purpose;
          }, 200);
        });
    }
    this.loadingPage = false;
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
        contact_date: new Date(),
        checkin_card: "",

        IST_id: "",
        IST_name: "",

        note: "",
      },

      handler: {
        purpose: "",
      },

      IST_index: "",

      hardware: {
        processId: "",
        name: "",
        brand: "",
        serial_number: "",
        unit: "",
        status: "เข้า",
        type: "ชั่วคราว",
        return_date: null,
      },

      axiosOptions: {
        headers: authHeader(),
      },

      enter: "false",

      modal: false,

      hardwareList: [],

      objectiveOptions: [],

      IST_options: [],
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
        this.axiosOptions
      );
    },
    addHardware() {
      this.hardwareList.push(this.hardware);
      this.hardware = {
        processId: "",
        name: "",
        brand: "",
        serial_number: "",
        unit: "",
        status: "เข้า",
        type: "ชั่วคราว",
        return_date: null,
      };
      this.modal = false;
    },
    async checkingIn() {
      this.loadingPage = true;
      const axiosData = {
        app: {
          appId: "mophApp",
          processDefId: "data_center_process",
        },
      };
      await axios
        .post(
          `${process.env.VUE_APP_BACKEND_URL}/process/start`,
          axiosData,
          this.axiosOptions
        )
        .then(async (res) => {
          if (JSON.parse(this.enter)) {
            this.checkIn.processName = "Consider Requirement";
          } else {
            this.checkIn.processName = "Check Out";
          }

          this.checkIn.processId = res.data.processId;
          var formData = { ...this.checkIn };
          if (this.handler.purpose !== "other") {
            formData.purpose = this.handler.purpose;
          }
          const axiosData = {
            app: {
              appId: "mophApp",
              formId: "data_center",
            },
            primaryKey: res.data.processId,
            formData: formData,
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
                    formId: "data_center_hardware",
                  },
                  primaryKey: "",
                  formData: element,
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
                        paramName: "enter_operation_center",
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
    IST_index: function (val) {
      this.checkIn.IST_id = this.IST_options[val].data.id;
      this.checkIn.IST_name = this.IST_options[val].data.fullname;
    },
  },
};
</script>