const jwt = require("jsonwebtoken");

module.exports = {
  createLocalToken: function (data) {
    let user = {};
    user._id = data._id ? data._id : null;
    user.email = data.email ? data.email : null;
    user.role_id = data.role_id ? data.role_id : null;
    user.name = data.name ? data.name : null;

    return jwt.sign(
      {
        user,
      },
      process.env.JWT_SECRET,
      { expiresIn: "14 days" }
    );
  },
};
