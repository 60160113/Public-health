<template>
  <div>
    <CCard>
      <CCardHeader>
        <h4>
          ตารางรายการจัดการการเปลี่ยนแปลง
        </h4>
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
          <template #processName="{item}">
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
                v-if="item.processName == 'รออนุมัติ'"
              >
                <div>
                  <div>
                    <CDropdownItem
                      @click="considerRequestPage(item.finAdvanceId)"
                      >ตรวจสอบคำร้อง</CDropdownItem
                    >
                    <CDropdownDivider></CDropdownDivider>
                  </div>
                  <CDropdownItem @click="openChangeRequestEdit(item)"
                    >แก้ไขคำร้อง</CDropdownItem
                  >
                  <CDropdownItem @click="checkDelete(item)"
                    >ลบคำร้อง</CDropdownItem
                  >
                </div></CDropdown
              >
              <CDropdown
                color="info"
                size="sm"
                toggler-text=""
                class="ml-1"
                placement="left-start"
                v-if="item.processName == 'รอตรวจสอบ'"
              >
                <div>
                  <div>
                    <CDropdownItem
                      @click="considerRequestPage(item.finAdvanceId)"
                      >ตรวจสอบคำร้อง</CDropdownItem
                    >
                    <CDropdownDivider></CDropdownDivider>
                  </div>
                  <CDropdownItem @click="openChangeRequestEdit(item)"
                    >แก้ไขคำร้อง</CDropdownItem
                  >
                  <CDropdownItem @click="checkDelete(item)"
                    >ลบคำร้อง</CDropdownItem
                  >
                </div></CDropdown
              >
              <CDropdown
                color="info"
                size="sm"
                toggler-text=""
                class="ml-1"
                placement="left-start"
                v-if="item.processName == 'อนุมัติ'"
              >
                <div>
                  <div>
                    <CDropdownItem
                      @click="considerRequestPage(item.finAdvanceId)"
                      >ตรวจสอบผลดำเนินการ</CDropdownItem
                    >
                  </div>
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
      :show.sync="changeRequestCreateModal"
      centered
    >
      <CTextarea
        label="มีความประสงค์ขอเปลี่ยนแปลงเรื่อง"
        horizontal
        v-model="newChangeRequest.subject"
      />
      <CSelect
        label="เหตุผลที่ขอเปลี่ยนแปลง"
        placeholder="กรุณาเลือกเหตุผลที่ขอเปลี่ยนแปลง"
        :value.sync="newChangeRequest.reason"
        horizontal
        :options="reasonList"
      />
      <template #footer>
        <CButton color="secondary" @click="changeRequestCreateModal = false"
          >ยกเลิก</CButton
        >
        <CButton color="success" @click="changeRequestCreate()">ยืนยัน</CButton>
      </template>
    </CModal>

    <CModal
      title="แก้ไขขออนุมัติดำเนินการเปลี่ยนแปลง (Change Request Form)"
      color="warning"
      :show.sync="changeRequestEditModal"
      centered
    >
      <CTextarea
        label="มีความประสงค์ขอเปลี่ยนแปลงเรื่อง"
        horizontal
        v-model="editChangeRequest.subject"
      />
      <CSelect
        label="เหตุผลที่ขอเปลี่ยนแปลง"
        placeholder="กรุณาเลือกเหตุผลที่ขอเปลี่ยนแปลง"
        :value.sync="editChangeRequest.reason"
        horizontal
        :options="reasonList"
      />
      <template #footer>
        <CButton color="secondary" @click="changeRequestEditModal = false"
          >ยกเลิก</CButton
        >
        <CButton color="success" @click="changeRequestEdit()">ยืนยัน</CButton>
      </template>
    </CModal>
  </div>
</template>
<script>
import { jogetService } from "@/helpers/joget-helper";

export default {
  components: {
    jogetService
  },
  data() {
    return {
      infoAuth: [],
      tableLoading: false,
      changeRequestCreateModal: false,
      changeRequestEditModal: false,
      // changeRequestList: [],
      changeRequestFields: [
        { key: "index", label: "#", _style: "width:5%" },
        {
          key: "changeRequestId",
          label: "เลขที่เอกสาร",
          _style: "min-width:5%"
        },
        {
          key: "dateCreated",
          label: "วันที่ร้องขอ",
          _style: "min-width:10%"
        },
        {
          key: "subject",
          label: "ความประสงค์",
          _style: "min-width:10%"
        },
        {
          key: "reason",
          label: "เหตุผล",
          _style: "min-width:10%"
        },
        {
          key: "requester",
          label: "ผู้ร้องขอ",
          _style: "min-width:10%"
        },
        { key: "processName", label: "สถานะ", _style: "min-width:5%" },
        { key: "action", label: "", _style: "width:5%;" }
      ],
      projectList: [],
      reasonList: [
        { value: "new", label: "เพิ่มระบบใหม่" },
        { value: "edit", label: "ปรับปรุง/แก้ไข" },
        { value: "other", label: "อื่นๆ" }
      ],
      departmentList: [],
      newChangeRequest: {
        subject: "",
        reason: "",
        createBy: "",
        modiflyBy: "",
        processId: ""
      },
      editChangeRequest: {
        id: "",
        subject: "",
        reason: "",
        modiflyBy: "",
        processId: ""
      },
      projectIndex: 0,
      departmentIndex: 0,
      department: "",
      id: "",
      changeRequestList: []
    };
  },
  created() {
    // this.tableLoading = true;
    this.infoAuth = JSON.parse(localStorage.getItem("AuthUser"));
    this.newChangeRequest.createBy = this.infoAuth.fullname;
    this.newChangeRequest.modiflyBy = this.infoAuth.fullname;
    this.editChangeRequest.modiflyBy = this.infoAuth.fullname;
    this.getChangeRequest();
  },
  watch: {},
  methods: {
    async getChangeRequest() {
      console.log("getChangeRequest");
      const searchData = [
        {
          paramName: "changeRequestStatus",
          paramValue: "active"
        }
      ];
      await jogetService
        .list("mophApp", "list_moph_change_request", searchData)
        .then(res => {
          this.changeRequestList = res.data.data;
        });
    },

    async changeRequestCreate() {
      await jogetService
        .startProcess("mophApp", "changeManagementProcess")
        .then(res => {
          this.newChangeRequest.processName = "รออนุมัติ";
          console.log(this.newChangeRequest);
          jogetService
            .formSubmit(
              "mophApp",
              "moph_change_request",
              "",
              this.newChangeRequest
            )
            .then(res => {
              console.log(res);
            //   this.changeRequestCreateModal = false;
            //   this.getChangeRequest();
            });
        });
    },
    async openChangeRequestEdit(item) {
      this.changeRequestEditModal = true;
      this.editChangeRequest.id = item.id;
      this.editChangeRequest.subject = item.subject;
      this.editChangeRequest.reason = item.reason;
    },
    async changeRequestEdit() {
      await jogetService
        .startProcess("mophApp", "changeManagementProcess")
        .then(res => {
          jogetService
            .formSubmit(
              "mophApp",
              "moph_change_request",
              "",
              this.newChangeRequest
            )
            .then(res => {
              this.changeRequestCreateModal = false;
              this.getChangeRequest();
            });
        });
    },
    considerRequestPage(changeRequestId) {
      let routeData = this.$router.resolve({
        name: "AddData",
        query: { data: changeRequestId }
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
    }
  }
};
</script>
