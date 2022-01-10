<template>
  <div>
    <PreviewData :id="$route.params.processId" /><CElementCover
      :opacity="0.8"
      v-if="loading"
    />
  </div>
</template>

<script>
import axios from "axios";
import { authHeader } from "@/helpers/auth-header";

import PreviewData from "@/views/data_center/components/PreviewData.vue";

const user = JSON.parse(localStorage.getItem("AuthUser"));
export default {
  components: {
    PreviewData,
  },
  created() {
    const axiosData = {
      app: {
        appId: "mophApp",
        listId: "list_data_center",
      },
      search: [
        {
          paramName: "processId",
          paramValue: this.$route.params.processId,
        },
      ],
    };
    axios
      .post(
        `${process.env.VUE_APP_BACKEND_URL}/list/get`,
        axiosData,
        this.axiosOptions
      )
      .then((res) => {
        this.form.id = res.data.data[0].id;
      });
  },
  data() {
    return {
      loading: false,

      form: {
        id: "",
      },

      axiosOptions: {
        headers: authHeader(),
      },
    };
  },
  methods: {},
};
</script>