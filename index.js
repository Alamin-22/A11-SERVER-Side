const express = require('express')
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
// const jwt = require('jsonwebtoken');
// const cookieParser = require('cookie-parser')
const port = process.env.PORT || 5000;


// middleware
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:5174', 'http://localhost:5173'],
    credentials: true
}));


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4hda1bm.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const JobsCollections = client.db("JobBoardDB").collection("jobsPost");
        const AppliedCollection = client.db("JobBoardDB").collection("AppliedCollection")

        app.get("/api/v1/jobsdata", async (req, res) => {
            const cursor = JobsCollections.find();
            const result = await cursor.toArray();
            res.send(result);
        })
        // get specific Id data
        app.get(`/api/v1/jobsdata/:id`, async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await JobsCollections.findOne(query);
            res.send(result);
        })


        // applied jobs related Api

        app.post("/api/v1/applied", async (req, res) => {
            const applied = req.body;
            console.log(applied);
            const result = await AppliedCollection.insertOne(applied);
            res.send(result);
        })

        app.get("/api/v1/applied", async (req, res) => {
            const cursor = AppliedCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        // get specific Id data
        app.get(`/api/v1/applied/:id`, async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await AppliedCollection.findOne(query);
            res.send(result);
        })




        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);









app.get("/", (req, res) => {
    res.send("JobBoard server  is Running");
})

app.listen(port, () => {
    console.log(`JObBoard Server is Running on Port ${port}`)
})