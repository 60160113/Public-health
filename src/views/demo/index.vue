<template>
  <div>
    <CCard>
      <CCardHeader>
        <h4>Login</h4>
      </CCardHeader>
      <CCardBody>
        <CRow>
          <CCol :md="{ size: '6', offset: '3' }">
            <CInput
              label="Email"
              v-model="email"
              horizontal
            />
            <CInput
              type="password"
              label="Password"
              v-model="password"
              horizontal
            />
          </CCol>
        </CRow>
        <CRow>
          <CCol :md="{ size: '6', offset: '3' }">
            <CButton color="primary" block @click="login">Log In</CButton>
          </CCol>
        </CRow>
      </CCardBody>
      <CCardFooter>

      </CCardFooter>
    </CCard>
  </div>    
</template>

<script>
import axios from 'axios'
export default {
  name: 'demo',
  data () {
    return {
      email: '',
      password: '',
    }
  },
  created () {
    
  },
  methods: {
    login () {
      const axiosData = {
        email: this.email,
        password: this.password
      }
      axios.post(`http://206.189.145.227:3344/auth/login`, axiosData)
        .then((res) => {
          const user = res.data.user
          user.token = res.data.token
          // const user = {
          //   id: res.data.user.id,
          //   email: res.data.user.email,
          //   fullname: res.data.user.fullname,
          //   department: res.data.user.department,
          //   permission: res.data.user.permission,
          //   groupPermission: res.data.user.groupPermission,
          //   token: res.data.token
          // }

          localStorage.setItem('AuthUser', JSON.stringify(user))
          this.$router.push({ name: 'Dashboard' })
        })
    }
  }
}
</script>

<style>

</style>