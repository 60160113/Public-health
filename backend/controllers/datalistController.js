const axios = require("axios");
const jogetUser = require("../configs/json/JogetUser.json");
const juser = jogetUser.jogetUser;

module.exports = {
  getOne: async (req, res, next) => {
    try {
      const permission = req.payload.permission;
      const reqApp = req.body.app;
      let params = "";
      if (req.body.search) {
        const search = req.body.search;
        search.forEach(param => {
          params = `${params}&${param.paramName}=${param.paramValue}`;
        });
      }
      const result = await axios.post(
        encodeURI(
          `${process.env.APP_JOGET_URL}web/json/data/list/${reqApp.appId}/${reqApp.listId}/?j_username=${juser[permission].username}&j_password=${juser[permission].password}${params}`
        )
      );
      if (result.data.data.length >= 1) {
        res.status(200).send(result.data.data[0]);
      } else {
        res.send({message: "No Data"});
      }
    } catch (error) {
      res.status(error.response.status);
    }
  },
  getAll: async (req, res, next) => {
    const permission = req.payload.permission;
    const reqApp = req.body.app;

    try {
      let start = 0;
      let hasMoreItem = false;
      const maxItem = 10;
      let data = [];
      do {
        const url = encodeURI(
          `${process.env.APP_JOGET_URL}web/json/data/list/${reqApp.appId}/${reqApp.listId}/?j_username=${juser[permission].username}&j_password=${juser[permission].password}&start=${start}`
        );
        const responseData = await axios.post(url);
        start += responseData.data.data.length;
        data = [...data, ...responseData.data.data];

        hasMoreItem =
          responseData.data.data.length >= maxItem &&
          responseData.data.total > start;
      } while (hasMoreItem);
      res.status(200).send(data);
    } catch (error) {
      res.status(500).send({ errorText: "Error on Get List" });
    }
  },
  get: async (req, res, next) => {
    const permission = req.payload.permission;
    const reqApp = req.body.app;
    let params = "";
    try {
      if (req.body.search) {
        const search = req.body.search;
        search.forEach(param => {
          params = `${params}&${param.paramName}=${param.paramValue}`;
        });
      }
      let start = 0;
      let hasMoreItem = false;
      const maxItem = 10;
      let data = [];
      do {
        const url = encodeURI(
          `${process.env.APP_JOGET_URL}web/json/data/list/${reqApp.appId}/${reqApp.listId}/?j_username=${juser[permission].username}&j_password=${juser[permission].password}${params}&start=${start}`
        );
        const responseData = await axios.post(url);
        start += responseData.data.data.length;
        data = [...data, ...responseData.data.data];
        if (
          responseData.data.data.length >= maxItem &&
          responseData.data.total > start
        ) {
          hasMoreItem = true;
        } else {
          hasMoreItem = false;
        }
      } while (hasMoreItem);
      res.status(200).send(data);
    } catch (error) {
      res.status(500).send({ errorText: "Error on Get List" });
    }
  }
};
