<template>
  <div>
    <PreviewData :id="$route.params.processId" />
  </div>
</template>

<script>
import PreviewData from "@/views/data_center/components/PreviewData.vue";

export default {
  components: {
    PreviewData,
  },
};
</script>