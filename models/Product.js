const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
    default: () => new Date(),
  },
  updatedAt: {
    type: Date,
    default: () => new Date(),
  },
});

module.exports = Product = mongoose.model("product", ProductSchema);
