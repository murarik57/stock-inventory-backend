module.exports = function (router) {
  const { globSync } = require("glob");

  const files = globSync("./modules/**/routes.js");
  files.forEach(function (file) {
    require("../" + file)(router);
  });

  return router;
};
