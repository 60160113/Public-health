<template>
  <div>
    <CCard>
      <CCardHeader>
        <strong class="text-primary">เอกสารแนบ</strong>
      </CCardHeader>
      <CCardBody>
        <CButton
          color="primary"
          @click="
            modal = true;
            status = 'add';
          "
          >เพิ่ม</CButton
        >
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
          :responsive="false"
          :loading="loading"
        >
          <template #no-items-view
            ><div class="text-center">ไม่พบข้อมูล</div>
          </template>
          <template #index="{ index }">
            <td width="5%">
              {{ index + 1 }}
            </td>
          </template>
          <template #status="{ item }">
            <td>
              <CBadge
                :color="item.status == 'active' ? 'success' : 'danger'"
                style="font-size: 15px"
                >{{ item.status == "active" ? "ใช้งาน" : "ปิด" }}</CBadge
              >
            </td>
          </template>
          <template #action="{ item }">
            <td>
              <CDropdown color="secondary" toggler-text="" size="sm">
                <template slot="toggler-content">
                  <CIcon name="cil-options" />
                </template>
                <CDropdownItem
                  v-c-tooltip="item.status == 'active' ? 'ปิด' : 'เปิด'"
                  @click.prevent="
                    changeStatus(
                      item.id,
                      item.status == 'active' ? 'cancel' : 'active'
                    )
                  "
                  >{{ item.status == "active" ? "ปิด" : "เปิด" }}</CDropdownItem
                >
                <CDropdownDivider />
                <CDropdownItem
                  v-c-tooltip="'แก้ไข'"
                  @click="
                    modal = true;
                    status = 'edit';
                    form.id = item.id;
                    form.attachment = item.attachment;
                  "
                  >แก้ไข</CDropdownItem
                >
                <CDropdownDivider />
                <CDropdownItem
                  v-c-tooltip="'ลบ'"
                  @click="
                    modal = true;
                    status = 'remove';
                    form = { ...item };
                  "
                  >ลบ</CDropdownItem
                >
              </CDropdown>
            </td>
          </template>
        </CDataTable>
      </CCardBody>
    </CCard>

    <!-- Modal -->
    <CModal
      :show.sync="modal"
      :no-close-on-backdrop="true"
      :centered="true"
      :color="
        status == 'remove' ? 'danger' : status == 'add' ? 'success' : 'warning'
      "
    >
      <b v-if="status == 'remove'">คุณต้องการลบรายการที่เลือกหรือไม่ ?</b>
      <CTextarea v-else label="เอกสารแนบ" v-model="form.attachment" />
      <template #header>
        <h6 class="modal-title">
          {{
            status == "remove" ? "ลบ" : status == "add" ? "เพิ่ม" : "แก้ไข"
          }}เอกสารแนบ
        </h6>
        <CButtonClose @click="modal = false" class="text-white" />
      </template>
      <template #footer>
        <CButton color="secondary" @click="modal = false">ยกเลิก</CButton>&nbsp;
        <CButton
          :color="status == 'remove' ? 'danger' : 'success'"
          @click.prevent="
            status == 'remove' ? remove() : submitForm(form.id, { ...form })
          "
          >{{ status == "remove" ? "ลบ" : "บันทึก" }}</CButton
        >
      </template>

      <CElementCover :opacity="0.8" v-show="loading" />
    </CModal>
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

      modal: false,

      form: {
        attachment: "",
        id: "",
        status: "active",
      },

      status: "add",

      fields: [
        { key: "index", label: "#", _style: "width:10%" },
        { key: "attachment", label: "เอกสารแนบ", _style: "width:70%" },
        { key: "status", label: "สถานะ", _style: "width:10%" },
        { key: "action", label: "ดำเนินการ", _style: "width:10%" },
      ],

      loading: false,
    };
  },
  methods: {
    getList() {
      this.loading = true;

      this.jogetListAll("mophApp", "list_change_request_attachment")
        .then((res) => {
          this.list = res.data;
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    submit(primaryKey, formData) {
      return this.jogetFormSubmit(
        "mophApp",
        "change_request_attachment",
        primaryKey,
        formData
      );
    },
    submitForm(id, formData) {
      this.loading = true;
      this.submit(id, formData)
        .then((res) => {
          this.getList();
          this.modal = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    changeStatus(id, status) {
      this.loading = true;
      this.submit(id, {
        status,
      })
        .then(() => {
          this.getList();
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    remove() {
      this.loading = true;
      this.jogetFormDelete("mophApp", "change_request_attachment", this.form.id)
        .then((res) => {
          this.getList();
          this.modal = false;
        })
        .catch((err) => {
          this.modal = false;
          this.loading = false;
        });
    },
  },
  watch: {
    modal: function (val) {
      if (!val) {
        this.form.id = "";
        this.form.attachment = "";
      }
    },
  },
};
</script>