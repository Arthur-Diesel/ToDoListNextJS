import { MongoClient, ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import cookie from "cookie";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export default async function handler(req, res) {
  if (req.method === "PUT") {
    await client.connect();
    const db = client.db(dbName);
    const usersCollection = db.collection("users");
    const adminCollection = db.collection("admins");

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

    const { id, isAdmin } = jwt.verify(token, process.env.JWT_SECRET);

    if (!id || !isAdmin) {
      res.status(401).json({ message: "Not authenticated!" });
      return;
    }

    const { userId } = req.body;

    if (!userId) {
      res.status(400).json({ message: "Missing data!" });
      return;
    }

    try {
      const user = await usersCollection.findOne({
        _id: new ObjectId(userId),
      });

      if (!user) {
        res.status(404).json({ message: "User not found!" });
        return;
      }

      const admin = await adminCollection.findOne({ userId });

      if (admin) {
        await adminCollection.deleteOne({ userId });
      } else {
        await adminCollection.insertOne({ userId });
      }

      res.status(200).json({ message: "User updated" });
    } catch (error) {
      console.log(`Error in /api/update-admin: ${error.message}`);
      res.status(400).json({ message: "User update failed!" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed!" });
  }
}
