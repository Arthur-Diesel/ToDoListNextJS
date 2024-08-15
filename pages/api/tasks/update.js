import cookie from "cookie";
import jwt from "jsonwebtoken";
import { MongoClient, ObjectId } from "mongodb";

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

    const { id } = jwt.verify(token, process.env.JWT_SECRET);

    if (!id) {
      res.status(401).json({ message: "Not authenticated!" });
      return;
    }

    const { taskId } = req.query;

    const { task } = req.body;

    if (!task) {
      res.status(400).json({ message: "Task is required!" });
      return;
    }

    try {
      const taskFound = await tasksCollection.findOne({
        _id: new ObjectId(taskId),
        userId: id,
      });

      if (!taskFound) {
        res.status(404).json({ message: "Task not found!" });
        return;
      }

      await tasksCollection.updateOne(
        { _id: new ObjectId(taskId), userId: id },
        {
          $set: {
            task,
            lastUpdatedDate: new Date(),
          },
        }
      );

      res.status(200).json({ message: "Task updated!" });
    } catch (error) {
      res.status(500).json({ message: "Error updating task!" });
    }
  }
}
