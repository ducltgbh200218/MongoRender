var express = require('express');
const { ObjectId } = require('mongodb');
var app = express()

app.set('view engine', 'hbs')
app.use(express.urlencoded({extended:true}))

var url = 'mongodb+srv://ducltgbh200218:duc10052002@cluster1.yumjljh.mongodb.net/test';
var MongoClient = require('mongodb').MongoClient;

app.post('/edit', async (req,res)=>{
    const name = req.body.txtName
    const price = req.body.txtPrice
    const picURL = req.body.picURL
    const id = req.body.id

    let client = await MongoClient.connect(url)
    let dbo = client.db("GCH1005")
    var ObjectId = require('mongodb').ObjectId
    let condition = {"_id": new ObjectId(id)};
    const newValues = {$set: {name:name,price:price,picURL:picURL}}
    await dbo.collection("products").updateOne(condition, newValues)
    res.redirect('/')
})

app.get('/edit/:id', async(req,res)=>{
    const id = req.params.id
    let client = await MongoClient.connect(url)
    let dbo = client.db("GCH1005")
    var ObjectId = require('mongodb').ObjectId
    let condition = {"_id": new ObjectId(id)};
    const prod = await dbo.collection("products").findOne(condition)
    res.render('edit', {prod:prod})
})

app.post('/add',async (req,res)=>{
    const name = req.body.txtName
    const price = req.body.txtPrice
    const picURL = req.body.picURL

    if(name.length < 5){
        res.render('add',{name_err: 'Min length is 5 characters'})
        return
    }

    const newProduct = {
        'name': name,
        'price': price,
        'picURL': picURL
    }

    let client = await MongoClient.connect(url)
    let dbo = client.db("GCH1005")
    await dbo.collection("products").insertOne(newProduct)
    res.redirect("/")
})

app.get('/add', (req, res)=>{
    res.render('add')
})

app.get('/delete/:id',async (req,res)=>{
    const id = req.params.id
    let client = await MongoClient.connect(url)
    let dbo = client.db("GCH1005")
    var ObjectId = require('mongodb').ObjectId
    let condition = {"_id": new ObjectId(id)}
    await dbo.collection("products").deleteOne(condition)
    res.redirect("/")
})

app.get('/', async (req,res)=>{
    let client = await MongoClient.connect(url)
    let dbo = client.db("GCH1005")
    let products = await dbo.collection("products").find().toArray()
    res.render('main', {'products': products})
})
const PORT = process.env.PORT || 8000
app.listen(PORT,()=>{
    console.log("Server is running!")
})