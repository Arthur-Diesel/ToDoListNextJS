import cookie from "cookie";
import jwt from "jsonwebtoken";
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

    const { id } = jwt.verify(token, jwtSecret);

    if (!id) {
      res.status(401).json({ message: "Not authenticated!" });
      return;
    }

    try {
      const tasks = await tasksCollection
        .find({ userId: id })
        .sort({ creationDate: -1 })
        .toArray();

      res.status(201).json({ message: "Tasks fetched!", tasks });
    } catch (error) {
      console.log(`Error in /api/tasks: ${error.message}`);
      res.status(400).json({ message: "Task fetching failed!" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed!" });
  }
}
