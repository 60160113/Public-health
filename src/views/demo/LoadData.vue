<template>
  <div>
    <CCard>
      <CCardHeader>

      </CCardHeader>
    </CCard>
  </div>
</template>

<script>
import axios from 'axios'
import { authHeader } from '@/helpers/auth-header'
export default {
  name: '',
  data () {
    return {
      axiosOptions: {
        headers: authHeader()
      }
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    loadData () {
      const axiosData = {
        app: {
          appId: "userAccountManagement",
          listId: "findUser"
        },
        search: [
          {
            paramName: "email",
            paramValue: "sale"
          }
        ]
      }
      axios.post(`http://206.189.145.227:3344/list/getOne`, axiosData, this.axiosOptions)
        .then((res) => {
          console.log(res)
        })
    }
  }
}
</script>

<style>

</style>