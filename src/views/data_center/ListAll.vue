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
          :responsive="false"
          :loading="loadingPage"
        >
          <template #no-items-view
            ><div class="text-center">ไม่พบข้อมูล</div>
          </template>
          <template #contact_date="{ item }">
            <td>
              {{
                item.contact_date
                  ? new Date(item.contact_date).toLocaleDateString("th-TH")
                  : "-"
              }}
            </td>
          </template>

          <template #processName="{ item }">
            <td>
              <CBadge :color="badgeColor(item)" style="font-size: 15px">{{
                processNameLabel[item.processName]
              }}</CBadge>
            </td>
          </template>

          <template #action="{ item }">
            <td>
              <CDropdown
                color="secondary"
                size="sm"
                toggler-text=""
                class="m-2"
              >
                <template slot="toggler-content">
                  <CIcon name="cil-options" />
                </template>
                <CDropdownItem
                  v-c-tooltip="'ดำเนินการ'"
                  @click="considerRequirement(item)"
                  >ดำเนินการ</CDropdownItem
                >
                <CDropdownDivider />
                <CDropdownItem
                  v-c-tooltip="'ดูข้อมูล'"
                  @click="
                    $router.push('/data-center/view-report/' + item.processId)
                  "
                  >ดูข้อมูล</CDropdownItem
                >
              </CDropdown>
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

import processNameLabel from "@/views/data_center/json/processNameLabel.json";

export default {
  data() {
    return {
      requests: [],
      loadingPage: false,

      axiosOptions: {
        headers: authHeader(),
      },

      dataField: [
        { key: "request_id", label: "ID" },
        { key: "requester", label: "ผู้ร้องขอ", _style: "width:20%" },
        {
          key: "idcard",
          label: "เลขที่บัตรประชาชน",
          _style: "width:15%",
        },
        { key: "contact_date", label: "วันที่ร้องขอ", _style: "width:10%" },

        { key: "purpose", label: "วัตถุประสงค์", _style: "width:15%" },
        { key: "processName", label: "กระบวนการ", _style: "width:15%" },
        { key: "action", label: "ดำเนินการ", _style: "width:10%" },
      ],

      processNameLabel,
    };
  },
  created() {
    this.loadTable();
  },
  methods: {
    loadTable() {
      this.loadingPage = true;
      this.getItems().then((res) => {
        this.requests = res.data.data;
        this.loadingPage = false;
      });
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
      var route_name =
        item.processName !== "Complete"
          ? item.processName
          : "Data Center Report";

      if (route_name != "Check In") {
        this.$router.push({
          name: route_name,
          params: {
            processId: item.processId,
          },
        });
      } else {
        this.$router.push({
          name: route_name,
          query: {
            id: item.id,
          },
        });
      }
    },
    badgeColor(item) {
      if (item.processName !== "Complete") {
        if (item.data_center_card) {
          return "warning";
        } else {
          return "success";
        }
      } else {
        return "info";
      }
    },
  },
};
</script>