//contact.js
const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  phone: String,
});

module.exports = mongoose.model("Contact", contactSchema);
