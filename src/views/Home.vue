<template>
  <div>
    <CCard>
      <CCardBody>
        <!-- Content -->
        <CRow>
          <CCol md="3" :key="index" v-for="(item, index) in dataCenterCards">
            <CCardGroup>
              <CCard>
                <CCardHeader color="info"
                  ><h4>{{ item.label }}</h4></CCardHeader
                >
                <CCardBody>
                  <CCardText
                    ><h5>{{ item.value }}</h5></CCardText
                  >
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
        <!-- Content -->
      </CCardBody>
      <CElementCover :opacity="0.8" v-if="loading">
        <h1 class="d-inline">Loading...</h1>
        <CSpinner size="5xl" color="success" />
      </CElementCover>
    </CCard>
  </div>
</template>

<script>
import JogetHelper from "@/helpers/JogetHelper";
export default {
  mixins: [JogetHelper],
  data() {
    return {
      loading: false,

      dataCenterCards: [],
    };
  },
  methods: {
    async getDataCenterCards() {
      
    }
  },
};
</script>