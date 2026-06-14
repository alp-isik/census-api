const express = require("express");
const sequelize = require("./models/database");
const participantRoutes = require("./routes/participants");
require("dotenv").config();

const app = express();
app.use(express.json());

app.use("/participants", participantRoutes);

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected!");
    await sequelize.sync();
    console.log("Tables synced!");

    // Seed admin user
    const User = require("./models/User");
    const existingAdmin = await User.findOne({ where: { login: "admin" } });
    if (!existingAdmin) {
      await User.create({ login: "admin", password: "P4ssword" });
      console.log("Admin user created!");
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start:", error);
  }
};

start();
