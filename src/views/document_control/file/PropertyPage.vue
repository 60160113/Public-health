<template>
  <div>
    <CCard>
      <CCardHeader>
        <strong style="color: #321fdb">รายละเอียดเอกสาร</strong>
      </CCardHeader>
      <CCardBody>
        <Properties v-if="$route.params.id != ''" :id="$route.params.id" />
      </CCardBody>
    </CCard>
  </div>
</template>

<script>
import Properties from "./Properties";
export default {
  components: {
    Properties,
  },
};
</script>