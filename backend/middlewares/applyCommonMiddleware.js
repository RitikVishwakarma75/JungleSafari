//applyCommonMiddleware.js
const express = require("express");
const cors = require("cors");
// const bodyParser = require("body-parser");

function applyCommonMiddleware(app) {
  app.use(cors());
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
}

module.exports = applyCommonMiddleware;
