const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role_id: { type: Schema.Types.ObjectId, ref: "roles" },
  createdAt: {
    type: Date,
    default: dayjs.utc().format(),
  },
  updatedAt: {
    type: Date,
    default: dayjs.utc().format(),
  },
});

module.exports = User = mongoose.model("user", UserSchema);
