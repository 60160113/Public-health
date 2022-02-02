<template>
  <div>
    <DetailForm v-if="processId" :id="processId" />
    <DetailForm v-else :taskId="$route.params.id" />

    <HardwareTables v-if="processId" :id="processId" />
  </div>
</template>

<script>
import HardwareTables from "@/views/data_center/components/HardwareTables.vue";

import DetailForm from "@/views/data_center/components/DetailForm.vue";

import axios from "axios";
import { authHeader } from "@/helpers/auth-header";
export default {
  components: {
    HardwareTables,
    DetailForm,
  },
  async created() {
    const axiosData = {
      app: {
        appId: "mophApp",
        listId: "list_data_center",
      },
      search: [
        {
          paramName: "id",
          paramValue: this.$route.params.id,
        },
      ],
    };
    await axios
      .post(
        `${process.env.VUE_APP_BACKEND_URL}/list/get`,
        axiosData,
        this.axiosOptions
      )
      .then((res) => {
        this.processId = res.data.data[0].processId;
      });
  },
  data() {
    return {
      processId: "",

      axiosOptions: {
        headers: authHeader(),
      },
    };
  },
};
</script>