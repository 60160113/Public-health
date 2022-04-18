<template>
  <div style="margin: 30px">
    <CCard v-if="!completed">
      <CCardHeader>
        <strong class="text-primary">ติดต่อเข้าอาคาร</strong>
      </CCardHeader>

      <CCardBody>
        <!-- reserve_date -->
        <CRow>
          <CCol>
            <label>วันที่ต้องการจอง <b style="color: red">*</b></label>
            <v-date-picker
              :min-date="disabledDate"
              mode="dateTime"
              :masks="{
                input: 'YYYY-MM-DD',
              }"
              :model-config="{
                type: 'string',
                mask: 'iso',
              }"
              is24hr
              v-model="reserve_form.reserve_date"
            >
              <template v-slot="{ inputValue, inputEvents }">
                <CInput :value="inputValue" v-on="inputEvents" />
              </template>
            </v-date-picker>
          </CCol>
        </CRow>
        <hr />

        <!-- booker T A B L E -->
        <div id="booker_section">
          <h5 class="text-primary">
            รายการผู้จอง <b style="color: red">*</b> (ต้องมีอย่างน้อย 1 รายการ)
          </h5>
          <CDataTable
            :items="arr_list.booker"
            :fields="booker_field"
            pagination
            :items-per-page="5"
            :itemsPerPageSelect="{
              label: 'แสดง',
            }"
          >
            <template #no-items-view
              ><div class="text-center">ไม่พบข้อมูล</div>
            </template>
            <template #over-table>
              <div style="margin-bottom: 10px">
                <CButton
                  color="success"
                  @click.prevent="
                    modalName = 'booker';
                    modal = true;
                  "
                  >เพิ่มผู้จอง</CButton
                >
              </div>
            </template>
            <template #action="{ index }">
              <td>
                <CButton
                  color="danger"
                  @click="arr_list.booker.splice(index, 1)"
                  >ลบ</CButton
                >
              </td>
            </template>
          </CDataTable>
        </div>

        <hr />
        <!-- reserve D E T A I L -->
        <CRow id="reserve_section">
          <CCol md="6">
            <CSelect
              label="ผู้ติดต่อ"
              placeholder="กรุณาเลือกผู้ติดต่อ"
              :options="ISS_options"
              :value.sync="reserve_form.ISS"
            />
          </CCol>
          <CCol md="6">
            <CSelect
              label="วัตถุประสงค์"
              placeholder="กรุณาเลือกวัตถุประสงค์"
              :options="objective_options"
              :value.sync="reserve_form.objective"
            />
          </CCol>
          <CCol col="12">
            <CTextarea label="หมายเหตุ" v-model="reserve_form.note" />
          </CCol>
        </CRow>
        <hr />

        <!-- hardware T A B L E -->
        <div id="hardware_section">
          <h5 class="text-primary">รายการ Hardwares</h5>
          <CDataTable
            :items="arr_list.hardware"
            :fields="hardware_field"
            pagination
            :items-per-page="5"
            :itemsPerPageSelect="{
              label: 'แสดง',
            }"
          >
            <template #no-items-view
              ><div class="text-center">ไม่พบข้อมูล</div>
            </template>
            <template #over-table>
              <div style="margin-bottom: 10px">
                <CButton
                  color="success"
                  @click.prevent="
                    modalName = 'hardware';
                    modal = true;
                  "
                  >เพิ่ม Hardware</CButton
                >
              </div>
            </template>
            <template #type="{ item }">
              <td>
                {{ item.type }}
                <p v-if="item.return_date">
                  (ส่งคืนวันที่ {{ toThaiFormatWithTime(item.return_date) }})
                </p>
              </td>
            </template>
            <template #action="{ index }">
              <td>
                <CButton
                  color="danger"
                  @click="arr_list.hardware.splice(index, 1)"
                  >ลบ</CButton
                >
              </td>
            </template>
          </CDataTable>
        </div>
      </CCardBody>

      <CCardFooter>
        <CButton
          style="width: 100%"
          color="primary"
          @click.prevent="submit()"
          :disabled="disabledButton"
          >บันทึก</CButton
        >
      </CCardFooter>
    </CCard>

    <CCard v-else>
      <CCardHeader><strong class="text-primary">เสร็จสิ้น</strong></CCardHeader>
      <CCardBody>ข้อมูลการจองของคุณถูกจัดเก็บไปยังฐานข้อมูลเสร็จสิ้น</CCardBody>
    </CCard>

    <!-- M O D A L -->
    <CModal
      :show.sync="modal"
      :centered="true"
      :closeOnBackdrop="false"
      size="xl"
      color="success"
    >
      <!-- BOOKER M O D A L -->
      <CRow v-if="modalName == 'booker'">
        <CCol md="6">
          <CInput label="ชื่อ - สกุล" v-model="arr_form.booker.name" />
        </CCol>
        <CCol md="6">
          <CInput label="ตำแหน่ง" v-model="arr_form.booker.position" />
        </CCol>

        <CCol md="6">
          <CInput label="สังกัด/บริษัท" v-model="arr_form.booker.affiliation" />
        </CCol>
        <CCol md="6">
          <label for="idcard">เลขที่บัตรประชาชน</label>
          <masked-input
            id="idcard"
            type="text"
            class="form-control"
            :mask="idCardMaskInput"
            :guide="true"
            placeholderChar="#"
            v-model="arr_form.booker.idcard"
          />
        </CCol>
      </CRow>

      <!-- HARDWARE M O D A L -->
      <div v-else>
        <CRow>
          <CCol col="6">
            <CInput label="ชื่อ" v-model="arr_form.hardware.name" />
          </CCol>
          <CCol col="6">
            <CInput label="ยี่ห้อ" v-model="arr_form.hardware.brand" />
          </CCol>

          <CCol col="6">
            <CInput label="S/N" v-model="arr_form.hardware.serial_number" />
          </CCol>
          <CCol col="6">
            <CInput
              label="จำนวน"
              type="number"
              v-model="arr_form.hardware.unit"
            />
          </CCol>
        </CRow>
        <hr />

        <label>นำเข้า - นำออก</label>
        <CInputRadioGroup
          :options="[
            { value: 'เข้า', label: 'เข้า' },
            { value: 'ออก', label: 'ออก' },
          ]"
          :checked.sync="arr_form.hardware.status"
          custom
          inline
        />

        <hr />
        <label>รูปแบบ</label>
        <CInputRadioGroup
          :options="[
            { value: 'ชั่วคราว', label: 'ชั่วคราว' },
            { value: 'ถาวร', label: 'ถาวร' },
          ]"
          :checked.sync="arr_form.hardware.type"
          custom
          inline
        />

        <div v-if="arr_form.hardware.type == 'ชั่วคราว'">
          <hr />
          <CRow class="mt-3">
            <CCol>
              <label>วันที่ส่งคืน</label>
              <v-date-picker
                :min-date="disabledDate"
                mode="dateTime"
                :masks="{
                  input: 'YYYY-MM-DD',
                }"
                is24hr
                v-model="arr_form.hardware.return_date"
              >
                <template v-slot="{ inputValue, inputEvents }">
                  <CInput :value="inputValue" v-on="inputEvents" />
                </template>
              </v-date-picker>
            </CCol>
          </CRow>
        </div>
      </div>
      <template #header>
        <h5 class="modal-title">
          เพิ่ม{{ modalName == "booker" ? "ผู้จอง" : " hardware" }}
        </h5>
        <CButtonClose @click="modal = false" class="text-white" />
      </template>
      <template #footer>
        <CButton color="secondary" @click="modal = false">ยกเลิก</CButton>&nbsp;
        <CButton color="success" @click.prevent="addItem()">บันทึก</CButton>
      </template>
    </CModal>

    <CElementCover :opacity="0.8" v-if="loading">
      <h1 class="d-inline">Loading...</h1>
      <CSpinner size="5xl" color="success" />
    </CElementCover>
  </div>
