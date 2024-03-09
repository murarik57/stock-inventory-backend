const mongoose = require("mongoose");
const initiateDb = require("./initiateDb");

const connectDB = async () => {
  try {
    const db_host = process.env.DATABASE_HOST;
    const db_port = process.env.DATABASE_PORT;
    const db_name = process.env.DATABASE_NAME;
    const db_user = process.env.DATABASE_USER;
    const db_password = process.env.DATABASE_PASSWORD;

    let db_auth = db_user && db_password ? `${db_user}:${db_password}@` : "";
    let uri = `mongodb://${db_auth}${db_host}:${db_port}/${db_name}`;

    await mongoose.connect(uri);
    console.log("MongoDB connected:", uri);
  } catch (err) {
    console.error("DB connection error", err.message);
    process.exit(1);
  }
};
const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", async () => {
  await initiateDb();
});

module.exports = connectDB;
