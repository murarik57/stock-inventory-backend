const authController = require("./controllers/authController");

const validate = (req, res, next) => {
  if (req.body.email && req.body.password) {
    next();
  } else {
    res
      .status(200)
      .json({ meta: { success: false, status: 422, message: "Invalid Data" } });
  }
};
module.exports = (router) => {
  router.post("/auth/login", validate, authController.login);
};
