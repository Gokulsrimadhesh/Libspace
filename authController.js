import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import BlackList from "../models/blackListerToken.js";

const userController = {
  registerUser: async (req, res) => {
    const { name, email, password } = req.body;
    try {
      if (!name || !email || !password) {
        return res.json({
          success: false,
          message: "All details are required...",
        });
      }

      const checkExists = await User.findOne({ where: { email: email } });
      console.log(checkExists);
      if (checkExists) {
        return res.json({
          success: false,
          message: "Account already exists, please login",
        });
      }
      const hashPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        name,
        email,
        password: hashPassword,
      });

      return res.json({
        success: true,
        message: "User registered successfully!",
      });
    } catch (error) {
      return res.json({
        success: false,
        error: error.message,
      });
    }
  },
  loginUser: async (req, res) => {
    const { email, password } = req.body;

    console.log("Email", email, "Password", password);
    try {
      if (!email || !password) {
        return res.json({
          success: false,
          message: "All fields are required.",
        });
      }
      const checkExists = await User.findOne({ where: { email: email } });
      console.log(checkExists);
      if (!checkExists) {
        return res.json({
          success: false,
          message: "Account doesn't exists.",
        });
      }

      const result = await bcrypt.compare(password, checkExists.password);
      console.log(result);
      if (result) {
        const token = jwt.sign(
          { id: checkExists.id, email: checkExists.email },
          process.env.SECRET_KEY,
          {
            expiresIn: "1h",
          },
        );
        return res.status(200).send({
          msg: "Logged In Successfully",
          token: token,
          user: checkExists,
        });
      } else {
        return res.status(404).send({ err: "Invalid password" });
      }
    } catch (error) {
      return res.status(400).send({ error: error.message });
    }
  },
  deleteUser: async (req, res) => {
    try {
      const { userId } = req.params;
      let findUser = await User.findByPk(userId);

      if (!findUser) {
        return res.status(404).send({ msg: "user not found" });
      }

      await User.destroy({ where: { id: userId } });
      res.status(200).send({ msg: "User deleted successfully" });
    } catch (error) {
      res.status(403).json({
        status: false,
        message: error.message,
      });
    }
  },
  logoutUser: async (req, res) => {
    let token = req.headers.authorization.split(" ")[1];
    let blackList = await BlackList.findOne({ where: { token: token } });
    if (blackList) {
      return res
        .status(401)
        .send({ msg: "User has already logged out, please login" });
    } else {
      res.status(200).send({ msg: "User has logged out successfully" });
      let blackListedToken = await BlackList.create({
        token: token,
      });
    }
  },
};

export default userController;
