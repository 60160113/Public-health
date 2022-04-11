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

          <template #reserve_date_label-filter>
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

          <template #hasHardwareStatus-filter>
            <select
              class="form-control form-control-sm"
              v-model="filter.hasHardwareStatus"
            >
              <option
                v-for="(option, index) in hasHardwareStatusOption"
                :key="index"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
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

          <template #status-filter>
            <select
              class="form-control form-control-sm"
              v-model="filter.status"
            >
              <option
                v-for="(option, index) in statusOption"
                :key="index"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </template>

          <template #status="{ item }">
            <td>
              <CBadge
                :color="getStatusColor(item.status)"
                style="font-size: 16px; width: 100%"
                class="mt-1"
                >{{ item.status }}</CBadge
              >
            </td>
          </template>

          <template #actions="{ item }">
            <td>
              <CButton
                color="info"
                size="sm"
                @click.prevent="openModal('detail', item.processId)"
                ><b>รายละเอียด</b> </CButton
              >&nbsp;
              <CButton
                color="primary"
                size="sm"
                @click.prevent="openModal('form', item.processId, item.id)"
                :disabled="item.IST_approve != ''"
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
      size="lg"
      :color="modalName == 'detail' ? 'info' : 'primary'"
    >
      <div v-if="modalName == 'detail'">
        <Detail v-if="processId" :id="processId" />
      </div>

      <div v-else>
        <CSelect
          label="ดำเนินการ"
          placeholder="กรุณาเลือก"
          :options="[
            { value: 'true', label: 'อนุมัติ' },
            { value: 'false', label: 'ไม่อนุมัติ' },
          ]"
          :value.sync="form.IST_approve"
        />
        <CTextarea label="ความคิดเห็น" v-model="form.IST_approve_comment" />
      </div>

      <template #header>
        <h5 class="modal-title">
          {{ modalName == "detail" ? "รายละเอียด" : " อนุมัติการจอง" }}
        </h5>
        <CButtonClose
          @click="modal = false"
          class="text-white"
          :disabled="loading"
        />
      </template>
      <template #footer>
        <CButton
          v-if="modalName !== 'detail'"
          color="primary"
          @click.prevent="submit()"
          :disabled="!form.IST_approve || loading"
          >บันทึก</CButton
        >
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

import Detail from "@/views/data_center/reserve/Detail.vue";
import dateFormat from "@/helpers/dateFormat.vue";
export default {
  mixins: [JogetHelper, dateFormat],
  components: { Detail },
  created() {
    const AuthUser = JSON.parse(localStorage.getItem("AuthUser"));
    this.form.IST = `${AuthUser.id};${AuthUser.fullname}`;
    this.getList();
  },
  data() {
    return {
      list: [],

      filter: {
        hasHardwareStatus: "",
        reserve_date: {
          start: "",
          end: "",
        },
        status: "",
      },

      hasHardwareStatusOption: [
        { value: "", label: "ทั้งหมด" },
        { value: "มี", label: "มี" },
        { value: "ไม่มี", label: "ไม่มี" },
      ],

      statusOption: [
        { value: "", label: "ทั้งหมด" },
        { value: "รอดำเนินการ", label: "รอดำเนินการ" },
        { value: "อนุมัติ", label: "อนุมัติ" },
        { value: "ไม่อนุมัติ", label: "ไม่อนุมัติ" },
      ],

      fields: [
        { key: "request_id", label: "ID", _style: "width:15%" },
        {
          key: "reserve_date_label",
          label: "วันที่ร้องขอ",
          _style: "width:22%",
        },
        {
          key: "display_requesterName",
          label: "ผู้ร้องขอ",
          _style: "width:13%",
        },
        {
          key: "display_requesterAffiliation",
          label: "สังกัด/บริษัท",
          _style: "width:9%",
        },
        { key: "objective", label: "วัตถุประสงค์", _style: "width:9%" },
        {
          key: "hasHardwareStatus",
          label: "รายการ Hardwares",
          _style: "width:5%",
        },
        {
          key: "status",
          label: "สถานะ",
          _style: "width:9%",
        },
        { key: "actions", label: "", _style: "width:18%" },
      ],

      form: {
        IST_approve: "",
        IST_approve_comment: "",
        IST_approve_date: new Date(),
        IST: "",
      },

      loading: false,
      modal: false,
      modalName: "",
      processId: "",
      reserveId: "",
    };
  },
  methods: {
    openModal(name, processId, id = "") {
      this.loading = true;
      this.modalName = name;
      this.processId = processId;
      this.reserveId = id;

      this.modal = true;
      this.loading = false;
    },
    // get list
    getList() {
      this.loading = true;

      this.jogetListAll("mophApp", "list_data_center_reserve")
        .then((res) => {
          this.list = res.data.map((item) => {
            item.hasHardwareStatus = JSON.parse(item.display_hasHardwares)
              ? "มี"
              : "ไม่มี";
            item.status =
              item.IST_approve == "true"
                ? "อนุมัติ"
                : item.IST_approve
                ? "ไม่อนุมัติ"
                : "รอดำเนินการ";
            item.reserve_date_label = this.toThaiFormatWithTime(
              item.reserve_date
            );
            return item;
          });
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    getStatusColor(status) {
      switch (status) {
        case "อนุมัติ":
          return "success";
        case "ไม่อนุมัติ":
          return "danger";
        default:
          return "secondary";
      }
    },
    // submit
    async submit() {
      this.loading = true;

      // Submit reserve
      await this.jogetFormSubmit(
        "mophApp",
        "data_center_reserve",
        this.reserveId,
        this.form
      );

      // activity
      const Activity = await this.jogetGetCurrentActivity(this.processId);
      // process complete
      await this.jogetProcessComplete(Activity.data.activityId);

      // booker
      if (this.form.IST_approve == "true") {
        const bookers = await this.jogetList(
          "mophApp",
          "list_data_center_booker",
          [
            {
              paramName: "reserve_id",
              paramValue: this.processId,
            },
          ]
        );

        const bookerData = bookers.data.map((item) => {
          return {
            primaryKey: item.id,
            data: {
              status: true,
            },
          };
        });

        // Submit booker
        if (bookerData.length > 0) {
          await this.jogetMultipleFormSubmit(
            "mophApp",
            "data_center_booker",
            bookerData
          );
        }
      }

      this.getList();
      this.modal = false;
      this.loading = false;
    },
  },
  computed: {
    filteredList() {
      var list = [...this.list];
      if (this.filter.hasHardwareStatus) {
        list = list.filter(
          (item) => item.hasHardwareStatus == this.filter.hasHardwareStatus
        );
      }
      if (this.filter.status) {
        list = list.filter((item) => item.status == this.filter.status);
      }
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
        this.modalName = "";
        this.reserveId = "";
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