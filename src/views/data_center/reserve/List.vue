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
          column-filter
          :loading="loading"
        >
          <template #no-items-view
            ><div class="text-center">ไม่พบข้อมูล</div>
          </template>

          <template #hasHardwareStatus="{ item }"
            ><td>
              <CBadge
                :color="
                  JSON.parse(item.display_hasHardwares) ? 'success' : 'danger'
                "
                style="font-size: 16px; width: 100%"
                class="mt-1"
                ><b>{{ item.hasHardwareStatus }}</b></CBadge
              >
            </td>
          </template>

          <template #actions="{ index }">
            <td>
              <CButton
                color="primary"
                variant="outline"
                square
                size="sm"
                block
                @click="toggleIndex = toggleIndex == index ? -1 : index"
              >
                แสดง
              </CButton>
            </td>
          </template>

          <template #details="{ index }">
            <CCollapse :show="toggleIndex == index" :duration="150">
              <div class="mt-2 mb-2">
                <CButton color="success" class="ml-2"><b>อนุมัติ</b> </CButton>
                <CButton color="danger" class="ml-2"
                  ><b>ไม่อนุมัติ</b>
                </CButton>
                <CButton color="info" class="ml-2"
                  ><b>ดูรายละเอียด</b>
                </CButton>
              </div>
            </CCollapse>
          </template>

          <template #actions-filter> <p></p> </template>
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
        { key: "request_id", label: "ID", _style: "width:20%" },
        { key: "reserve_date", label: "วันที่ร้องขอ", _style: "width:15%" },
        {
          key: "display_requesterName",
          label: "ผู้ร้องขอ",
          _style: "width:15%",
        },
        {
          key: "display_requesterPosition",
          label: "ตำแหน่ง",
          _style: "width:10%",
        },
        {
          key: "display_requesterAffiliation",
          label: "สังกัด/บริษัท",
          _style: "width:10%",
        },
        { key: "objective", label: "วัตถุประสงค์", _style: "width:15%" },
        {
          key: "hasHardwareStatus",
          label: "รายการ Hardwares",
          _style: "width:5%",
        },
        { key: "actions", label: "ดำเนินการ", _style: "width:10%" },
      ],

      loading: false,
      toggleIndex: -1,
    };
  },
  methods: {
    // get list
    getList() {
      this.loading = true;

      this.jogetListAll("mophApp", "list_data_center_reserve")
        .then((res) => {
          this.list = res.data.map((item) => {
            item.hasHardwareStatus = JSON.parse(item.display_hasHardwares)
              ? "มี"
              : "ไม่มี";
            item.reserve_date =
              new Date(item.reserve_date).toLocaleDateString() +
              " " +
              new Date(item.reserve_date).toLocaleTimeString();
            return item;
          });
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
  },
};
</script>