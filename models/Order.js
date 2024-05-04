const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, ref: "Product" },
  name: String,
  quantity: Number,
});
const InvoiceSchema = new Schema({
  fileName: String,
  mimeType: String,
  path: String,
  size: Number,
});

const OrderSchema = new Schema({
  companyName: {
    type: String,
    required: true,
  },
  createdBy: { type: Schema.Types.ObjectId, ref: "users" },
  products: [ProductSchema],
  invoice: {
    type: InvoiceSchema,
    required: false,
    default: null,
  },
  createdAt: {
    type: Date,
    default: new Date().toISOString(),
  },
});

module.exports = Order = mongoose.model("order", OrderSchema);
