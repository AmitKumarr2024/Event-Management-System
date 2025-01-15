import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";

const jwtAuth = (req, res, next) => {
  const token = req.cookies?.token; // Assuming you're using cookies to store the JWT
  const id = req.params?.id; // ID from route params

  console.log("JWT Token:", token);
  console.log("ID:", id);

  if (!JWT_SECRET) {
    return res
      .status(500)
      .json({ error: "Missing SECRET_KEY environment variable" });
  }

  if (!token) {
    console.log("No token found in cookies");
    return res
      .status(401)
      .json({ message: "Please Login First and try again" });
  }

  try {
    // Verify the JWT token
    const decodedToken = jwt.verify(token, JWT_SECRET);

    // Attach userId to the request object
    req.userId = decodedToken?._id;

    // Optional: Check if `id` from route params matches the userId in the token
    if (id && id !== decodedToken._id) {
      return res.status(400).json({ msg: "Access Denied" });
    }

    // Pass control to the next middleware
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid Token" });
    } else {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

export default jwtAuth;
