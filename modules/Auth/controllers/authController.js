const User = require("../../../models/User");
const Role = require("../../../models/Role");
const common = require("../../../utils/commonFunctions");
const { createLocalToken } = require("../actions/tokenGenerate");

const authController = {
  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email }).populate([
        {
          path: "role_id",
          model: Role,
          select: "_id role_type name",
        },
      ]);

      if (!user) {
        return res.status(400).json({ message: "Email not found" });
      }
      const isMatch = await common.isValidPassword(password, user);

      if (!isMatch) {
        return res.status(400).json({ message: "Incorrect Password" });
      }

      let token = createLocalToken(user);

      res.status(200).json({
        status: 200,
        success: true,
        token: token,
      });
    } catch (err) {
      console.log("👌👌👌👌👌👌👌👌👌👌👌👌", err);
      res.status(500).json({ message: err?.message });
    }
  },
};

module.exports = authController;
