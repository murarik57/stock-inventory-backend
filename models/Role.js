const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

const RoleSchema = new Schema({
  name: {
    type: String,
  },
  role_type: {
    type: String,
  },
  active: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: dayjs.utc().format(),
  },
  updatedAt: {
    type: Date,
    default: dayjs.utc().format(),
  },
});

module.exports = Role = mongoose.model("role", RoleSchema);
