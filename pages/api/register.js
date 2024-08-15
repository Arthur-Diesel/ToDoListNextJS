import { MongoClient } from "mongodb";
import bcrypt from "bcrypt";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    await client.connect();
    const db = client.db(dbName);
    const usersCollection = db.collection("users");

    const { name, email, password } = req.body;

    if (
      !email ||
      !email.includes("@") ||
      !password ||
      password.trim().length < 7
    ) {
      res.status(422).json({ message: "Invalid input!" });
      return;
    }

    try {
      const existingUser = await usersCollection.findOne({ email });
      if (existingUser) {
        res.status(422).json({ message: "User exists already!" });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await usersCollection.insertOne({
        name,
        email,
        password: hashedPassword,
        creationDate: new Date(),
        lastUpdatedDate: new Date(),
      });
      res.status(201).json({ message: "User created!" });
    } catch (error) {
      console.log(`Error in /api/register: ${error.message}`);
      res.status(400).json({ message: "User registration failed!" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed!" });
  }
}
