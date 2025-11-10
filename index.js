const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 3000;

//middlewere
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("server is running");
});
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.i4vqwd8.mongodb.net/?appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const db = client.db("IssueReportingPortal");
    const usersCollection = db.collection("users");
    const issueCollection = db.collection("issues");
    const contributionCollection = db.collection("contribution");

    app.post("/user", async (req, res) => {
      const newUser = req.body;
      const result = await usersCollection.insertOne(newUser);
      res.send(result);
    });
    app.get("/issues", async (req, res) => {
      const cursor = issueCollection.find().sort({ date: -1 }).limit(6);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/allIssues", async (req, res) => {
      const email = req.query.email;
      const query = {};
      if (email) {
        query.email = email;
      }
      const cursor = issueCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/allIssues/:id", async (req, res) => {
      const id = req.params.id;

      // const query = { _id: new ObjectId(id) };
      const query = { _id: id };
      // console.log(query);
      const result = await issueCollection.findOne(query);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
