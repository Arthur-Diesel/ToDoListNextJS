import { TaskStatus } from "@/models/taskStatus";
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

    try {
      const task = await tasksCollection.findOne({
        _id: new ObjectId(taskId),
        userId: id,
      });

      if(!task) {
        res.status(404).json({ message: "Task not found!" });
        return;
      }

      await tasksCollection.updateOne(
        { _id: new ObjectId(taskId), userId: id },
        {
          $set: {
            status: TaskStatus.DELETED,
            lastUpdatedDate: new Date(),
          },
        }
      );
      res.status(201).json({ message: "Task deleted!" });
    } catch (error) {
      console.log(`Error in /api/tasks/delete: ${error.message}`);
      res.status(400).json({ message: "Task deletion failed!" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed!" });
  }
}
