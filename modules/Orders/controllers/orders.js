const mongoose = require("mongoose");
const Order = require("../../../models/Order");
const Product = require("../../../models/Product");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

const orderController = {
  getAllOrders: async (req, res) => {
    const loggedInUser = req.auth.user;
    try {
      const options = {};
      if (loggedInUser?.role_id?.role_type === "MERCHANT")
        options.createdBy = loggedInUser._id;

      const companies = await Order.find(options, { __v: 0 }).sort({
        createdAt: -1,
      });
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
  getOneOrders: async (req, res) => {
    let id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, status: 400, message: "Invalid order ID" });
    }

    try {
      const order = await Order.findById(id, {
        __v: 0,
      });

      if (!order)
        return res
          .status(400)
          .json({ success: false, status: 400, message: "order not found" });

      let response = {
        meta: {
          success: true,
          status: 200,
          message: "Get one order success",
        },
        data: order,
      };
      res.status(200).json(response);
    } catch (error) {
      console.log("🔥🔥🔥🔥🔥🔥🔥🔥", error);
      res.status(500).json({ meta: error });
    }
  },
  createOneOrders: async (req, res) => {
    const loggedInUser = req.auth?.user;
    try {
      const companyName = req.body.companyName;
      const products = JSON.parse(req.body.products);

      let errorMessage;
      if (!companyName) errorMessage = "Company name is required";
      if (!products?.length) errorMessage = "Please add atleast one product";

      const invoice = req.file
        ? {
            fileName: req.file.originalname,
            mimeType: req.file.mimetype,
            size: req.file.size,
            path: `${process.env.BACKEND_BASE_URL}/${req.file.path}`,
          }
        : undefined;

      if (Array.isArray(products)) {
        for (const product of products) {
          await Product.findByIdAndUpdate(product._id, {
            $inc: { quantity: -product.quantity },
          });
        }
      }

      if (errorMessage) {
        return res.status(400).json({
          status: 400,
          message: errorMessage,
          success: false,
        });
      }

      const newOrder = new Order({
        companyName,
        products,
        invoice,
        createdBy: loggedInUser._id,
      });

      await newOrder.save();

      let response = {
        meta: {
          success: true,
          status: 201,
          message: "Order Created",
        },
        data: {
          _id: newOrder.id,
        },
      };

      res.status(201).json(response);
    } catch (error) {
      console.log("🔥🔥🔥🔥🔥🔥🔥🔥", error);
      res.status(500).json({ meta: error });
    }
  },
  uploadInvoice: async (req, res) => {
    let id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, status: 400, message: "Invalid order ID" });
    }

    try {
      const order = await Order.findById(id, {
        __v: 0,
      });

      if (!order)
        return res
          .status(400)
          .json({ success: false, status: 400, message: "order not found" });

      if (!req.file)
        return res.status(400).json({
          status: 400,
          message: "Please upload a file",
          success: false,
        });

      const invoice = {
        fileName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        path: `${process.env.BACKEND_BASE_URL}/${req.file.path}`,
      };

      await Order.findByIdAndUpdate(id, {
        invoice,
        updatedAt: dayjs.utc().toDate(),
      });

      let response = {
        meta: {
          success: true,
          status: 200,
          message: "Invoice Uploaded",
        },
        data: {
          _id: id,
        },
      };

      res.status(200).json(response);
    } catch (error) {
      console.log("🔥🔥🔥🔥🔥🔥🔥🔥", error);
      res.status(500).json({ meta: error });
    }
  },
};

module.exports = orderController;
