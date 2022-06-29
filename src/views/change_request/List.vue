<template>
  <div>
    <CCard>
      <CCardHeader>
        <strong class="text-primary">ถาดงานศูนย์ปฏิบัติการ</strong>
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

const AuthUser = JSON.parse(localStorage.getItem("AuthUser"));
export default {
  mixins: [JogetHelper, dateFormat],
  data() {
    return {
      list: [],
      fields: [
        { key: "change_request_id", label: "ID", _style: "width:10%" },
        { key: "dateCreated", label: "วันที่ร้องขอ", _style: "width:15%" },
        {
          key: "subject",
          label: "ความประสงค์",
          _style: "width:10%",
        },
        {
          key: "reason",
          label: "เหตุผล",
          _style: "width:10%",
        },
        {
          key: "requester_name",
          label: "ผู้ร้องขอ",
          _style: "width:10%",
        },
      ],

      loading: false,

      modal: false,
      modalName: "",
      modalLabel: "",

      processId: "",
    };
  },
  computed: {
    filteredList() {
      var list = [...this.list];
      return list;
    },
  },
};
</script>