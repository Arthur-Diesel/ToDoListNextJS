import { TaskStatus } from "@/models/taskStatus";
import { MongoClient } from "mongodb";
import cookie from "cookie";
import jwt from "jsonwebtoken";

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

    const { task } = req.body;

    if (!task || task.trim().length < 3) {
      res.status(422).json({ message: "Invalid input!" });
      return;
    }

    try {
      await tasksCollection.insertOne({
        userId: id,
        task,
        creationDate: new Date(),
        lastUpdatedDate: new Date(),
        status: TaskStatus.IN_PROGRESS,
      });

      res.status(201).json({ message: "Task created!" });
    } catch (error) {
      console.log(`Error in /api/tasks/create: ${error.message}`);
      res.status(400).json({ message: "Task creation failed!" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed!" });
  }
}
