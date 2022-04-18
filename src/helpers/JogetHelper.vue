<script>
import axios from "axios";

export default {
  methods: {
    // return header
    jogetAxiosOptions(localStorageIndex = "") {
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

    // ==== AUTHEN ==== //
    async jogetLogin(authData, localStorageIndex = "AuthUser") {
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
          localStorage.setItem(localStorageIndex, JSON.stringify(user));

          resolve(user);
        } catch (error) {
          reject(error);
        }
      });
    },

    // ==== PROCESS ====//
    // start process
    async jogetStartProcess(appId, processDefId, localStorageIndex = "") {
      const axiosData = {
        app: {
          appId: appId,
          processDefId: processDefId,
        },
      };
      return await axios.post(
        `${process.env.VUE_APP_BACKEND_URL}/process/start`,
        axiosData,
        this.jogetAxiosOptions(localStorageIndex)
      );
    },
    // complete process
    async jogetProcessComplete(
      activityId,
      variables = null,
      localStorageIndex = ""
    ) {
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
        this.jogetAxiosOptions(localStorageIndex)
      );
    },

    // ==== ACTIVITY ==== //
    // current activity
    async jogetGetCurrentActivity(processId, localStorageIndex = "") {
      const axiosData = {
        processId: processId,
      };
      return await axios.post(
        `${process.env.VUE_APP_BACKEND_URL}/process/view`,
        axiosData,
        this.jogetAxiosOptions(localStorageIndex)
      );
    },

    // ==== FORM ====//
    // submit
    async jogetFormSubmit(
      appId,
      formId,
      primaryKey,
      formData,
      localStorageIndex = ""
    ) {
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
        this.jogetAxiosOptions(localStorageIndex)
      );
    },
    // multiple submit
    async jogetMultipleFormSubmit(
      appId,
      formId,
      formData,
      localStorageIndex = ""
    ) {
      const axiosData = {
        app: {
          appId: appId,
          formId: formId,
        },
        formData: formData,
      };
      return await axios.post(
        `${process.env.VUE_APP_BACKEND_URL}/form/submit/multiple`,
        axiosData,
        this.jogetAxiosOptions(localStorageIndex)
      );
    },
    // delete
    async jogetFormDelete(appId, formId, primaryKey, localStorageIndex = "") {
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
        this.jogetAxiosOptions(localStorageIndex)
      );
    },
    // multiple delete
    async jogetMultipleFormDelete(
      appId,
      formId,
      primaryKeys,
      localStorageIndex = ""
    ) {
      const axiosData = {
        app: {
          appId: appId,
          formId: formId,
        },
        primaryKeys: primaryKeys,
      };
      return await axios.post(
        `${process.env.VUE_APP_BACKEND_URL}/form/delete/multiple`,
        axiosData,
        this.jogetAxiosOptions(localStorageIndex)
      );
    },

    // ==== LIST ====//
    // get
    async jogetList(appId, listId, searchData, localStorageIndex = "") {
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
        this.jogetAxiosOptions(localStorageIndex)
      );
    },
    // get all
    async jogetListAll(appId, listId, localStorageIndex = "") {
      const axiosData = {
        app: {
          appId: appId,
          listId: listId,
        },
      };
      return await axios.post(
        `${process.env.VUE_APP_BACKEND_URL}/list/getAll`,
        axiosData,
        this.jogetAxiosOptions(localStorageIndex)
      );
    },
    // get one
    async jogetGetOne(appId, listId, searchData, localStorageIndex = "") {
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
        this.jogetAxiosOptions(localStorageIndex)
      );
    },
  },
};
</script>