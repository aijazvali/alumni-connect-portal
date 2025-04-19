import jwt from "jsonwebtoken";

const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("inside auth middleware...");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized - No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("token is",decoded);
    req.user = decoded; // store the decoded info in req.user
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized - Invalid token" });
  }
};

export default requireAuth;
