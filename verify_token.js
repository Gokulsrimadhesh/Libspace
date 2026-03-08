import jwt from "jsonwebtoken";
import BlackList from "../models/blackListerToken.js";

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).send({ msg: "No token provided" });
  }
  
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).send({ msg: "Invalid token format. Use: Bearer <token>" });
  }
  
  let token = parts[1];
  let findBlock = await BlackList.findOne({ where: { token: token } });
  if (findBlock) {
    return res.status(200).send({ msg: "You are already logout" });
  }
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .send({ msg: "You're not authenticated person", Error: err.message });
    }

    console.log(decoded);
    req.user = decoded;
    next();
  });
};
