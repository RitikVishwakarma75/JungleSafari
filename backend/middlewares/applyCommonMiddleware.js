const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

function applyCommonMiddleware(app) {
  app.use(cors());
  app.use(express.json());
  app.use(bodyParser.urlencoded({ extended: true }));
}

module.exports = applyCommonMiddleware;
