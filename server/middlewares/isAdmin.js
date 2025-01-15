// This middleware ensures only admin users can access certain routes
const isAdmin = (req, res, next) => {
  // Check if the user role is ADMIN
  if (req.userRole !== "ADMIN") {
    // If not an admin, deny access with a 403 status
    return res
      .status(403)
      .json({ message: "Access Denied: You are not an admin." });
  }
  // If admin, pass the request to the next middleware or route handler
  next();
};

export default isAdmin;
