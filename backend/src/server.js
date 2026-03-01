const loadEnv = require("./config/env");
const connectDB = require("./config/db");
const app = require("./app");

loadEnv();

const startServer = async () => {
  try {
    console.log("Trying to connect MongoDB...");
    await connectDB();

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error(err);
  }
};

startServer();