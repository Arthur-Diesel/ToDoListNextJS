import jwt from "jsonwebtoken";
import cookie from "cookie";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;
const jwtSecret = process.env.JWT_SECRET;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export default async function handler(req, res) {
  if (req.method === "GET") {
    await client.connect();
    const db = client.db(dbName);
    const usersCollection = db.collection("users");
    const adminsCollection = db.collection("admins");

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

    if (!id || !isAdmin) {
      res.status(401).json({ message: "Not authenticated!" });
      return;
    }

    try {
      const users = await usersCollection
        .find({})
        .sort({ creationDate: -1 })
        .toArray();
      const admins = await adminsCollection
        .find({})
        .sort({ creationDate: -1 })
        .toArray();

      const usersFormatted = users.map((user) => {
        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          creationDate: user.creationDate,
          lastUpdatedDate: user.lastUpdatedDate,
          isAdmin: admins.some((admin) => admin.userId === user._id.toString()),
        };
      });

      res.status(200).json({ message: "Users fetched!", users: usersFormatted });
    } catch (error) {
      console.log(`Error in /api/admin/users: ${error.message}`);
      res.status(400).json({ message: "Users fetching failed!" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed!" });
  }
}
