<template>
  <div>
    <CCard>
      <CCardHeader>
        <strong class="text-primary">อนุมัติคำขอเข้าศูนย์ปฏิบัติการ</strong>
      </CCardHeader>

      <CCardBody>
        <CDataTable
          :items="requests"
          :fields="dataField"
          :tableFilter="{
            label: 'ค้นหา: ',
            placeholder: 'ค้นหา',
          }"
          pagination
          :items-per-page="5"
          :itemsPerPageSelect="{
            label: 'แสดง',
          }"
        >
          <template #no-items-view
            ><div class="text-center">ไม่พบข้อมูล</div>
          </template>
          <template #index="{ index }">
            <td width="5%">
              {{ index + 1 }}
            </td>
          </template>
          <template #contact_date="{ item }">
            <td>
              {{ new Date(item.contact_date).toLocaleDateString("th-TH") }}
            </td>
          </template>

          <template #processName="{ item }">
            <td>
              {{ getProcessLabel(item.processName) }}
            </td>
          </template>

          <template #action="{ item }">
            <td>
              <CButton
                color="info"
                size="sm"
                class="ml-1"
                @click="considerRequirement(item)"
              >
                view
              </CButton>
            </td>
          </template>
        </CDataTable>
      </CCardBody>
      <CElementCover :opacity="0.8" v-if="loadingPage" />
    </CCard>
  </div>
</template>

<script>
import axios from "axios";
import { authHeader } from "@/helpers/auth-header";

export default {
  data() {
    return {
      requests: [],
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
      AuthUser: JSON.parse(localStorage.getItem("AuthUser")),
      enter: false,

      modal: false,

      hardwareList: [],

      dataField: [
        { key: "index", label: "#" },
        { key: "requester", label: "ผู้ร้องขอ", _style: "width:20%" },
        { key: "purpose", label: "วัตถุประสงค์", _style: "width:15%" },
        { key: "contact_date", label: "วันที่ร้องขอ", _style: "width:10%" },
        {
          key: "idcard",
          label: "เลขที่บัตรประชาชน",
          _style: "width:15%",
        },
        { key: "processName", label: "กระบวนการ", _style: "width:15%" },
        { key: "action", label: "ดำเนินการ", _style: "width:10%" },
      ],
    };
  },
  created() {
    this.loadTable();
  },
  methods: {
    loadTable() {
      this.tableLoading = true;
      this.getItems().then((res) => {
        this.requests = res.data.data;
      });
      this.tableLoading = false;
    },
    async getItems() {
      const axiosData = {
        app: {
          appId: "mophApp",
          listId: "list_data_center",
        },
      };
      return await axios.post(
        `${process.env.VUE_APP_BACKEND_URL}/list/getAll`,
        axiosData,
        this.axiosOptions
      );
    },
    considerRequirement(item) {
      if (item.processId) {
        this.$router.push("/data-center/view-report/" + item.processId);
      } else {
        this.$router.push(`/data-center/check-in/?id=${item.id}`);
      }
    },
    getProcessLabel(processName) {
      switch (processName) {
        case "Check In":
          return "เช็คอิน";
        case "Check Out":
          return "เช็คเอาท์";
        case "Consider Requirement":
          return "พิจารณาความต้องการเข้าศูนย์ปฏิบัติการ";
        default:
          return "-";
      }
    },
  },
};
</script>