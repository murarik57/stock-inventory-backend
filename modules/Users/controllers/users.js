const User = require("../../../models/User");
const Role = require("../../../models/Role");
const Company = require("../../../models/Company");
const Product = require("../../../models/Product");
const common = require("../../../utils/commonFunctions");

const userController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find({}, { password: 0 }).populate([
        {
          path: "role_id",
          model: Role,
          select: "_id role_type name",
        },
      ]);
      let response = {
        meta: {
          success: true,
          status: 200,
          message: "List User Success",
        },
        data: users,
      };
      res.json(response);
    } catch (err) {
      console.log("🔥🔥🔥🔥🔥🔥🔥🔥", err);
      res.status(500).json({ meta: err });
    }
  },
  createUser: async (req, res, next) => {
    const { name, email, password, role_id } = req.body;
    if (!name || !email || !password || !role_id) {
      return res.status(400).json({
        status: 400,
        message: "All fields are required",
        success: false,
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    try {
      const roleExists = await Role.findById(role_id);
      if (!roleExists) {
        return res.status(400).json({ message: "Invalid role Id" });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "Email is already registered",
        });
      }

      if (password.length < 4) {
        return res
          .status(400)
          .json({ message: "Password should be at least 6 characters long" });
      }
      const hashedpassword = await common.encryptPass(password);
      const user = new User({
        name,
        email,
        password: hashedpassword,
        role_id,
      });

      await user.save();

      let response = {
        meta: {
          success: true,
          status: 200,
          message: "User Created",
        },
        data: {
          _id: user.id,
        },
      };

      res.status(201).json(response);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
  getCurrentUser: async (req, res) => {
    let id = req.auth.user._id;

    try {
      const user = await User.findById(id, {
        password: 0,
        __v: 0,
        updatedAt: 0,
        createdAt: 0,
      }).populate([
        {
          path: "role_id",
          model: Role,
          select: "_id role_type name",
        },
      ]);
      if (user == null) {
        return res
          .status(404)
          .json({ success: false, status: 404, message: "User not found" });
      }

      const options = {};
      if (req.auth.user?.role_id?.role_type === "MERCHANT")
        options.createdBy = id;

      const companiesCount = await Company.countDocuments(options);
      const productsCount = await Product.countDocuments(options);

      let response = {
        meta: {
          success: true,
          status: 200,
          message: "User Profile Success",
        },
        data: {
          user,
          companiesCount,
          productsCount,
        },
      };

      res.json(response);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};

module.exports = userController;
