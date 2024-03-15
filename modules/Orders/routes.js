const order = require("./controllers/orders");
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 8, // 8 MB
  },
  fileFilter: (req, file, cb) => {
    const extname = path.extname(file.originalname).toLowerCase();

    if ([".jpeg", ".jpg", ".png", ".pdf"].includes(extname)) {
      cb(null, true);
    } else {
      cb(new Error("File type not supported"));
    }
  },
});
const handleMulterError = (err, req, res, next) => {
  if (err) {
    res.status(500).json({ success: false, status: 500, message: err.message });
  } else {
    next();
  }
};

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
  router.get("/orders", validate, order.getAllOrders);
  router.get("/orders/:id", order.getOneOrders);
  router.post(
    "/orders",
    upload.single("invoice"),
    handleMulterError,
    order.createOneOrders
  );
};
