const User = require("../models/User");

const basicAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Basic ")) {
      return res
        .status(401)
        .json({ status: "error", message: "No credentials provided" });
    }

    const base64 = authHeader.split(" ")[1];
    const decoded = Buffer.from(base64, "base64").toString("utf-8");
    const [login, password] = decoded.split(":").map((str) => str.trim());

    const user = await User.findOne({ where: { login, password } });

    if (!user) {
      return res
        .status(401)
        .json({ status: "error", message: "Invalid credentials" });
    }

    next();
  } catch (error) {
    res.status(500).json({ status: "error", message: "Auth error" });
  }
};

module.exports = basicAuth;
