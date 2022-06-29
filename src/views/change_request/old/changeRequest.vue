<template>
  <div>
    <CCard>
      <CCardHeader>
        <h4>ตารางรายการจัดการการเปลี่ยนแปลง</h4>
      </CCardHeader>
      <CCardBody>
        <CDataTable
          :items="changeRequestList"
          :fields="changeRequestFields"
          :loading="tableLoading"
          column-filter
          table-filter
          items-per-page-select
          :items-per-page="10"
          hover
          sorter
          pagination
          :responsive="false"
        >
          <template #no-items-view>
            <div class="d-flex justify-content-center">
              ไม่พบรายการจัดการการเปลี่ยนแปลง
            </div>
          </template>
          <template #over-table>
            <CButton
              class="mb-3"
              size="sm"
              color="success"
              @click="changeRequestCreateModal = true"
              >ขออนุมัติดำเนินการเปลี่ยนแปลง</CButton
            >
          </template>
          <template #index="{ index }">
            <td>
              {{ index + 1 }}
            </td>
          </template>
          <template #processName="{ item }">
            <td>
              <CBadge :color="getBadge(item.processName)">
                {{ item.processName }}
              </CBadge>
            </td>
          </template>
          <template #action="{ item }">
            <td>
              <CDropdown
                color="info"
                size="sm"
                toggler-text=""
                class="ml-1"
                placement="left-start"
              >
                <div>
                  <div>
                    <CDropdownItem
                      v-if="item.processName == 'รอตรวจสอบ'"
                      @click="reviewRequestPage(item.changeRequestId)"
                      >พิจารณาคำร้อง</CDropdownItem
                    >
                    <CDropdownItem
                      v-if="item.processName == 'รออนุมัติ'"
                      @click="considerRequestPage(item.changeRequestId)"
                      >อนุมัติคำร้อง</CDropdownItem
                    >
                    <CDropdownItem
                      v-if="item.processName == 'รอผลดำเนินการ'"
                      @click="approveRequestPage(item.changeRequestId)"
                      >ผลการดำเนินการ</CDropdownItem
                    >
                    <CDropdownDivider
                      v-if="item.processName !== 'เสร็จสิ้น'"
                    ></CDropdownDivider>
                  </div>
                  <CDropdownItem @click="infoRequestPage(item.changeRequestId)"
                    >ดูข้อมูล</CDropdownItem
                  >
                </div></CDropdown
              >
            </td>
          </template>
        </CDataTable>
      </CCardBody>
    </CCard>
    <CModal
      title="ขออนุมัติดำเนินการเปลี่ยนแปลง (Change Request Form)"
      color="info"
      size="xl"
      :show.sync="changeRequestCreateModal"
      centered
    >
      <CTextarea
        label="มีความประสงค์ขอเปลี่ยนแปลงเรื่อง"
        horizontal
        v-model="form.subject"
      />
      <CSelect
        label="เหตุผลที่ขอเปลี่ยนแปลง"
        placeholder="กรุณาเลือกเหตุผลที่ขอเปลี่ยนแปลง"
        :value.sync="form.reason"
        horizontal
        :options="reasonList"
      />
      <CSelect
        label="ประเภทของการเปลี่ยนแปลง"
        placeholder="กรุณาเลือกประเภทของการเปลี่ยนแปลง"
        :value.sync="form.changeType"
        horizontal
        :options="[
          { value: 'Minor', label: 'Minor' },
          { value: 'Major', label: 'Major' },
          { value: 'Emergency', label: 'Emergency' },
        ]"
      />
      <CRow>
        <CCol md="3">
          <label for="">ระบบที่เกี่ยวข้อง</label>
        </CCol>
        <CCol>
          <CInputCheckbox
            v-for="(option, optionIndex) in systemOptions"
            :key="optionIndex"
            :label="option"
            :value="option"
            custom
            @update:checked="onSystemChecked"
          />
          <CInput
            v-if="handler.relatedSystem.includes('Other')"
            horizontal
            label="ชื่อระบบที่เกี่ยวข้อง"
            v-model="handler.other_relatedSystem"
          />
        </CCol>
      </CRow>
      <CSelect
        class="mt-3"
        label="เอกสารที่แนบท้ายมาด้วย"
        :value.sync="handler.attachment"
        :options="[
          { value: 'Rollback Plan', label: 'Rollback Plan' },
          { value: 'other', label: 'อื่น ๆ' },
        ]"
        horizontal
      />
      <CInput
        v-if="handler.attachment == 'other'"
        horizontal
        label="ชื่อเอกสารแนบ"
        v-model="form.attachment"
      />
      <CTextarea label="รายละเอียดการเปลี่ยนแปลง" v-model="form.detail" />
      <template #footer>
        <CButton color="secondary" @click="changeRequestCreateModal = false"
          >ยกเลิก</CButton
        >
        <CButton color="success" @click="submit()">ยืนยัน</CButton>
      </template>
    </CModal>
  </div>
</template>
<script>
import { jogetService } from "@/helpers/joget-helper";
import axios from "axios";
import { authHeader } from "@/helpers/auth-header";

