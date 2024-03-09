const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const dayjs = require("dayjs");

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

module.exports = Company = mongooose.model("company", CompanySchema);
