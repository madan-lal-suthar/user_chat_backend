import express from "express";
import "dotenv/config";
import config from "./config/config.ts";
import sequelize from "./database/database.ts"
import routes from "./routes/routes.ts"
await sequelize.sync();
import Chat from "./models/chat/chat.model.ts";
(async function () {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully!");
  } catch (error) {
    console.error("Unable to connect to database:", error);
  }
})();
console.log("PostgreSQL connected successfully!");
// console.log(config)
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", routes)
console.log("===>>>",process.env.SERVER_PORT)
app.listen(process.env.SERVER_PORT, () => {
  console.log("Server running on port 8001");
})