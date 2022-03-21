<template>
  <div>
    <CCard>
      <CCardHeader>
        <strong class="text-primary">หมายเลขบัตรเข้าอาคาร</strong>
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
          <template #action="{ item }">
            <td>
              <CDropdown color="secondary" toggler-text="" size="sm">
                <template slot="toggler-content">
                  <CIcon name="cil-options" />
                </template>
                <CDropdownDivider />
                <CDropdownItem
                  v-c-tooltip="'แก้ไข'"
                  @click="
                    modal = true;
                    status = 'edit';
                    form = item;
                  "
                  >แก้ไข</CDropdownItem
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
      :color="status == 'add' ? 'success' : 'warning'"
    >
      <CInput
        label="หมายเลขบัตรเข้าอาคาร"
        @keypress.enter="submit()"
        v-model="form.number"
      />
      <template #header>
        <h6 class="modal-title">
          {{ status == "add" ? "เพิ่ม" : "แก้ไข" }}หมายเลขบัตรเข้าอาคาร
        </h6>
        <CButtonClose @click="modal = false" class="text-white" />
      </template>
      <template #footer>
        <CButton color="danger" @click="modal = false">ยกเลิก</CButton>&nbsp;
        <CButton
          color="success"
          :disabled="!form.number"
          @click.prevent="submit()"
          >บันทึก</CButton
        >
      </template>

      <CElementCover :opacity="0.8" v-show="loading" />
    </CModal>
  </div>
</template>

<script>
import axios from "axios";
import { authHeader } from "@/helpers/auth-header";

export default {
  created() {
    this.getList();
  },
  data() {
    return {
      list: [],

      modal: false,

      status: "add",

      form: {
        number: "",
        id: "",
      },

      fields: [
        { key: "index", label: "#", _style: "width:10%" },
        { key: "number", label: "หมายเลข", _style: "width:70%" },
        { key: "action", label: "ดำเนินการ", _style: "width:20%" },
      ],

      loading: false,
      axiosOptions: {
        headers: authHeader(),
      },
    };
  },
  methods: {
    getList() {
      this.loading = true;
      const axiosData = {
        app: {
          appId: "mophApp",
          listId: "list_data_center_building_card",
        },
      };
      axios
        .post(
          `${process.env.VUE_APP_BACKEND_URL}/list/getAll`,
          axiosData,
          this.axiosOptions
        )
        .then((res) => {
          this.list = res.data.data;
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    submit() {
      this.loading = true;
      // submit
      var axiosData = {
        app: {
          appId: "mophApp",
          formId: "data_center_building_card",
        },
        primaryKey: this.form.id,
        formData: this.form,
      };
      console.log("axiosData", axiosData);

      axios
        .post(
          `${process.env.VUE_APP_BACKEND_URL}/form/submit`,
          axiosData,
          this.axiosOptions
        )
        .then((res) => {
            console.log(res);
          this.getList();
          this.modal = false;
        })
        .catch((err) => {
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