const user = JSON.parse(localStorage.getItem("AuthUser"));
export default {
  components: {
    jogetService,
    authHeader,
  },
  data() {
    return {
      axiosOptions: {
        headers: authHeader(),
      },
      tableLoading: false,
      changeRequestCreateModal: false,
      changeRequestEditModal: false,
      changeRequestList: [],
      changeRequestFields: [
        { key: "index", label: "#", _style: "width:5%" },
        {
          key: "changeRequestId",
          label: "เลขที่เอกสาร",
          _style: "min-width:5%",
        },
        {
          key: "dateCreated",
          label: "วันที่ร้องขอ",
          _style: "min-width:10%",
        },
        {
          key: "subject",
          label: "ความประสงค์",
          _style: "min-width:10%",
        },
        {
          key: "reason",
          label: "เหตุผล",
          _style: "min-width:10%",
        },
        {
          key: "requester",
          label: "ผู้ร้องขอ",
          _style: "min-width:10%",
        },
        { key: "processName", label: "สถานะ", _style: "min-width:5%" },
        { key: "action", label: "", _style: "width:5%;" },
      ],
      reasonList: [
        { value: "new", label: "เพิ่มระบบใหม่" },
        { value: "edit", label: "ปรับปรุง/แก้ไข" },
        { value: "other", label: "อื่นๆ" },
      ],
      form: {
        subject: "",
        reason: "",
        createBy: user.fullname,
        modiflyBy: user.fullname,
        processId: "",
        processName: "รอตรวจสอบ",
        requester: user.fullname,
        changeRequestId: "",
        relatedSystem: "",
        attachment: "",
        changeType: "",
        detail: "",
      },

      handler: {
        relatedSystem: [],
        other_relatedSystem: "",
        attachment: "Rollback Plan",
      },

      systemOptions: [
        "PC",
        "Network",
        "Server",
        "System Software",
        "Application Software",
        "Storage",
        "Security",
        "Other",
      ],
    };
  },
  created() {
    this.tableLoading = true;
    this.getChangeRequest();
  },
  methods: {
    async getChangeRequest() {
      const searchData = [
        {
          paramName: "changeRequestStatus",
          paramValue: "active",
        },
      ];
      await jogetService
        .list("mophApp", "list_moph_change_request", searchData)
        .then((res) => {
          this.changeRequestList = res.data.data;
          this.tableLoading = false;
        });
    },
    async submit() {
      this.tableLoading = true;
      // start Process
      var axiosData = {
        app: {
          appId: "mophApp",
          processDefId: "changeManagementProcess",
        },
      };
      const startProcess = await axios.post(
        `${process.env.VUE_APP_BACKEND_URL}/process/start`,
        axiosData,
        this.axiosOptions
      );

      // manage form
      if (this.form.reason == "new") {
        this.form.reason = "เพิ่มระบบใหม่";
      } else if (this.form.reason == "edit") {
        this.form.reason = "ปรับปรุง/แก้ไข";
      } else if (this.form.reason == "other") {
        this.form.reason = "อื่นๆ";
      }

      if (!this.form.attachment) {
        this.form.attachment = this.handler.attachment;
      }

      if (this.handler.other_relatedSystem) {
        this.handler.relatedSystem.push(this.handler.other_relatedSystem);
      }

      var relatedSystem = this.handler.relatedSystem.filter(
        (item) => item != "Other"
      );
      this.form.relatedSystem = relatedSystem.toString();

      // submit
      this.form.processId = startProcess.data.processId;
      axiosData = {
        app: {
          appId: "mophApp",
          formId: "moph_change_request",
        },
        primaryKey: this.form.processId,
        formData: this.form,
      };
      await axios.post(
        `${process.env.VUE_APP_BACKEND_URL}/form/submit`,
        axiosData,
        this.axiosOptions
      );

      // process/view
      const viewProcess = await axios.post(
        `${process.env.VUE_APP_BACKEND_URL}/process/view`,
        {
          processId: this.form.processId,
        },
        this.axiosOptions
      );

      await axios.post(
        `${process.env.VUE_APP_BACKEND_URL}/process/complete`,
        {
          activityId: viewProcess.data.activityId,
        },
        this.axiosOptions
      );
      this.changeRequestCreateModal = false;
      this.getChangeRequest();
    },
    onSystemChecked(value, event) {
      if (value) {
        this.handler.relatedSystem.push(event.target.value);
      } else {
        this.handler.relatedSystem.forEach((item, index) => {
          if (item === event.target.value) {
            this.handler.relatedSystem.splice(index, 1);
          }
        });
      }
    },
    infoRequestPage(changeRequestId) {
      let routeData = this.$router.resolve({
        name: "InfoChangeRequest",
        query: { data: changeRequestId },
      });
      window.open(routeData.href, "_blank");
    },
    reviewRequestPage(changeRequestId) {
      let routeData = this.$router.resolve({
        name: "reviewChangeRequest",
        query: { data: changeRequestId },
      });
      window.open(routeData.href, "_blank");
    },
    considerRequestPage(changeRequestId) {
      let routeData = this.$router.resolve({
        name: "ConsiderChangeRequest",
        query: { data: changeRequestId },
      });
      window.open(routeData.href, "_blank");
    },
    approveRequestPage(changeRequestId) {
      let routeData = this.$router.resolve({
        name: "ApproveChangeRequest",
        query: { data: changeRequestId },
      });
      window.open(routeData.href, "_blank");
    },
    getBadge(status) {
      switch (status) {
        case "เสร็จสิ้น":
          return "success";
        case "รออนุมัติ":
          return "info";
        case "รอตรวจสอบ":
          return "secondary";
        case "รอผลดำเนินการ":
          return "secondary";
        default:
          "primary";
      }
    },
  },
};
</script>
