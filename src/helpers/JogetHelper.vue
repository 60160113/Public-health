<script>
import axios from "axios";

export default {
  methods: {
    // return header
    axiosOptions() {
      const AuthUser = JSON.parse(localStorage.getItem("AuthUser"));
      // return authorization header with jwt token
      if (AuthUser && AuthUser.token) {
        return {
          headers: { Authorization: "Bearer " + AuthUser.token },
        };
      } else {
        return { headers: {} };
      }
    },

    // ==== AUTHEN ==== //
    async login(authData) {
      return new Promise(async (resolve, reject) => {
        try {
          // login
          const response = await axios.post(
            `${process.env.VUE_APP_BACKEND_URL}/auth/login`,
            authData,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          // get data
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
                  paramValue: response.data.user.id,
                },
              ],
            },
            {
              headers: { Authorization: "Bearer " + response.data.token },
            }
          );
          // set data (to localStorage)
          const user = response.data.user;
          user.token = response.data.token;
          user.position = userData.data[0].position;
          localStorage.setItem("AuthUser", JSON.stringify(user));

          resolve(user);
        } catch (error) {
          reject(error);
        }
      });
    },

    // ==== PROCESS ====//
    // start process
    async startProcess(appId, processDefId) {
      const axiosData = {
        app: {
          appId: appId,
          processDefId: processDefId,
        },
      };
      return await axios.post(
        `${process.env.VUE_APP_BACKEND_URL}/process/start`,
        axiosData,
        this.axiosOptions()
      );
    },
    // complete process
    async processComplete(activityId, variables = null) {
      var axiosData = {
        activityId: activityId,
      };
      if (variables) {
        axiosData["variables"] = variables;
      }
      return await axios.post(
        `${process.env.VUE_APP_BACKEND_URL}/process/complete${
          variables ? "WithVariable" : ""
        }`,
        axiosData,
        this.axiosOptions()
      );
    },

    // ==== ACTIVITY ==== //
    // current activity
    async getCurrentActivity(processId) {
      const axiosData = {
        processId: processId,
      };
      return await axios.post(
        `${process.env.VUE_APP_BACKEND_URL}/process/view`,
        axiosData,
        this.axiosOptions()
      );
    },

    // ==== FORM ====//
    // submit
    async formSubmit(appId, formId, primaryKey, formData) {
      const axiosData = {
        app: {
          appId: appId,
          formId: formId,
        },
        primaryKey: primaryKey,
        formData: formData,
      };
      return await axios.post(
        `${process.env.VUE_APP_BACKEND_URL}/form/submit`,
        axiosData,
        this.axiosOptions()
      );
    },
    // delete
    async formDelete(appId, formId, primaryKey) {
      const axiosData = {
        app: {
          appId: appId,
          formId: formId,
        },
        primaryKey: primaryKey,
      };
      return await axios.post(
        `${process.env.VUE_APP_BACKEND_URL}/form/delete`,
        axiosData,
        this.axiosOptions()
      );
    },

    // ==== LIST ====//
    // get
    async list(appId, listId, searchData) {
      const axiosData = {
        app: {
          appId: appId,
          listId: listId,
        },
        search: searchData,
      };
      return await axios.post(
        `${process.env.VUE_APP_BACKEND_URL}/list/get`,
        axiosData,
        this.axiosOptions()
      );
    },
    // get all
    async listAll(appId, listId) {
      const axiosData = {
        app: {
          appId: appId,
          listId: listId,
        },
      };
      return await axios.post(
        `${process.env.VUE_APP_BACKEND_URL}/list/getAll`,
        axiosData,
        this.axiosOptions()
      );
    },
    // get one
    async getOne(appId, listId, searchData) {
      const axiosData = {
        app: {
          appId: appId,
          listId: listId,
        },
        search: searchData,
      };
      return await axios.post(
        `${process.env.VUE_APP_BACKEND_URL}/list/getOne`,
        axiosData,
        this.axiosOptions()
      );
    },
  },
};
</script>