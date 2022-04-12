<template>
  <div>{{ processId }}</div>
</template>

<script>
import JogetHelper from "@/helpers/JogetHelper";
export default {
  mixins: [JogetHelper],
  props: {
    onComplete: {
      type: Function,
      default: function () {
        return true;
      },
    },
    processId: {
      type: String,
      default: "",
    },
    id: {
      type: String,
      default: "",
    },
  },
};
</script>