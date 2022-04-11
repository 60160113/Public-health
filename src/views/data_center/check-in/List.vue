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

          <template #actions>
            <td>
              <CButton color="info" size="sm"><b>รายละเอียด</b> </CButton>&nbsp;
              <CButton color="primary" size="sm"><b>ดำเนินการ</b> </CButton>
            </td>
          </template>

          <template #actions-filter> <p></p> </template>
        </CDataTable>
      </CCardBody>
    </CCard>
  </div>
</template>

<script>
import JogetHelper from "@/helpers/JogetHelper";
import dateFormat from "@/helpers/dateFormat.vue";
export default {
  mixins: [JogetHelper, dateFormat],
  created() {
    this.getList();
  },
  data() {
    return {
      list: [],
      loading: false,

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