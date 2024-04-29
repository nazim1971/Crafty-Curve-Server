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

    // fixed 6 item collection
    const craftySixDB = client.db("craftDB").collection('craftItemDB');
    // own added item collection
    const ownAddedItemDb = client.db('craftDB').collection('ownAddedItemDB')
    // all category collection
    const allCategoryDb = client.db('craftDB').collection('subCategoryDB')

    // craftItems
    app.get('/craftItems',async(req,res)=>{
        const result = await craftySixDB.find().toArray()
        res.send(result)
    })

    // get single craftItem data in another page
    app.get('/craftItems/:id', async(req,res)=>{
        const id = req.params.id
        const qurey = {_id : new ObjectId(id)};
        const result = await craftySixDB.findOne(qurey);
        res.send(result)
    })

    // get my own added item in ui
    app.get('/myItem/:email',async(req,res)=>{
      const result = await ownAddedItemDb.find({email: req.params.email}).toArray()
      res.send(result)
  })

  

  // get data based on subCategory
  app.get('/subCategory/:subcategoryName',async(req,res)=>{
    const result = await allCategoryDb.find({subcategoryName: req.params.subcategoryName}).toArray()
    res.send(result)
})


app.get('/subCategory',async(req,res)=>{
  const result = await allCategoryDb.find().toArray()
  res.send(result)
})

// get single item data in another page
app.get('/subCat/:id', async(req,res)=>{
  const id = req.params.id
  const qurey = {_id : new ObjectId(id)};
  const result = await allCategoryDb.findOne(qurey);
  res.send(result)
})


    
    // my added item
    app.post('/ownItem',async(req,res)=>{
      const newItem = req.body;
      const result = await ownAddedItemDb.insertOne(newItem)
      res.send(result)

  })

   // delete item 
   app.delete('/item/:id', async(req,res)=>{
    const id = req.params.id
    const qurey = {_id : new ObjectId(id)}
    const result = await ownAddedItemDb.deleteOne(qurey)
    res.send(result)
})



// get All User Added Data
 app.get('/item',async(req,res)=>{
  const result = await ownAddedItemDb.find().toArray()
  res.send(result)
})

// get single item data in another page
app.get('/item/:id', async(req,res)=>{
  const id = req.params.id
  const qurey = {_id : new ObjectId(id)};
  const result = await ownAddedItemDb.findOne(qurey);
  res.send(result)
})

  // update data
  app.put('/item/:id', async(req,res)=>{
    const id = req.params.id;
    const qurey = {_id : new ObjectId(id)};
    const options = { upsert: true };
    const updatedItem = req.body
    const item = {
        $set:{
            name: updatedItem.name,
            userName: updatedItem.userName,
            subcategoryName: updatedItem.subcategoryName,
            processingTime: updatedItem.processingTime,
            price: updatedItem.price,
            rating: updatedItem.rating,
            photo: updatedItem.photo,
            email: updatedItem.email,
            shortDescription: updatedItem.shortDescription,  
            customization: updatedItem.customization          }
    }
    const result = await ownAddedItemDb.updateOne(qurey, item, options);
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