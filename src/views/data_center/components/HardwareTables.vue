<template>
  <div>
    <CCard>
      <CCardHeader>
        <strong class="text-primary">รายการ Hardwares</strong>
      </CCardHeader>

      <CCardBody
        ><CDataTable
          :items="hardwares"
          :fields="[
            { key: 'name', label: 'รายการ', _style: 'width:25%' },
            { key: 'brand', label: 'ยี่ห้อ/รุ่น', _style: 'width:10%' },
            {
              key: 'serial_number',
              label: 'S/N',
              _style: 'width:10%',
            },
            { key: 'unit', label: 'จำนวน (ชุด)', _style: 'width:15%' },
            { key: 'status', label: 'เข้า - ออก', _style: 'width:10%' },
            { key: 'type', label: 'ชั่วคราว - ถาวร', _style: 'width:10%' },
            { key: 'return_date', label: 'วันที่ส่งคืน', _style: 'width:10%' },
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

          <template #return_date="{ item }">
            <td>
                {{ item.return_date ? new Date(item.return_date).toLocaleDateString() : '-' }}
            </td>
          </template>
        </CDataTable>
      </CCardBody>
    </CCard>
  </div>
</template>

<script>
import axios from "axios";
import { authHeader } from "@/helpers/auth-header";

export default {
  created() {
    this.getHardwares().then((res) => {
      this.hardwares = res.data.data;
    });
  },
  data() {
    return {
      hardwares: [],

      axiosOptions: {
        headers: authHeader(),
      },
    };
  },
  methods: {
    getHardwares() {
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
      return axios.post(
        `${process.env.VUE_APP_BACKEND_URL}/list/get`,
        axiosData,
        this.axiosOptions
      );
    },
  },
};
</script>