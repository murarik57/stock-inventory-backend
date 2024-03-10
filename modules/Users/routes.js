const user = require("./controllers/users");
const validate = (req, res, next) => {
  if (!req.auth) {
    res.json({
      success: false,
      status: 401,
      message: "Unauthenticated route",
    });
  } else {
    next();
  }
};
module.exports = (router) => {
  router.get("/users", user.getAllUsers);
  router.post("/users", user.createUser);
  router.get("/users/getCurrentUser", validate, user.getCurrentUser);
};
