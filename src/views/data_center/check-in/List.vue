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
          key: "building_card",
          label: "บัตรเข้าอาคาร",
          _style: "width:10%",
        },
        {
          key: "data_center_card",
          label: "บัตรเข้าศูนย์ปฏิบัติการ",
          _style: "width:10%",
        },
        { key: "actions", label: "", _style: "width:10%" },
      ],
    };
  },
  methods: {
    getList() {
      this.loading = true;

      this.jogetListAll("mophApp", "data_center_checkin")
        .then((res) => {
          this.list = res.data;
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
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