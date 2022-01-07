<template>
  <div>
    <PreviewData :id="$route.params.processId" />

    <CCard>
      <CCardFooter>
        <CButton
          color="success"
          class="float-right ml-1"
          @click="approvePermission()"
          >อนุมัติ</CButton
        >
        <CButton color="danger" class="float-right ml-1" @click="reject()"
          >ปฎิเสธ</CButton
        >
      </CCardFooter>
    </CCard>
  </div>
</template>

<script>
import axios from "axios";
import { authHeader } from "@/helpers/auth-header";

import PreviewData from "@/views/data_center/components/PreviewData.vue";

export default {
  components: {
    PreviewData,
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
      checkInContents: [],
      activityId: "",
    };
  },
  created() {
    this.getCheckIn().then((res) => {
      this.checkInContents = res.data.data;
    });
    this.getHardware().then((res) => {
      this.hardwareList = res.data.data;
    });
  },
  methods: {
    async getActivityId() {
      const processData = {
        processId: this.$route.params.processId,
      };
      await axios
        .post(
          `${process.env.VUE_APP_BACKEND_URL}/process/view`,
          processData,
          this.axiosOptions
        )
        .then((res) => {
          this.activityId = res.data.activityId;
        });
    },
    async getCheckIn() {
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
      return await axios.post(
        `${process.env.VUE_APP_BACKEND_URL}/list/get`,
        axiosData,
        this.axiosOptions
      );
    },
    async getHardware() {
      const axiosData = {
        app: {
          appId: "mophApp",
          listId: "list_data_center_hardware",
        },
        search: [
          {
            paramName: "processId",
            paramValue: this.$route.params.processId,
          },
        ],
      };
      return await axios.post(
        `${process.env.VUE_APP_BACKEND_URL}/list/get`,
        axiosData,
        this.axiosOptions
      );
    },
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
    async approvePermission() {
      this.loadingPage = true;
      const axiosData = {
        app: {
          appId: "mophApp",
          formId: "data_center",
        },
        primaryKey: this.checkInContents[0].id,
        formData: {
          processName: "Review Check Out",
        },
      };
      await axios
        .post(
          `${process.env.VUE_APP_BACKEND_URL}/form/submit`,
          axiosData,
          this.axiosOptions
        )
        .then(async (res) => {
          const processData = {
            processId: this.checkInContents[0].processId,
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
                // variables: [
                //   {
                //     paramName: "considerRequirementStatus",
                //     paramValue: "approve",
                //   },
                // ],
              };
              await axios
                .post(
                  `${process.env.VUE_APP_BACKEND_URL}/process/complete`,
                  processData,
                  this.axiosOptions
                )
                .then(() => {
                  this.loadingPage = false;
                  this.$router.push("/data-center/view-tasks/");
                  // }
                });
            });
        });
    },
  },
};
</script>