<template>
  <div>
    <CRow>
      <CCol>
        <CCard>
          <CCardHeader
            ><strong style="color: #321fdb">Destination</strong></CCardHeader
          >
          <CCardBody>
            <CInputRadioGroup
              name="destination"
              :options="[
                { value: '-my-', label: 'My files' },
                { value: '-shared-', label: 'Shared file' },
                { value: '-root-', label: 'Repository' },
              ]"
              :checked.sync="destination"
              custom
            />
          </CCardBody>
        </CCard>
      </CCol>
      <CCol col="8">
        <CCard>
          <CCardHeader
            ><strong style="color: #321fdb">{{ currentFolder.name }}</strong>
            <div style="margin-top: 10px; opacity: 0.7">
              <span>Path :</span>
              <span :key="index" v-for="(item, index) in breadCrumb">
                <CLink @click="getNodeChildren(item.id)">
                  {{ item.name }} </CLink
                >/
              </span>
              <span>
                <CLink disabled>
                  {{ currentFolder.name }}
                </CLink>
              </span>
            </div>
          </CCardHeader>
          <CCardBody>
            <CDataTable
              v-show="!rerender"
              :items="list"
              :fields="[{ key: 'name', label: `${currentFolder.name}` }]"
              :responsive="false"
              sorter
              :loading="loading"
              :noItemsView="{
                noItems: 'ไม่มีข้อมูล',
                noResults: 'ไม่พบข้อมูล',
              }"
              clickableRows
              hover
              border
              pagination
            >
              <template #over-table>
                <div style="margin-top: 10px; margin-bottom: 10px">
                  <CButton
                    color="primary"
                    shape="pill"
                    :disabled="isRootPath || loading || !currentFolder.parentId"
                    @click="getNodeChildren(currentFolder.parentId)"
                    ><CIcon name="cil-arrow-left" /> ย้อนกลับ</CButton
                  >
                </div>
              </template>
              <template #name="{ item }">
                <td
                  :style="`cursor: pointer;background-color: ${
                    targetId == item.id ? '#f9b115' : 'transparent'
                  }`"
                  @click="
                    item.isFile
                      ? selectTarget(item.id)
                      : getNodeChildren(item.id)
                  "
                >
                  <CRow>
                    <CCol md="2">
                      <CIcon
                        height="42"
                        :style="`color: ${item.isFile ? '#3c4b64' : '#f9b115'}`"
                        :name="item.isFile ? 'cil-file' : 'cil-folder'"
                      />
                    </CCol>
                    <CCol>
                      {{ item.name }}
                      {{ item.title }}
                      <br />
                      Description:
                      {{ item.description }}
                    </CCol>
                  </CRow>
                </td>
              </template>
            </CDataTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
    <CButton
      color="primary"
      style="width: 100%"
      :disabled="!targetId"
      @click.prevent="onComplete(targetId)"
      >เลือก</CButton
    >
  </div>
</template>

<script>
import axios from "axios";

const user = JSON.parse(localStorage.getItem("AuthUser"));

const $http = axios.create({
  headers: { Authorization: "Basic " + window.btoa(user.ticket) },
});
export default {
  props: {
    onComplete: {
      type: Function,
      default: function () {
        return true;
      },
    },
    self: {
      type: String,
      default: "",
    },
  },
  created() {
    this.getNodeChildren(this.destination);
  },
  data() {
    return {
      loading: false,

      list: [],

      currentFolder: {
        id: "",
        name: "Loading...",
        path: {
          elements: [],
        },
      },

      targetId: "",

      destination: "-my-",

      rerender: false,
    };
  },
  methods: {
    async getNodeChildren(id) {
      try {
        this.loading = true;

        const currentFolder = await $http.get(
          `${process.env.VUE_APP_ALF_API}alfresco/versions/1/nodes/${id}?include=path`
        );

        this.currentFolder = currentFolder.data.entry;

        var hasMoreItems = false;
        const maxItems = 1000;
        var skipCount = 0;
        var arr = [];
        do {
          const response = await $http.get(
            `${process.env.VUE_APP_ALF_API}alfresco/versions/1/nodes/${id}/children?maxItems=${maxItems}&skipCount=${skipCount}&include=properties`
          );

          arr.push(
            ...response.data.list.entries.map((e) => {
              if (e.entry.hasOwnProperty("properties")) {
                Object.assign(e.entry, {
                  title: e.entry.properties.hasOwnProperty("cm:title")
                    ? `(${e["entry"]["properties"]["cm:title"]})`
                    : "",
                  description: e.entry.properties.hasOwnProperty(
                    "cm:description"
                  )
                    ? e["entry"]["properties"]["cm:description"]
                    : "-",
                });
              } else {
                Object.assign(e.entry, {
                  title: "",
                  description: "-",
                });
              }
              return e.entry;
            })
          );

          hasMoreItems = response.data.list.pagination.hasMoreItems;
          skipCount += maxItems;
        } while (hasMoreItems);
        this.list = arr.filter(item => item.id != this.self);
        this.loading = false;
      } catch (error) {}
    },
    selectTarget(id) {
      this.rerender = true;
      if (this.targetId == id) {
        this.targetId = "";
      } else {
        this.targetId = id;
      }
      this.rerender = false;
    },
  },
  watch: {
    destination: function (val) {
      this.getNodeChildren(val);
    },
  },
  computed: {
    breadCrumb() {
      if (this.currentFolder.path.elements) {
        const folderName = () => {
          switch (this.destination) {
            case "-my-":
              return this.$store.state.user.userId;
            case "-shared-":
              return "Shared";
            case "-root-":
              return "Company Home";
          }
        };
        const index = this.currentFolder.path.elements.findIndex(
          (item) => item.name == folderName()
        );
        if (index != -1) {
          return this.currentFolder.path.elements.slice(
            index,
            this.currentFolder.path.elements.length
          );
        } else {
          return [];
        }
      } else {
        return [];
      }
    },
    isRootPath() {
      const folderName = () => {
        switch (this.destination) {
          case "-my-":
            return this.$store.state.user.userId;
          case "-shared-":
            return "Shared";
          case "-root-":
            return "Company Home";
        }
      };
      if (this.currentFolder.path.elements) {
        return (
          this.currentFolder.path.elements.filter(
            (item) => item.name == folderName()
          ).length == 0
        );
      } else {
        return true;
      }
    },
  },
};
</script>