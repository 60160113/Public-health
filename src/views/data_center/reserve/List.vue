<template>
  <div>
    <CCard>
      <CCardHeader>
        <strong class="text-primary">รายการคำขอเข้าศูนย์ปฏิบัติการ</strong>
      </CCardHeader>

      <CCardBody>
        <CDataTable
          :items="list"
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
export default {
  mixins: [JogetHelper],
  created() {
    this.getList();
  },
  data() {
    return {
      list: [],

      fields: [
        { key: "request_id", label: "ID", _style: "width:10%" },
        { key: "reserve_date", label: "วันที่ร้องขอ", _style: "width:20%" },

        { key: "objective", label: "วัตถุประสงค์", _style: "width:15%" },
        { key: "action", label: "ดำเนินการ", _style: "width:10%" },
      ],

      loading: false,
    };
  },
  methods: {
    getList() {
      this.loading = true;

      this.jogetListAll("mophApp", "list_data_center_reserve")
        .then((res) => {
          this.list = res.data;
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
  },
};
</script>