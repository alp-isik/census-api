const { DataTypes } = require("sequelize");
const sequelize = require("./database");
const Participant = require("./Participant");

const Work = sequelize.define("Work", {
  companyname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  salary: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Work.belongsTo(Participant, { foreignKey: "email", onDelete: "CASCADE" });
Participant.hasOne(Work, { foreignKey: "email" });

module.exports = Work;
