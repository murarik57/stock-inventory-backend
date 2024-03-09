const helmet = require("helmet");
const express = require("express");
const app = express();
const cors = require("cors");

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

module.exports = app;
