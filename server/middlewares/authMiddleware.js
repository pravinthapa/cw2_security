import jwt from "jsonwebtoken";

export const protect = (requiredRoles = []) => (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  
  // Validate Bearer token format
  if (!authHeader.startsWith("Bearer ")) {
    console.warn("Invalid or missing Authorization header:", authHeader);
    return res.status(401).json({ message: "Not authenticated" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Add small clock tolerance to avoid time sync issues
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      clockTolerance: 5, // seconds
    });

    // Role-based access check
    if (requiredRoles.length && !requiredRoles.includes(decoded.role)) {
      console.warn("Access denied for role:", decoded.role);
      return res.status(403).json({ message: "Access denied" });
    }

    // Attach decoded user info to request
    req.user = decoded; // e.g., { userId, role, iat, exp }
    return next();
  } catch (err) {
    console.error("JWT verification error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
