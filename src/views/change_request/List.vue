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
          <template #over-table>
            <div style="margin-bottom: 10px">
              <CSelect
                horizontal
                label="รายการ:"
                placeholder="กรุณาเลือก"
                :options="[
                  { value: 'all', label: 'ทั้งหมด' },
                  { value: 'mine', label: 'งานของฉัน' },
                ]"
                style="width: 50%"
                :value.sync="filter.taskOwner"
              />
            </div>
          </template>
          <template #no-items-view
            ><div class="text-center">ไม่พบข้อมูล</div>
          </template>

          <template #dateCreated-filter>
            <CRow>
              <CCol
                ><input
                  type="date"
                  v-model="filter.dateCreated.start"
                  class="form-control form-control-sm"
              /></CCol>
              <b class="mt-1">ถึง</b>
              <CCol
                ><input
                  type="date"
                  v-model="filter.dateCreated.end"
                  class="form-control form-control-sm"
              /></CCol>
            </CRow>
          </template>

          <template #dateCreated="{ item }">
            <td>
              {{ toThaiFormatWithTime(item.dateCreated) }}
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
                :disabled="disabledAction(item)"
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
        <Detail :processId="processId" />
      </div>

      <div v-else>
        <component
          :is="modalName"
          :processId="processId"
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

import Detail from "@/views/change_request/Detail.vue";

const AuthUser = JSON.parse(localStorage.getItem("AuthUser"));
export default {
  mixins: [JogetHelper, dateFormat],
  components: {
    Detail,
  },
  created() {
    this.getList();
  },
  data() {
    return {
      list: [],
      fields: [
        { key: "change_request_id", label: "ID", _style: "width:10%" },
        { key: "dateCreated", label: "วันที่ร้องขอ", _style: "width:15%" },
        {
          key: "subject",
          label: "ความประสงค์",
          _style: "width:20%",
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
        {
          key: "taskName",
          label: "งาน",
          _style: "width:15%",
        },
        {
          key: "actions",
          label: "",
          _style: "width:15%",
        },
      ],

      filter: {
        dateCreated: {
          start: "",
          end: "",
        },

        taskId: "",

        taskOwner: "all",
      },

      loading: false,

      modal: false,
      modalName: "",
      modalLabel: "",

      processId: "",
    };
  },
  methods: {
    getList() {
      this.loading = true;

      this.jogetListAll("mophApp", "list_change_request")
        .then((res) => {
          this.list = res.data.map((item) => {
            item.taskName = item.activity ? item.activity.split(";")[1] : "";
            item.taskId = item.activity ? item.activity.split(";")[0] : "";
            return item;
          });
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    openModal(name, processId, label = "") {
      this.loading = true;
      this.modalName = name;
      this.processId = processId;
      this.modalLabel = label;

      this.modal = true;
      this.loading = false;
    },
    disabledAction(item) {
      const assignField = item.assign.split(";")[0] || "";
      const assignTo = item.assign.split(";")[1] || "";
      const assignStatus =
        assignTo && assignField ? AuthUser[assignField] !== assignTo : false;
      return item.taskId == "complete" || assignStatus;
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
      if (this.filter.taskId) {
        list = list.filter((item) => item.taskId == this.filter.taskId);
      }
      if (this.filter.taskOwner == "mine") {
        list = list.filter((item) => !this.disabledAction(item));
      }
      if (this.filter.dateCreated.start) {
        if (!this.filter.dateCreated.end) {
          this.filter.dateCreated.end = JSON.parse(
            JSON.stringify(this.filter.dateCreated.start)
          );
        }
        list = list.filter((item) => {
          const dateCreated = new Date(item.dateCreated).getTime();

          const start = new Date(this.filter.dateCreated.start);
          const end = new Date(this.filter.dateCreated.end);
          end.setHours(23, 59, 59);

          return dateCreated >= start.getTime() && dateCreated <= end.getTime();
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
      }
    },
    "filter.dateCreated.start": function (val) {
      if (!val) {
        this.filter.dateCreated.end = "";
      }
    },
    "filter.dateCreated.end": function (val) {
      if (!val) {
        this.filter.dateCreated.start = "";
      }
    },
  },
};
</script>