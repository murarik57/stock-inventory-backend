const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
  },
  active: {
    type: Boolean,
    default: true,
    required: false,
  },
  status: {
    type: Boolean,
    default: true,
    required: false,
  },
  createdBy: { type: Schema.Types.ObjectId, ref: "users" },
  createdAt: {
    type: Date,
    default: dayjs.utc().format(),
    index: true,
  },
  updatedAt: {
    type: Date,
    default: dayjs.utc().format(),
  },
});

module.exports = Product = mongoose.model("product", ProductSchema);
