const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const MongoClient=require('mongodb').MongoClient;
var db;
var s;
MongoClient.connect('mongodb://localhost:27017/Clothing', (err,database) =>
{
    if(err) return console.log(err)
    db=database.db('Clothing')
    app.listen(4000, ()=>{
        console.log('Listening on port 4000')
    })
})

app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/',(req,res) =>{
    db.collection('Men').find().toArray((err,result)=>{
        if(err) return console.log(err)
    res.render('home.ejs', {data:result})
    })     
})


app.get('/create', (req,res)=>{
    res.render('add.ejs')
})

app.get('/updateitems', (req,res)=>{
    res.render('update.ejs')
})

app.get('/deleteitems', (req,res)=>{
    res.render('delete.ejs')
})

app.post('/adddata',(req,res)=>{
    db.collection('Men').save(req.body,(err,result)=>{
        if(err) return console.log(err)
    res.redirect('/')
    })
})

app.post('/update',(req,res)=>{
   db.collection('Men').find().toArray((err,result)=>{
       if(err)
         return console.log(err)
       for(var i=0;i<result.length;i++)
       {
           if(result[i].Product_ID==req.body.Product_ID)
           {
               s=result[i].Stock
               break
           }
       }
       db.collection('Men').findOneAndUpdate({Product_ID :req.body.Product_ID},{
        $set:{Stock:parseInt(s)+parseInt(req.body.Stock)}}, {sort:{_id:-1}},
        (err,result)=>{
            if(err)
                return res.send(err)
            console.log(req.body.Product_ID+'stock is updated')
            res.redirect('/')
        })
       //)
   })
})

app.post('/delete',(req,res)=>{
    db.collection('Men').findOneAndDelete({Product_ID :req.body.Product_ID}, (err,result)=>{
        if(err) 
          return console.log(err)
        res.redirect('/')
    })
})

