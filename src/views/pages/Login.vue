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
                  <h1>Login</h1>
                  <p class="text-muted">Sign In to your account</p>
                  <CInput
                    placeholder="Username"
                    autocomplete="username email"
                    v-model.trim="form.email"
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
                        @click.prevent="login"
                        >Login</CButton
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
      size="lg"
      :show.sync="loginErrorModal"
      centered
    >
      <p>อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง</p>
      <template #footer>
        <CButton
          color="danger"
          class="float-right"
          @click="loginErrorModal = false"
          >ปิด</CButton
        >
      </template>
    </CModal>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Login",
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

      loginErrorModal: false,
    };
  },
  methods: {
    login() {
      const axiosHeader = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      axios
        .post(
          `${process.env.VUE_APP_BACKEND_URL}/auth/login`,
          this.form,
          axiosHeader
        )
        .then(async (res) => {
          const userData = await axios.post(
            `${process.env.VUE_APP_BACKEND_URL}/list/get`,
            {
              app: {
                appId: "mophApp",
                listId: "user_accounts",
              },
              search: [
                {
                  paramName: "id",
                  paramValue: res.data.user.id,
                },
              ],
            },
            {
              headers: { Authorization: "Bearer " + res.data.token },
            }
          );
          const alf_login = await axios.post(
            `${process.env.VUE_APP_ALF_API}authentication/versions/1/tickets`,
            {
              userId: "jack",
              password: "ivsoft",
            }
          );
          this.$alf_request.defaults.headers[
            "Authorization"
          ] = `Basic ${window.btoa(alf_login.data.entry.id)}`;
          const user = res.data.user;
          user.token = res.data.token;
          user.ticket = alf_login.data.entry.id;
          user.position = userData.data[0].position;
          localStorage.setItem("AuthUser", JSON.stringify(user));
          this.$router.push("/home");
        })
        .catch((err) => {
          this.loginErrorModal = true;
        });
    },
  },
};
</script>
