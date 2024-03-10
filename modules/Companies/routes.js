const company = require("./controllers/companies");

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
  router.get("/companies", validate, company.getAllCompanies);
  router.get("/companies/:id", company.getOneCompany);
  router.post("/companies", company.createOneCompany);
};
