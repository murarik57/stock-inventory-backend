const helmet = require("helmet");
const express = require("express");
const app = express();
const cors = require("cors");
const validate = require("./utils/commonFunctions");

const router = express.Router();

const corsOption = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

//================ Middlewares =====================
app.use(helmet());
app.use(cors(corsOption));
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

//================== Routes =========================
const base_url = process.env.API_ENDPOINT;
let arr = [];
arr.push(base_url + "users*");
arr.push(base_url + "roles*");
arr.push(base_url + "products*");
arr.push(base_url + "companies*");

app.all(arr, [validate.validateToken]);

app.use(base_url, require("./routes/index")(router));
app.disable("x-powered-by");

module.exports = app;
