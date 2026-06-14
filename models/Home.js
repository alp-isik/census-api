const { DataTypes } = require("sequelize");
const sequelize = require("./database");
const Participant = require("./Participant");

const Home = sequelize.define("Home", {
  country: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Home.belongsTo(Participant, { foreignKey: "email", onDelete: "CASCADE" });
Participant.hasOne(Home, { foreignKey: "email" });

module.exports = Home;
