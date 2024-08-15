import jwt from "jsonwebtoken";
import cookie from "cookie";
import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;
const jwtSecret = process.env.JWT_SECRET;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { userId } = req.query;
    await client.connect();
    const db = client.db(dbName);
    const usersCollection = db.collection("users");
    const tasksCollection = db.collection("tasks");

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
      const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
      if (!user) {
        res.status(404).json({ message: "User not found!" });
        return;
      }

      const tasks = await tasksCollection
        .find({ userId: userId })
        .sort({ creationDate: -1 })
        .toArray();

      res.status(200).json({ message: "Tasks fetched successfully!", tasks });
    } catch (error) {
      console.log(`Error in /api/admin/users/[userId]: ${error.message}`);
      res.status(400).json({ message: "Tasks fetching failed!" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed!" });
  }
}
