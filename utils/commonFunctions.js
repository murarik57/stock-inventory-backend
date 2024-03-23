const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const common = {
  validateToken: function (req, res, next) {
    let token = req.headers["x-access-token"] || req.headers["authorization"];
    if (typeof token === "undefined") {
      console.log("No authorization header");
      res.status(401).json({
        status: 5000,
        message: "No Token",
      });
    } else {
      const bearer = token.split(" ");
      token = bearer[1];
      if (token) {
        return new Promise((resolve, reject) => {
          jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
            if (err) {
              res.status(401).json({
                status: 5000,
                success: false,
                message: err?.message ?? "Invalid token",
              });
            } else {
              req.auth = Object.assign({}, req.auth, decode);
              resolve(req);
              next();
            }
          });
        });
      } else {
        res.status(401).json({
          status: 5000,
          success: false,
          message: "Token Error",
        });
      }
    }
  },
  encryptPass: function (password) {
    // this will auto-gen a salt bcrypt.hash(password,size of hash, function)
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, 10, function (err, hashpassword) {
        if (hashpassword) {
          resolve(hashpassword);
        } else {
          reject({
            success: false,
            status: 500,
            message: "Error in processing Query",
          });
        }
      });
    });
  },
  isValidPassword: function (password, user) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          reject({
            error: err,
            success: false,
            status: 500,
            message: "Error in processing Query",
          });
        } else {
          if (!result) {
            reject({
              error: err,
              status: 401,
              success: false,
              message: "Password does not match",
            });
          } else {
            resolve({
              status: 200,
              success: true,
              message: "Logged In Successfully",
            });
          }
        }
      });
    });
  },
  decode: function (req, res) {
    let token = req.headers["x-access-token"] || req.headers["authorization"];
    if (typeof token !== "undefined") {
      const bearer = token.split(" ");
      token = bearer[1];
    }
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
        if (err) {
          reject({
            status: 401,
            success: false,
            message: "Invalid token",
          });
        } else {
          resolve(decode);
        }
      });
    });
  },
};

module.exports = common;
