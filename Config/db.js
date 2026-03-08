import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
  logging: false,
});

const connectDb = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to SQLite database");

    // Sync models - force: true will drop and recreate tables
    await sequelize.sync({ force: true });
    console.log("Database synchronized");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export default connectDb;
export { sequelize };
