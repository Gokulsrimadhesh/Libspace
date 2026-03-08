import { DataTypes } from "sequelize";
import { sequelize } from "../Config/db.js";

const BlackList = sequelize.define(
  "BlackList",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "blacklisted_tokens",
    timestamps: true,
    versionKey: false,
  }
);

export default BlackList;
