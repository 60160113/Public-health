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

      fields: [
        { key: "reserve_request_id", label: "ID", _style: "width:15%" },
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
          _style: "width:10%",
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
      var list = this.list;
      return list;
    },
  },
};
</script>