const Role = require("../models/Role");
const defaultRoles = require("../modules/Roles/defaultRoles")();

module.exports = async () => {
  const roles = await Role.find({}).countDocuments();

  if (!roles) {
    defaultRoles?.map(async (role) => {
      await Role.create(role);
    });
  }
};
