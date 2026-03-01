const dotenv = require("dotenv");

const loadEnv = () => {
  dotenv.config();
  const required = ["MONGO_URI", "JWT_SECRET"];
  required.forEach((key) => {
    if (!process.env[key]) {
      console.error(`Missing env variable: ${key}`);
      process.exit(1);
    }
  });
};

module.exports = loadEnv;