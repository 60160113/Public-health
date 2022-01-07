<template>
    <div>
      <DetailForm :id="$route.params.processId" />

      <HardwareTables />
    </div>
</template>

<script>
import HardwareTables from "@/views/data_center/components/HardwareTables.vue";

import DetailForm from "@/views/data_center/components/DetailForm.vue";
export default {
      components: {
    HardwareTables,
    DetailForm,
  },
    props: {
    id: {
      type: String,
      default: "",
    },
  },
}
</script>