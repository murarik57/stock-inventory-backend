const mongoose = require("mongoose");
const Company = require("../../../models/Company");

const companyController = {
  getAllCompanies: async (req, res) => {
    const loggedInUser = req.auth.user;
    try {
      const options = {};
      if (loggedInUser?.role_id?.role_type === "MERCHANT")
        options.createdBy = loggedInUser._id;

      const companies = await Company.find(options, { __v: 0, updatedAt: 0 });
      let response = {
        meta: {
          success: true,
          status: 200,
          message: "List companies Success",
        },
        data: companies,
      };
      res.json(response);
    } catch (error) {
      console.log("🔥🔥🔥🔥🔥🔥🔥🔥", error);
      res.status(500).json({ meta: error });
    }
  },
  getOneCompany: async (req, res) => {
    let id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, status: 400, message: "Invalid company ID" });
    }

    try {
      const company = await Company.findById(id, { __v: 0, updatedAt: 0 });

      if (!company)
        return res
          .status(400)
          .json({ success: false, status: 400, message: "company not found" });

      let response = {
        meta: {
          success: true,
          status: 201,
          message: "Get one company success",
        },
        data: company,
      };
      res.status(201).json(response);
    } catch (error) {
      console.log("🔥🔥🔥🔥🔥🔥🔥🔥", error);
      res.status(500).json({ meta: error });
    }
  },
  createOneCompany: async (req, res) => {
    const loggedInUser = req.auth.user;
    try {
      const { name } = req.body;
      if (!name) {
        return res
          .status(400)
          .json({ status: 400, message: "Name is required", success: false });
      }
      const company = new Company({
        name,
        createdBy: loggedInUser._id,
      });

      await company.save();

      let response = {
        meta: {
          success: true,
          status: 200,
          message: "Company Created",
        },
        data: {
          _id: company.id,
        },
      };

      res.status(201).json(response);
    } catch (error) {
      console.log("🔥🔥🔥🔥🔥🔥🔥🔥", error);
      res.status(500).json({ meta: error });
    }
  },
};

module.exports = companyController;
