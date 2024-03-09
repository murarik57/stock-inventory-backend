require("dotenv").config({ path: "./.env" });

const http = require("http");
const app = require("./app");
const server = http.createServer(app);
const connectDB = require("./config/db");

const PORT = process.env.PORT || 8000;

connectDB();
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

process.on("SIGINT", function () {
  server.close();
  process.exit();
});
