<template>
  <div>
    <CCard>
      <CCardHeader>
        <strong class="text-primary">รายการคำขอเข้าศูนย์ปฏิบัติการ</strong>
      </CCardHeader>

      <CCardBody>
        <CDataTable
          :items="filteredList"
          :fields="fields"
          :tableFilter="{
            label: 'ค้นหา: ',
            placeholder: 'ค้นหา',
          }"
          pagination
          :items-per-page="5"
          :itemsPerPageSelect="{
            label: 'แสดง',
          }"
          column-filter
          :loading="loading"
        >
          <template #no-items-view
            ><div class="text-center">ไม่พบข้อมูล</div>
          </template>

          <template #reserve_date-filter>
            <CRow>
              <CCol
                ><input
                  type="date"
                  v-model="filter.reserve_date.start"
                  class="form-control form-control-sm"
              /></CCol>
              <b class="mt-1">ถึง</b>
              <CCol
                ><input
                  type="date"
                  v-model="filter.reserve_date.end"
                  class="form-control form-control-sm"
              /></CCol>
            </CRow>
          </template>

          <template #reserve_date="{ item }">
            <td>
              {{ toThaiFormatWithTime(item.reserve_date) }}
            </td>
          </template>

          <template #taskName="{ item }">
            <td>
              <CBadge
                :color="getTaskColor(item.taskId)"
                style="font-size: 16px; width: 100%"
                class="mt-1"
                >{{ item.taskName }}</CBadge
              >
            </td>
          </template>

          <template #actions="{ item }">
            <td>
              <CButton
                color="info"
                size="sm"
                @click.prevent="openModal('detail', item.reserve_id, item.id)"
                ><b>รายละเอียด</b> </CButton
              >&nbsp;
              <CButton
                color="primary"
                size="sm"
                :disabled="item.taskId == 'complete'"
                @click.prevent="
                  openModal(item.taskId, item.processId, item.id, item.taskName)
                "
                ><b>ดำเนินการ</b>
              </CButton>
            </td>
          </template>

          <template #actions-filter> <p></p> </template>
        </CDataTable>
      </CCardBody>
    </CCard>

    <!-- M O D A L -->
    <CModal
      :show.sync="modal"
      :centered="true"
      :closeOnBackdrop="false"
      size="xl"
      :color="modalName == 'detail' ? 'info' : 'primary'"
    >
      <div v-if="modalName == 'detail'">
        <Detail v-if="processId && id" :processId="processId" :id="id" />
      </div>

      <div v-else>
        <component
          :is="modalName"
          v-if="id"
          :processId="processId"
          :id="id"
          :onComplete="completeTask"
        />
      </div>

      <template #header>
        <h5 class="modal-title">
          {{ modalName == "detail" ? "รายละเอียด" : modalLabel }}
        </h5>
        <CButtonClose
          @click="modal = false"
          class="text-white"
          :disabled="loading"
        />
      </template>
      <template #footer>
        <CButton color="secondary" @click="modal = false" :disabled="loading"
          >ปิด</CButton
        >
      </template>
      <CElementCover :opacity="0.8" v-if="loading">
        <h1 class="d-inline">Loading...</h1>
        <CSpinner size="5xl" color="success" />
      </CElementCover>
    </CModal>
  </div>
</template>

<script>
import JogetHelper from "@/helpers/JogetHelper";
import dateFormat from "@/helpers/dateFormat.vue";

import Detail from "@/views/data_center/check-in/Detail.vue";

import Checkin from "@/views/data_center/check-in/actions/Checkin.vue";
import DataCenterCheckin from "@/views/data_center/check-in/actions/DataCenterCheckin.vue";
import DataCenterCheckOut from "@/views/data_center/check-in/actions/DataCenterCheckOut.vue";
import Checkout from "@/views/data_center/check-in/actions/Checkout.vue";
export default {
  mixins: [JogetHelper, dateFormat],
  components: {
    Detail,
    checkin: Checkin,
    data_center_check_in: DataCenterCheckin,
    data_center_check_out: DataCenterCheckOut,
    checkout: Checkout,
  },
  created() {
    this.getList();
  },
  data() {
    return {
      list: [],
      loading: false,
      modal: false,
      modalName: "",
      modalLabel: "",
      processId: "",
      id: "",

      filter: {
        reserve_date: {
          start: "",
          end: "",
        },
      },

      fields: [
        { key: "reserve_request_id", label: "ID", _style: "width:10%" },
        { key: "reserve_date", label: "วันที่", _style: "width:15%" },
        {
          key: "name",
          label: "ชื่อ - สกุล",
          _style: "width:15%",
        },
        {
          key: "affiliation",
          label: "สังกัด/บริษัท",
          _style: "width:10%",
        },
        {
          key: "idcard",
          label: "เลขที่บัตรประชาชน",
          _style: "width:15%",
        },
        {
          key: "taskName",
          label: "งาน",
          _style: "width:10%",
        },
        { key: "actions", label: "", _style: "width:15%" },
      ],
    };
  },
  methods: {
    openModal(name, processId, id, label = "") {
      this.loading = true;
      this.modalName = name;
      this.processId = processId;
      this.id = id;
      this.modalLabel = label;

      this.modal = true;
      this.loading = false;
    },
    getList() {
      this.loading = true;

      this.jogetListAll("mophApp", "data_center_checkin")
        .then((res) => {
          this.list = res.data.map((item) => {
            item.taskName = item.activity
              ? item.activity.split(";")[1]
              : "เช็คอิน";
            item.taskId = item.activity
              ? item.activity.split(";")[0]
              : "checkin";
            return item;
          });
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    getTaskColor(taskId) {
      switch (taskId) {
        case "checkin":
        case "checkout":
          return "success";
        case "data_center_check_in":
        case "data_center_check_out":
          return "warning";
        case "complete":
          return "info";
        default:
          return "secondary";
      }
    },
    async completeTask() {
      this.loading = true;
      this.getList();
      setTimeout(() => {
        this.modal = false;
        this.loading = false;
      }, 500);
    },
  },
  computed: {
    filteredList() {
      var list = [...this.list];
      if (this.filter.reserve_date.start) {
        if (!this.filter.reserve_date.end) {
          this.filter.reserve_date.end = JSON.parse(
            JSON.stringify(this.filter.reserve_date.start)
          );
        }
        list = list.filter((item) => {
          const reserve_date = new Date(item.reserve_date).getTime();

          const start = new Date(this.filter.reserve_date.start);
          const end = new Date(this.filter.reserve_date.end);
          end.setHours(23, 59, 59);

          return (
            reserve_date >= start.getTime() && reserve_date <= end.getTime()
          );
        });
      }
      return list;
    },
  },
  watch: {
    modal: function (val) {
      if (!val) {
        this.processId = "";
        this.modalLabel = "";
        this.modalName = "";
        this.id = "";
      }
    },
    "filter.reserve_date.start": function (val) {
      if (!val) {
        this.filter.reserve_date.end = "";
      }
    },
    "filter.reserve_date.end": function (val) {
      if (!val) {
        this.filter.reserve_date.start = "";
      }
    },
  },
};
</script>