<template>
  <div
    class="c-app flex-row align-items-center"
    :class="{ 'c-dark-theme': $store.state.darkMode }"
  >
    <CContainer>
      <CRow class="justify-content-center">
        <CCol md="8">
          <CCardGroup>
            <CCard class="p-4">
              <CCardBody>
                <CForm>
                  <h1>เข้าสู่ระบบ</h1>
                  <CInput
                    placeholder="Username"
                    autocomplete="username email"
                    v-model.trim="form.email"
                    @keypress.enter="validate ? login() : false"
                  >
                    <template #prepend-content
                      ><CIcon name="cil-user"
                    /></template>
                  </CInput>
                  <CInput
                    placeholder="Password"
                    type="password"
                    autocomplete="curent-password"
                    v-model.trim="form.password"
                    @keypress.enter="validate ? login() : false"
                  >
                    <template #prepend-content
                      ><CIcon name="cil-lock-locked"
                    /></template>
                  </CInput>
                  <CRow>
                    <CCol col="6" class="text-left">
                      <CButton
                        color="primary"
                        class="px-4"
                        @click.prevent="login()"
                        >เข้าสู่ระบบ</CButton
                      >&nbsp;
                      <CButton
                        color="primary"
                        class="px-4"
                        @click.prevent="reservePage()"
                        >จองเข้าศูนย์ปฏิบัติการ</CButton
                      >
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>

    <CModal
      title="ข้อมูลไม่ถูกต้อง"
      color="danger"
      size="sm"
      :show.sync="loginErrorModal"
      centered
    >
      <b>อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง</b>
      <template #footer>
        <CButton
          color="secondary"
          class="float-right"
          @click="loginErrorModal = false"
          >ปิด</CButton
        >
      </template>
    </CModal>

    <CElementCover :opacity="0.8" v-if="loading">
      <h1 class="d-inline">Loading...</h1>
      <CSpinner size="5xl" color="success" />
    </CElementCover>
  </div>
</template>

<script>
import JogetHelper from "@/helpers/JogetHelper";
export default {
  name: "Login",
  mixins: [JogetHelper],
  created() {
    const user = JSON.parse(localStorage.getItem("AuthUser"));
    if (user) {
      this.$router.push("/home");
    }
  },
  data() {
    return {
      form: {
        email: "",
        password: "",
      },

      loading: false,

      loginErrorModal: false,
    };
  },
  methods: {
    login() {
      this.loading = true;
      this.jogetLogin(this.form)
        .then((res) => {
          this.loading = false;
          this.$router.push("/home");
        })
        .catch((err) => {
          this.loading = false;
          this.loginErrorModal = true;
        });
    },
    reservePage() {
      let routeData = this.$router.resolve("/data-center/reserve");
      window.open(routeData.href, "_blank");
    },
  },
  computed: {
    validate() {
      return Object.values(this.form).filter((item) => !item).length == 0;
    },
  },
};
</script>
