<template>
  <div>
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
      <template #name="{ item }">
        <td
          :style="`cursor: pointer;background-color: ${
            targetId == item.id ? '#f9b115' : 'transparent'
          }`"
          @click="
            item.isFile ? selectTarget(item.id, item.name) : getNodeChildren(item.id)
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
            <CCol md="2">
              <b class="text-primary">{{
                targetId == item.id ? "เลือก" : ""
              }}</b>
            </CCol>
          </CRow>
        </td>
      </template>
    </CDataTable>
    <CButton
      color="primary"
      style="width: 100%"
      :disabled="!targetId"
      @click.prevent="onComplete(targetId, targetName)"
      >เลือก</CButton
    >
  </div>
</template>

<script>
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
    id: {
      type: String,
      default: process.env.VUE_APP_ALF_DOCUMENT_FOLDER_ID,
    },
  },
  created() {
    this.getNodeChildren(this.id);
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
      targetName: "",

      rerender: false,
    };
  },
  methods: {
    async getNodeChildren(id) {
      try {
        this.loading = true;

        const currentFolder = await this.$alf_request.get(
          `${process.env.VUE_APP_ALF_API}alfresco/versions/1/nodes/${id}?include=path`
        );

        this.currentFolder = currentFolder.data.entry;

        var hasMoreItems = false;
        const maxItems = 1000;
        var skipCount = 0;
        var arr = [];
        do {
          const response = await this.$alf_request.get(
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
        this.list = arr.filter((item) => item.id != this.self);
        this.loading = false;
      } catch (error) {}
    },
    selectTarget(id, name) {
      this.rerender = true;
      if (this.targetId == id) {
        this.targetId = "";
        this.targetName = "";
      } else {
        this.targetId = id;
        this.targetName = name;
      }
      this.rerender = false;
    },
  },
};
</script>