<template>
  <div>
    <CCard>
      <CCardHeader>
        <strong class="text-primary">หมายเลขบัตรเข้าศูนย์ปฏิบัติการ</strong>
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

          <template #action="{ item }">
            <td>
              <CDropdown color="secondary" toggler-text="" size="sm">
                <template slot="toggler-content">
                  <CIcon name="cil-options" />
                </template>
                <CDropdownItem
                  v-c-tooltip="'แก้ไข'"
                  @click="
                    modal = true;
                    status = 'edit';
                    form = { ...item };
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
      <CInput
        v-else
        label="หมายเลขบัตรเข้าศูนย์ปฏิบัติการ"
        @keypress.enter="submit()"
        v-model="form.number"
      />
      <template #header>
        <h6 class="modal-title">
          {{
            status == "remove" ? "ลบ" : status == "add" ? "เพิ่ม" : "แก้ไข"
          }}หมายเลขบัตรเข้าศูนย์ปฏิบัติการ
        </h6>
        <CButtonClose @click="modal = false" class="text-white" />
      </template>
      <template #footer>
        <CButton color="secondary" @click="modal = false">ยกเลิก</CButton>&nbsp;
        <CButton
          :color="status == 'remove' ? 'danger' : 'success'"
          :disabled="!form.number"
          @click.prevent="status == 'remove' ? remove() : submit()"
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

      status: "add", // add, edit, remove

      form: {
        number: "",
        id: "",
      },

      fields: [
        { key: "number", label: "หมายเลข", _style: "width:70%" },
        { key: "action", label: "ดำเนินการ", _style: "width:30%" },
      ],

      loading: false,
    };
  },
  methods: {
    getList() {
      this.loading = true;
      this.jogetListAll("mophApp", "list_data_center_card")
        .then((res) => {
          this.list = res.data;
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    submit() {
      this.loading = true;
      this.jogetFormSubmit(
        "mophApp",
        "data_center_card",
        this.form.id,
        this.form
      )
        .then((res) => {
          this.getList();
          this.modal = false;
        })
        .catch((err) => {
          this.modal = false;
          this.loading = false;
        });
    },
    remove() {
      this.loading = true;
      this.jogetFormDelete("mophApp", "data_center_card", this.form.id)
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
        this.form.number = "";
      }
    },
  },
};
</script>