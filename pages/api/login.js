import { MongoClient } from "mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookie from "cookie";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;
const jwtSecret = process.env.JWT_SECRET;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    await client.connect();
    const db = client.db(dbName);
    const usersCollection = db.collection("users");
    const adminCollection = db.collection("admins");

    const { email, password } = req.body;

    if (
      !email ||
      !email.includes("@") ||
      !password ||
      password.trim().length < 7
    ) {
      res.status(422).json({ message: "Invalid input!" });
      return;
    }

    const user = await usersCollection.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ message: "Invalid credentials!" });
      return;
    }

    const userIdString = user._id.toString();

    const userisAdmin = await adminCollection.findOne({
      userId: userIdString
    });

    const token = jwt.sign(
      { id: user._id, isAdmin: userisAdmin != null },
      jwtSecret,
      { expiresIn: "1h" }
    );

    res.setHeader(
      "Set-Cookie",
      cookie.serialize("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600, // 1 hour
        sameSite: "strict",
        path: "/",
      })
    );

    res.status(200).json({ message: "Logged in!" });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
