import { DataTypes } from "sequelize";
import { sequelize } from "../Config/db.js";
import User from "./user.model.js";

const Book = sequelize.define(
  "Book",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    tableName: "books",
    timestamps: true,
    versionKey: false,
  }
);

// Define association
User.hasMany(Book, { foreignKey: "userId", as: "books" });
Book.belongsTo(User, { foreignKey: "userId", as: "user" });

export default Book;
