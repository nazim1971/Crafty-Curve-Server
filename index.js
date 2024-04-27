const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000;


// middlewire

app.use (cors({origin:["http://localhost:5173"]}))
app.use(express.json())


// mongoDB



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uwjhzip.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();

    const carftySixDB = client.db("craftDB").collection('craftItemDB');

    // craftItems
    app.get('/craftItems',async(req,res)=>{
        const result = await carftySixDB.find().toArray()
        res.send(result)
    })
    // get single craftItem data in another page
    app.get('/craftItems/:id', async(req,res)=>{
        const id = req.params.id
        const qurey = {_id : new ObjectId(id)};
        const result = await carftySixDB.findOne(qurey);
        res.send(result)
    })


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req,res)=>{
    res.send('My server is running now')
})



app.listen(port, ()=>{
    console.log(`my server is running on port: ${port}`);
})