import { app } from "./app.js";
import { connectDB } from "./database/index.js";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const PORT = process.env.PORT || 8000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(`Mongo Db Error: ${error.message}`);
  });
