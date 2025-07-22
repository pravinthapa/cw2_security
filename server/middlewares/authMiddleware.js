import jwt from "jsonwebtoken";

export const protect = (requiredRoles = []) => (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) return res.status(401).json({ message: "Not authenticated" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (requiredRoles.length && !requiredRoles.includes(decoded.role))
      return res.status(403).json({ message: "Access denied" });

    req.user = decoded; // { userId, role, iat, exp }
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid/expired token" });
  }
};
