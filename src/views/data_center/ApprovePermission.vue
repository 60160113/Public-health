<template>
  <div>
    <CCard>
      <CCardHeader>
        <strong class="text-primary">ติดต่อเข้าอาคาร</strong>
      </CCardHeader>

      <CCardBody>
        <CRow>
          <CCol :md="{ size: '3' }">
            <h6 style="float: right"><strong>วันที่</strong></h6>
          </CCol>
          <CCol :md="{ size: '9' }">
            <h6>
              {{ new Date(hardwareList[0].date).getDate() }}
              {{ thaiMonth[new Date(hardwareList[0].date).getMonth()] }}
              {{ new Date(hardwareList[0].date).getFullYear() + 543 }}
            </h6>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>

    <CCard>
      <CCardHeader>
        <strong class="text-primary">รายการ Hardwares</strong>
      </CCardHeader>

      <CCardBody
        ><CDataTable
          :items="hardwareList"
          :fields="[
            { key: 'index', label: '#', _style: 'width:25%' },
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
            { key: 'action', label: 'Action', _style: 'width:10%' },
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
          <!-- <template #over-table>
            <div style="margin-bottom: 10px">
              <CButton color="primary" shape="pill" @click="modal = true">
                เพิ่ม
              </CButton>
            </div>
          </template> -->
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
  </div>
</template>

<script>
// import { DatePicker } from "v-calendar";
import axios from "axios";
// import { jogetService } from "@/helpers/joget-helper";
import { authHeader } from "@/helpers/auth-header";
export default {
  components: {
    // "v-date-picker": DatePicker,
    // jogetService,
    // authHeader,
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
      },

      hardware: {
        checkInId: "",
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

      enter: false,

      modal: false,

      hardwareList: [],
    };
  },
  created(){
  },
  methods: {
    addHardware() {
      this.hardwareList.push(this.hardware);
      this.hardware = {
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
          console.log(res);
          // this.checkIn.processName = "";
          this.checkIn.processName = "Approve Permission";
          this.checkIn.processId = res.data.processId;
          const axiosData = {
            app: {
              appId: "mophApp",
              formId: "checkIn",
            },
            primaryKey: "",
            formData: this.checkIn,
          };
          await axios
            .post(
              `${process.env.VUE_APP_BACKEND_URL}/form/submit`,
              axiosData,
              this.axiosOptions
            )
            .then(async (res) => {
              console.log(res);
              // const hardwareData = {
              //   app: {
              //     appId: "mophApp",
              //     formId: "hardware",
              //   },
              //   primaryKey: "",
              //   formData: this.checkIn,
              // };
              // await axios
              // .post
              this.hardwareList.forEach(async (element) => {
                element.processId = this.checkIn.processId;
                const itemsData = {
                  app: {
                    appId: "mophApp",
                    formId: "hardware",
                  },
                  primaryKey: "",
                  formData: element,
                };
                await axios
                  .post(
                    `${process.env.VUE_APP_BACKEND_URL}/form/submit`,
                    itemsData,
                    this.axiosOptions
                  )
                  .then((res) => {
                    console.log(res);
                  });
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
                        paramValue: this.enter,
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
                      this.$router.push(
                        "/data-center/list-approve-permission/"
                      );
                      // }
                    });
                });
            });
        });
    },
  },
};
</script>