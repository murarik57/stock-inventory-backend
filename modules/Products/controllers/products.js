const mongoose = require("mongoose");
const Product = require("../../../models/Product");
const Company = require("../../../models/Company");

const productController = {
  getAllProduct: async (req, res) => {
    const loggedInUser = req.auth.user;
    const company = req?.query?.company;

    if (company && !mongoose.Types.ObjectId.isValid(company)) {
      return res
        .status(400)
        .json({ success: false, status: 400, message: "Invalid company ID" });
    }

    try {
      const options = {};
      if (loggedInUser?.role_id?.role_type === "MERCHANT")
        options.createdBy = loggedInUser._id;
      if (company) {
        options.company = company;
      }

      const products = await Product.find(options, {
        __v: 0,
        updatedAt: 0,
        createdBy: 0,
      }).populate([
        {
          path: "company",
          model: Company,
          select: "_id name",
        },
      ]);
      let response = {
        meta: {
          success: true,
          status: 200,
          message: "List products Success",
        },
        data: products,
      };
      res.json(response);
    } catch (error) {
      console.log("🔥🔥🔥🔥🔥🔥🔥🔥", error);
      res.status(500).json({ meta: error });
    }
  },
  getOneProduct: async (req, res) => {
    let id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, status: 400, message: "Invalid product ID" })
        .populate([
          {
            path: "company",
            model: Company,
            select: "_id name",
          },
        ]);
    }

    try {
      const product = await Product.findById(id, {
        __v: 0,
        updatedAt: 0,
        createdBy: 0,
      }).populate([
        {
          path: "company",
          model: Company,
          select: "_id name",
        },
      ]);

      if (!product)
        return res
          .status(400)
          .json({ success: false, status: 400, message: "product not found" });

      let response = {
        meta: {
          success: true,
          status: 200,
          message: "Get one product success",
        },
        data: product,
      };
      res.json(response);
    } catch (error) {
      console.log("🔥🔥🔥🔥🔥🔥🔥🔥", error);
      res.status(500).json({ meta: error });
    }
  },
  createOneProduct: async (req, res) => {
    const loggedInUser = req.auth.user;
    try {
      const { name, description, quantity, company } = req.body;
      if (!name || !quantity || !company) {
        return res.status(400).json({
          status: 400,
          message: "Missing required required",
          success: false,
        });
      }
      const newProduct = new Product({
        name,
        quantity,
        company,
        description,
        createdBy: loggedInUser._id,
      });

      await newProduct.save();

      let response = {
        meta: {
          success: true,
          status: 201,
          message: "Product Created",
        },
        data: {
          _id: newProduct.id,
        },
      };

      res.status(201).json(response);
    } catch (error) {
      console.log("🔥🔥🔥🔥🔥🔥🔥🔥", error);
      res.status(500).json({ meta: error });
    }
  },
  updateOneProduct: async (req, res) => {
    let id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, status: 400, message: "Invalid product ID" });
    }
    try {
      const { name, description, quantity } = req.body;

      const updatedProduct = await Product.findByIdAndUpdate(id, {
        name,
        description,
        quantity,
      });
      if (!updatedProduct)
        return res
          .status(404)
          .json({ success: false, status: 404, message: "Product not found" });
      res.status(200).json({
        success: true,
        status: 200,
        message: "Update product succeed",
        data: {
          _id: updatedProduct._id,
        },
      });
    } catch (error) {
      console.log("🔥🔥🔥🔥🔥🔥🔥🔥", error);
      res.status(500).json({ meta: error });
    }
  },
  deleteOneProduct: async (req, res) => {
    let id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, status: 400, message: "Invalid product ID" });
    }
    try {
      const deletedProduct = await Product.findByIdAndDelete(id);

      if (!deletedProduct) {
        return res
          .status(404)
          .json({ success: false, status: 404, message: "Product not found" });
      }

      res.status(200).json({
        message: "Product deleted successfully",
        success: true,
        status: 200,
        data: {
          _id: deletedProduct._id,
        },
      });
    } catch (error) {
      console.log("🔥🔥🔥🔥🔥🔥🔥🔥", error);
      res.status(500).json({ meta: error });
    }
  },
};

module.exports = productController;
