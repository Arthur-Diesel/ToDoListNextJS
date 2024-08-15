import jwt from "jsonwebtoken";
import cookie from "cookie";

const jwtSecret = process.env.JWT_SECRET;

export default async function handler(req, res) {
  if (req.method === "POST") {
    const cookies = cookie.parse(req.headers.cookie || "");

    if (!cookies) {
      res.status(401).json({ message: "Not authenticated!" });
      return;
    }

    const token = cookies.token;

    if (!token) {
      res.status(401).json({ message: "Not authenticated!" });
      return;
    }

    const { id, isAdmin } = jwt.verify(token, jwtSecret);

    if (!id) {
      res.status(401).json({ message: "Not authenticated!" });
      return;
    }

    res.status(200).json({ message: "Authenticated!", isAdmin });
    return;
  }
}
