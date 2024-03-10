const products = require("./controllers/products");

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
  router.get("/products", validate, products.getAllProduct);
  router.get("/products/:id", products.getOneProduct);
  router.post("/products", products.createOneProduct);
  router.put("/products/:id", products.updateOneProduct);
  router.delete("/products/:id", products.deleteOneProduct);
};
