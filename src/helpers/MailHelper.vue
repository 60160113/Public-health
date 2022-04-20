<script>
import axios from "axios";
export default {
  methods: {
    // return header
    mailAxiosOptions(localStorageIndex = "") {
      const storageIndex = localStorageIndex ? localStorageIndex : "AuthUser";
      const AuthUser = JSON.parse(localStorage.getItem(storageIndex));
      // return authorization header with jwt token
      if (AuthUser && AuthUser.token) {
        return {
          headers: { Authorization: "Bearer " + AuthUser.token },
        };
      } else {
        return { headers: {} };
      }
    },
    async sendMail(
      to,
      subject,
      html,
      from = "",
      localStorageIndex = "AuthUser"
    ) {
      var axiosData = {
        to,
        subject,
        html,
      };
      if (from) {
        axiosData["from"] = from;
      }
      return await axios.post(
        `${process.env.VUE_APP_BACKEND_URL}/mail/send${
          Array.isArray(to) ? "/multiple" : ""
        }`,
        axiosData,
        this.mailAxiosOptions(localStorageIndex)
      );
    },
  },
};
</script>