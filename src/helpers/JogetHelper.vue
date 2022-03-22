<script>
import axios from "axios";

export default {
  methods: {
    // return header
    jogetAxiosOptions() {
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
    async jogetLogin(authData) {
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
            `${process.env.VUE_APP_BACKEND_URL}/list/getOne`,
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
          user.position = userData.data.position;
          localStorage.setItem("AuthUser", JSON.stringify(user));

          resolve(user);
        } catch (error) {
          reject(error);
        }
      });
    },

    // ==== PROCESS ====//
    // start process
    async jogetStartProcess(appId, processDefId) {
      const axiosData = {
        app: {
          appId: appId,
          processDefId: processDefId,
        },
      };
      return await axios.post(
        `${process.env.VUE_APP_BACKEND_URL}/process/start`,
        axiosData,
        this.jogetAxiosOptions()
      );
    },
    // complete process
    async jogetProcessComplete(activityId, variables = null) {
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
        this.jogetAxiosOptions()
      );
    },

    // ==== ACTIVITY ==== //
    // current activity
    async jogetGetCurrentActivity(processId) {
      const axiosData = {
        processId: processId,
      };
      return await axios.post(
        `${process.env.VUE_APP_BACKEND_URL}/process/view`,
        axiosData,
        this.jogetAxiosOptions()
      );
    },

    // ==== FORM ====//
    // submit
    async jogetFormSubmit(appId, formId, primaryKey, formData) {
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
        this.jogetAxiosOptions()
      );
    },
    // delete
    async jogetFormDelete(appId, formId, primaryKey) {
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
        this.jogetAxiosOptions()
      );
    },

    // ==== LIST ====//
    // get
    async jogetList(appId, listId, searchData) {
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
        this.jogetAxiosOptions()
      );
    },
    // get all
    async jogetListAll(appId, listId) {
      const axiosData = {
        app: {
          appId: appId,
          listId: listId,
        },
      };
      return await axios.post(
        `${process.env.VUE_APP_BACKEND_URL}/list/getAll`,
        axiosData,
        this.jogetAxiosOptions()
      );
    },
    // get one
    async jogetGetOne(appId, listId, searchData) {
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
        this.jogetAxiosOptions()
      );
    },
  },
};
</script>