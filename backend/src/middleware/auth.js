import jwt from "jsonwebtoken";

export default function auth(req, res, next) {
  const token = (req.headers.authorization || "").replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.user = data;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