</template>

<script>
import JogetHelper from "@/helpers/JogetHelper";
import dateFormat from "@/helpers/dateFormat.vue";
import { DatePicker } from "v-calendar";
import MaskedInput from "vue-text-mask";
export default {
  mixins: [JogetHelper, dateFormat],
  components: { "v-date-picker": DatePicker, MaskedInput },
  created() {
    this.loading = true;
    this.login("application", "application").then(async (res) => {
      // get objectives
      const objectives = await this.jogetList(
        "mophApp",
        "list_data_center_objectives",
        [
          {
            paramName: "status",
            paramValue: "active",
          },
        ],
        "tempUser"
      );
      this.objective_options = [
        ...objectives.data.map((item) => item.objective),
        "อื่น ๆ",
      ];
      // get ISS
      const ISS_list = await this.jogetList(
        "mophApp",
        "user_accounts",
        [
          {
            paramName: "position",
            paramValue: "ISS",
          },
        ],
        "tempUser"
      );
      this.ISS_options = ISS_list.data.map((item) => {
        return { value: `${item.id};${item.fullname}`, label: item.fullname };
      });
      this.loading = false;
    });
  },
  beforeRouteLeave(to, from, next) {
    localStorage.removeItem("tempUser");
  },
  data() {
    return {
      // form
      reserve_form: {
        reserve_date: null,
        objective: "",
        note: "",

        ISS: "", // id;name
      },

      arr_form: {
        booker: {
          name: "",
          position: "",
          affiliation: "",
          idcard: "",
        },
        hardware: {
          name: "",
          brand: "",
          serial_number: "",
          unit: "",
          status: "เข้า",
          type: "ชั่วคราว",
          return_date: null,
        },
      },

      arr_list: {
        booker: [],

        hardware: [],
      },

      // options
      objective_options: [],
      ISS_options: [],

      // table field
      booker_field: [
        { key: "name", label: "ชื่อ - สกุล", _style: "width:40%" },
        { key: "position", label: "ตำแหน่ง", _style: "width:15%" },

        { key: "affiliation", label: "สังกัด/บริษัท", _style: "width:15%" },
        { key: "idcard", label: "บัตรประชาชน", _style: "width:20%" },
        { key: "action", label: "", _style: "width:10%" },
      ],

      hardware_field: [
        { key: "name", label: "รายการ", _style: "width:25%" },
        { key: "brand", label: "ยี่ห้อ/รุ่น", _style: "width:10%" },
        {
          key: "serial_number",
          label: "S/N",
          _style: "width:10%",
        },
        { key: "unit", label: "จำนวน (ชุด)", _style: "width:15%" },
        { key: "status", label: "เข้า - ออก", _style: "width:15%" },
        { key: "type", label: "ชั่วคราว - ถาวร", _style: "width:15%" },
        { key: "action", label: "", _style: "width:10%" },
      ],

      // etc
      modal: false,
      modalName: "",
      loading: false,
      completed: false,

      idCardMaskInput: [
        /\d/,
        "-",
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        "-",
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        "-",
        /\d/,
        /\d/,
        "-",
        /\d/,
      ],
    };
  },
  methods: {
    login(email, password) {
      return this.jogetLogin({ email, password }, "tempUser");
    },
    addItem() {
      this.arr_list[this.modalName].push(this.arr_form[this.modalName]);
      this.modal = false;
    },
    async submit() {
      try {
        this.loading = true;
        // start process
        const startProcess = await this.jogetStartProcess(
          "mophApp",
          "data_center_reserve_process",
          "tempUser"
        );
        const processId = startProcess.data.processId;

        // == Reserve == //
        const reserveData = {
          ...this.reserve_form,
          processId: processId,
          display_hasHardwares: this.arr_list.hardware.length > 0,
          display_requesterName: this.arr_list.booker[0]
            ? this.arr_list.booker[0].name
            : "",
          display_requesterPosition: this.arr_list.booker[0]
            ? this.arr_list.booker[0].position
            : "",
          display_requesterAffiliation: this.arr_list.booker[0]
            ? this.arr_list.booker[0].affiliation
            : "",
        };

        // Submit reserve
        await this.jogetFormSubmit(
          "mophApp",
          "data_center_reserve",
          "",
          reserveData,
          "tempUser"
        );

        // get reserve
        const reserveObj = await this.jogetGetOne(
          "mophApp",
          "list_data_center_reserve",
          [
            {
              paramName: "processId",
              paramValue: processId,
            },
          ],
          "tempUser"
        );

        // == Booker == //
        const bookerData = this.arr_list.booker.map((item) => {
          item.reserve_id = processId; // foreign key to processId of data_center_reserve
          item.reserve_request_id = reserveObj.data.request_id;
          item.reserve_date = reserveObj.data.reserve_date;
          item.assign = "position;guard"; // localStorage() field;value
          return {
            primaryKey: "",
            data: item,
          };
        });
        // == Hardware == //
        const hardwareData = this.arr_list.hardware.map((item) => {
          item.processId = processId;
          return {
            primaryKey: "",
            data: item,
          };
        });

        // Submit booker
        if (bookerData.length > 0) {
          await this.jogetMultipleFormSubmit(
            "mophApp",
            "data_center_booker",
            bookerData,
            "tempUser"
          );
        }
        // Submit hardware
        if (hardwareData.length > 0) {
          await this.jogetMultipleFormSubmit(
            "mophApp",
            "data_center_hardware",
            hardwareData,
            "tempUser"
          );
        }

        // activity
        const Activity = await this.jogetGetCurrentActivity(
          processId,
          "tempUser"
        );
        // process complete
        await this.jogetProcessComplete(
          Activity.data.activityId,
          null,
          "tempUser"
        ).then((res) => {
          this.loading = false;
          this.completed = true;
        });
      } catch (error) {
        this.loading = false;
      }
    },
  },
  computed: {
    disabledButton() {
      const reserveForm = (({ note, ...item }) => item)(this.reserve_form);
      return (
        Object.values(reserveForm).includes("") ||
        this.arr_list.booker.length == 0
      );
    },
    disabledDate() {
      const today = new Date();
      const tomorow = new Date();
      tomorow.setDate(today.getDate() + 1);
      return tomorow;
    },
  },
  watch: {
    modal: function (val) {
      if (!val) {
        this.arr_form = {
          booker: {
            name: "",
            position: "",
            affiliation: "",
            idcard: "",
          },
          hardware: {
            name: "",
            brand: "",
            serial_number: "",
            unit: "",
            status: "เข้า",
            type: "ชั่วคราว",
            return_date: null,
          },
        };
      }
    },
  },
};
</script>