<template>
  <div>
    <CCard>
      <CCardHeader>
        <h4>ตารางรายการเหตุการณ์ด้านความมั่นคงปลอดภัยสารสนเทศ</h4>
      </CCardHeader>
      <CCardBody>
        <CDataTable
          :items="incidents"
          :fields="fields"
          :loading="loading"
          :tableFilter="{
            label: 'ค้นหา: ',
            placeholder: 'ค้นหา',
          }"
          pagination
          :items-per-page="5"
          :itemsPerPageSelect="{
            label: 'แสดง',
          }"
          :responsive="false"
        >
          <template #no-items-view>
            <div class="d-flex justify-content-center">ไม่มีรายการ</div>
          </template>
          <template #index="{ index }">
            <td>
              {{ index + 1 }}
            </td>
          </template>
          <template #action="{ item }">
            <td>
              <CButton
                color="info"
                size="sm"
                class="ml-1"
                @click.prevent="action(item)"
              >
                view
              </CButton>
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
    this.loading = true;
    this.getIncidents()
      .then((res) => {
        this.incidents = res.data.data;
        this.loading = false;
      })
      .catch((err) => {
        this.loading = false;
      });
  },
  data() {
    return {
      incidents: [],

      fields: [
        { key: "index", label: "#", _style: "width:5%" },
        {
          key: "id",
          label: "ID",
          _style: "min-width:5%",
        },
        {
          key: "dateCreated",
          label: "วันที่",
          _style: "min-width:10%",
        },
        {
          key: "informer_name",
          label: "ผู้แจ้ง",
          _style: "min-width:10%",
        },
        {
          key: "incident_detail",
          label: "รายละเอียดเหตุการณ์",
          _style: "min-width:10%",
        },
        {
          key: "incident_effect",
          label: "ผลกระทบที่ได้รับ",
          _style: "min-width:10%",
        },
        {
          key: "process_name",
          label: "สถานะ",
          _style: "min-width:10%",
        },
        {
          key: "action",
          label: "",
          _style: "min-width:10%",
        },
      ],

      axiosOptions: {
        headers: authHeader(),
      },
      loading: false,
    };
  },
  methods: {
    getIncidents() {
      const axiosData = {
        app: {
          appId: "mophApp",
          listId: "list_information_security_incident",
        },
      };
      return axios.post(
        `${process.env.VUE_APP_BACKEND_URL}/list/getAll`,
        axiosData,
        this.axiosOptions
      );
    },
    action(item) {
      var route_name =
        item.process_name !== "Complete"
          ? item.process_name
          : "Information Security Report";
      this.$router.push({
        name: route_name,
        params: {
          id: item.id,
          process_id: item.process_id,
        },
      });
    },
  },
};
</script>