const axios = require("axios");
const jogetUser = require("../configs/json/JogetUser.json");
const juser = jogetUser.jogetUser;
const base64 = require('base-64')

module.exports = {
  submit: async (req, res, next) => {
    const app = req.body.app;
    const primaryKey = req.body.primaryKey;
    const formData = req.body.formData;
    const permission = req.payload.permission;
    const encoded = base64.encode(
      `${juser[permission].username}:${juser[permission].password}`
    );
    var form = new FormData();
    Object.keys(formData).forEach(function(key) {
      form.append(key, formData[key]);
    });
    const url = encodeURI(
      `${process.env.APP_JOGET_URL}web/json/data/form/store/${app.appId}/${app.formId}/${primaryKey}`
    );
    await axios
      .post(url, form, {
        headers: { Authorization: `Basic ${encoded}`, ...form.getHeaders() }
      })
      .then(response => {
        res.status(200).send(response.data);
      })
      .catch(error => {
        res.status(500).send({ statusText: "can not start process" });
      });
  },

  delete: async (req, res, next) => {
    const reqApp = req.body.app;
    const primaryKey = req.body.primaryKey;
    const permission = req.payload.permission;
    await axios
      .post(
        encodeURI(
          `${process.env.APP_JOGET_URL}web/json/data/form/delete/${reqApp.appId}/${reqApp.formId}/${primaryKey}?j_username=${juser[permission].username}&j_password=${juser[permission].password}`
        )
      )
      .then(response => {
        res.status(200).send(response.data);
      })
      .catch(error => {
        res.send(error);
      });
  }
};
