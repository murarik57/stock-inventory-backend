const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

const CompanySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  createdBy: { type: Schema.Types.ObjectId, ref: "users" },
  createdAt: {
    type: Date,
    default: dayjs.utc().format(),
  },
  updatedAt: {
    type: Date,
    default: dayjs.utc().format(),
  },
});

module.exports = Company = mongoose.model("company", CompanySchema);
