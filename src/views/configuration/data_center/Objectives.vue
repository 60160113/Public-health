<template>
  <div>
    <CCard>
      <CCardHeader>
        <strong class="text-primary">วัตถุประสงค์</strong>
      </CCardHeader>
      <CCardBody>
        <CButton
          color="primary"
          @click="
            modal = true;
            form.status = 'add';
          "
          >เพิ่ม</CButton
        >
        <CDataTable
          :items="objectives"
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
                    form.status = 'edit';
                    form.id = item.id;
                    form.objective = item.objective;
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
      :color="form.status == 'add' ? 'success' : 'warning'"
    >
      <CTextarea label="วัตถุประสงค์" v-model="form.objective" />
      <template #header>
        <h6 class="modal-title">
          {{ form.status == "add" ? "เพิ่ม" : "แก้ไข" }}วัตถุประสงค์
        </h6>
        <CButtonClose @click="modal = false" class="text-white" />
      </template>
      <template #footer>
        <CButton color="danger" @click="modal = false">ยกเลิก</CButton>&nbsp;
        <CButton
          color="success"
          @click.prevent="
            submitForm(form.id, { objective: form.objective, status: 'active' })
          "
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
    this.getObjectives();
  },
  data() {
    return {
      objectives: [],

      modal: false,

      form: {
        objective: "",
        id: "",
        status: "add",
      },

      fields: [
        { key: "index", label: "#", _style: "width:10%" },
        { key: "objective", label: "วัตถุประสงค์", _style: "width:70%" },
        { key: "status", label: "สถานะ", _style: "width:10%" },
        { key: "action", label: "ดำเนินการ", _style: "width:10%" },
      ],

      loading: false,
      axiosOptions: {
        headers: authHeader(),
      },
    };
  },
  methods: {
    getObjectives() {
      this.loading = true;
      const axiosData = {
        app: {
          appId: "mophApp",
          listId: "list_data_center_objectives",
        },
      };
      axios
        .post(
          `${process.env.VUE_APP_BACKEND_URL}/list/getAll`,
          axiosData,
          this.axiosOptions
        )
        .then((res) => {
          this.objectives = res.data.data;
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    submit(primaryKey, formData) {
      // submit
      var axiosData = {
        app: {
          appId: "mophApp",
          formId: "data_center_objectives",
        },
        primaryKey,
        formData,
      };

      return axios.post(
        `${process.env.VUE_APP_BACKEND_URL}/form/submit`,
        axiosData,
        this.axiosOptions
      );
    },
    submitForm(id, formData) {
      this.loading = true;
      this.submit(id, formData)
        .then(() => {
          this.getObjectives();
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
          this.getObjectives();
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
        this.form.objective = "";
      }
    },
  },
};
</script>