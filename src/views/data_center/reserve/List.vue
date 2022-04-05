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
          :responsive="false"
        >
          <template #no-items-view
            ><div class="text-center">ไม่พบข้อมูล</div>
          </template>

          <template #reserve_date_label-filter>
            <v-date-picker
              v-model="filter.reserve_date"
              is-range
              :is-required="false"
            >
              <template v-slot="{ inputValue, inputEvents }">
                <CRow>
                  <CCol cols="11"
                    ><input
                      class="form-control form-control-sm"
                      v-on="inputEvents.start"
                      :value="
                        inputValue.start
                          ? `${inputValue.start} - ${inputValue.end}`
                          : ''
                      "
                    />
                    <input
                      class="form-control form-control-sm"
                      v-on="inputEvents.end"
                      :value="`${inputValue.start} - ${inputValue.end}`"
                      v-show="false"
                    />
                  </CCol>
                  <CCol cols="1"
                    ><CButton
                      size="sm"
                      @click="
                        filter.reserve_date.start = null;
                        filter.reserve_date.end = null;
                      "
                      >ล้าง</CButton
                    ></CCol
                  >
                </CRow>
              </template>
            </v-date-picker>
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

          <template #actions>
            <td>
              <CButton color="info" size="sm"><b>ดูรายละเอียด</b> </CButton
              >&nbsp;
              <CButton color="primary" size="sm"><b>ดำเนินการ</b> </CButton>
            </td>
          </template>

          <template #actions-filter> <p></p> </template>
        </CDataTable>
      </CCardBody>
    </CCard>
  </div>
</template>

<script>
import JogetHelper from "@/helpers/JogetHelper";
import { DatePicker } from "v-calendar";
export default {
  mixins: [JogetHelper],
  components: { "v-date-picker": DatePicker },
  created() {
    this.getList();
  },
  data() {
    return {
      list: [],

      filter: {
        hasHardwareStatus: "",
        reserve_date: {
          start: null,
          end: null,
        },
      },

      hasHardwareStatusOption: [
        { value: "", label: "ทั้งหมด" },
        { value: "มี", label: "มี" },
        { value: "ไม่มี", label: "ไม่มี" },
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
          key: "display_requesterPosition",
          label: "ตำแหน่ง",
          _style: "width:9%",
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
        { key: "actions", label: "", _style: "width:18%" },
      ],

      loading: false,
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
            item.reserve_date_label =
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
  computed: {
    filteredList() {
      var list = [...this.list];
      if (this.filter.hasHardwareStatus) {
        list = list.filter(
          (item) => item.hasHardwareStatus == this.filter.hasHardwareStatus
        );
      }
      if (this.filter.reserve_date.start) {
        list = list.filter((item) => {
          const reserve_time = item.reserve_date_label.split(" ")[1].split(":");
          const reserve_date = new Date(item.reserve_date).getTime();

          const start = new Date(this.filter.reserve_date.start);
          const end = new Date(this.filter.reserve_date.end);
          end.setHours(reserve_time[0], reserve_time[1], reserve_time[2]);

          return (
            reserve_date >= start.getTime() && reserve_date <= end.getTime()
          );
        });
      }
      return list;
    },
  },
};
</script>