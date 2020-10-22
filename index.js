const express = require('express')
const bodyParser=require('body-parser');
const cors=require('cors');
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;

const app = express()
app.use(bodyParser.json());
app.use(cors());
app.get('/',(req,res)=>{
    res.send("hey! i am working");
})

const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_PASS}@cluster0.o2wak.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const port = 5000
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true  });
client.connect(err => {
  const Productcollection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_COLLECTIONS}`);
  const ordersCollection = client.db(`${process.env.DB_NAME}`).collection(`orders`);
 console.log("database is connected");

 app.post('/addProduct',(req,res)=>{
     const product=req.body;
     Productcollection.insertOne(product)
     .then(result=>{
         console.log(result)
         res.send(result.insertedCount);
     })
 })


 app.get('/products',(req,res)=>{
     Productcollection.find({})
     .toArray((err,documents)=>{
        res.send(documents);
     })
 })
 app.get('/product/:key',(req,res)=>{
    Productcollection.find({key:req.params.key})
    .toArray((err,documents)=>{
       res.send(documents[0]);
    })
})
app.post('/productsByKeys',(req,res)=>{
    const productKeys=req.body;
    Productcollection.find({key:{ $in: productKeys}})
    .toArray((err,documents)=>{
        res.send(documents); 
    })
})

app.post('/addOrder',(req,res)=>{
    const order=req.body;
    ordersCollection.insertOne(order)
    .then(result=>{
        console.log(result)
        res.send(result.insertedCount>0);
    })
})
});


app.listen( process.env.PORT || port)