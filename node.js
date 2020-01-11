var http=require('http');
var fs=require('fs');
var url=require('url');
var bodyParser=require('body-parser');
var mongoose=require('mongoose');
var express=require('express');
var app=express();
//var cookieParser=require('cookie-parser');
var session=require('express-session');
app.use(session({
        'secret' : '1029384756qwertyuiop'
        }))
var urlencodedParser=bodyParser.urlencoded({extended:true});
mongoose.connect("mongodb://localhost/ecom");
var schema=mongoose.Schema;
let signUp=new schema({
    name:String,
    uname:String,
    password:String,
    email:String,
})
var signup=mongoose.model('signup',signUp);

let Product=new schema({
    id:Number,
    name:String,
    description:String,
    price:Number,
    quantity:Number,
    img:String,
})

let Cart=new schema({
    user:String,
    id:Number,
    name:String,
    price:Number,
    quantity:Number,
    total:Number,
    img:String,
})

let AllOrders=new schema({
    user:String,
    id:Number,
    name:String,
    price:Number,
    quantity:Number,
    total:Number,
    img:String,
})

app.get('/getUserInfo',(req,res)=>{
    let users=req.session.user;
    console.log("All users "+users);
    res.json(users);
})
var products=mongoose.model('products',Product);
var cart=mongoose.model('cart',Cart);
var allOrders=mongoose.model('allOrders',AllOrders);
app.use(express.static(__dirname + '/public'));

/*app.use((req,res,next)=>{
    if(url.parse(req.url).pathname=='/')
        {
            next();
        }
    else if(url.parse(req.url).pathname=='/login')
        {
            next();
        }
    else if(url.parse(req.url).pathname=='/SignUp')
        {
            next();
        }
    else  if(req.cookies.userData=="abcd")
        {
            next();
        }
})*/

  app.get('/admin',function(req,res){
         res.sendFile(__dirname+"/products.html");
  })
  app.get('/script.js',function(req,res){
      res.sendFile(__dirname+"/script.js");
  })
  app.get("/array",(req,res)=>{
      products.find({},function(err,docs){
          res.json(docs);
      })
  })
  
   app.get("/cartProducts",(req,res)=>{
      cart.find({},function(err,docs){
          res.json(docs);
      })
  })
  app.post("/products",urlencodedParser,(req,res)=>{
      var len=JSON.parse(req.body.array).length;
    var sData=new products();
    sData.id=JSON.parse(req.body.array)[len-1].id;  
    sData.name=JSON.parse(req.body.array)[len-1].name;    
    sData.description=JSON.parse(req.body.array)[len-1].description;
    sData.price=JSON.parse(req.body.array)[len-1].price;
    sData.quantity=JSON.parse(req.body.array)[len-1].quantity;
    sData.img=JSON.parse(req.body.array)[len-1].img;
    sData.save(function(err){
        if(err)
        throw err;
    })
  })
  app.post("/deleteFromProducts",urlencodedParser,(req,res)=>{
      let index=JSON.parse(req.body.ids);
      products.findOneAndRemove({id:index},function(err){
          if(err){
                  console.log(err);
        }
          console.log("removed");
      });
  })

app.post("/deleteFromCart",urlencodedParser,(req,res)=>{
      let index=JSON.parse(req.body.ids)
      let username=JSON.parse(req.body.username);
      cart.findOneAndRemove({id:index,user:username},function(err){
          if(err){
                  console.log(err);
        }
          console.log("removed");
      });
  })

  app.post("/carts",urlencodedParser,(req,res)=>{
    var len=JSON.parse(req.body.cart).length;
    var sData=new cart();
    sData.user=JSON.parse(req.body.cart)[len-1].user;  
    sData.id=JSON.parse(req.body.cart)[len-1].id;    
    sData.name=JSON.parse(req.body.cart)[len-1].name;
    sData.price=JSON.parse(req.body.cart)[len-1].price;
    sData.total=JSON.parse(req.body.cart)[len-1].total;
    sData.quantity=JSON.parse(req.body.cart)[len-1].quantity;
    sData.img=JSON.parse(req.body.cart)[len-1].img;
      console.log("SAVED");
    sData.save(function(err){
        if(err)
        throw err;
    })
  })
  app.get('/',function(req,res){
      let user=req.session.user;
      console.log(user);
      res.sendFile(__dirname+"/viewProducts.html");
  })
  app.get('/viewProducts.js',function(req,res){
      res.sendFile(__dirname+"/viewProducts.js");
  })
  app.get('/cart',function(req,res){
      res.sendFile(__dirname+"/cart.html");
  })
  app.get('/cart.js',function(req,res){
     res.sendFile(__dirname+"/cart.js"); 
  })
  app.get('/SignUp',function(req,res){
      res.sendFile(__dirname+"/SignUp.html");
  })
  app.post('/SignUp',urlencodedParser,(req,res)=>{
      var uData=new signup();
      uData.name=req.body.name;
      uData.uname=req.body.uname;
      uData.password=req.body.password;
      uData.email=req.body.email;
      uData.save(function(err){
          if(err)
              throw err;
      })
      res.redirect('/');
  })
  app.get('/login',function(req,res){
       res.sendFile(__dirname+"/login.html");
  })
  app.post('/login',urlencodedParser,(req,res)=>{
        if(req.body.uname=="admin" && req.body.password=="admin")
            {
                res.redirect('/admin');
            }
        signup.find({},function(err,docs){
            for(let i=0;i<docs.length;i++)
                {
                    if(req.body.uname==docs[i].uname && req.body.password==docs[i].password)
                        {
                          req.session.user=req.body.uname;
                          res.redirect('/');                         
                        }
                }
        })       
    })

app.post('/updateCart',urlencodedParser,(req,res)=>{
    let product=JSON.parse(req.body.cart);
    cart.findOneAndUpdate(
    {
        'id' : JSON.parse(req.body.id),
        'user' : JSON.parse(req.body.usr),
    },
    {
        'user' : product.user,
        'id' : product.id,
        'name' : product.name,
        'price' : product.price,
        'total' : product.total,
        'quantity' : product.quantity,
        'img' : product.img,
    },
    (err,affected)=>{
        if(err)
        console.log(err);
        console.log(affected);
    })
})

app.post('/updateDatabase',urlencodedParser,(req,res)=>{
    let product=JSON.parse(req.body.product);
    products.findOneAndUpdate(
    {
        'id' : JSON.parse(req.body.id)
    },
    {
        'name' : product.name,
        'description' : product.description,
        'price' : product.price,
        'quantity' : product.quantity,
        'img' : product.img,
    },
    (err,affected)=>{
        if(err)
        console.log(err);
        console.log(affected);
    })
})

app.post("/deleteCartProduct",urlencodedParser,(req,res)=>{
      let index=req.body.username;
       console.log(index);
       index=index.slice(1,index.length-1);
      cart.remove({user:index},function(err){
          if(err){
                  console.log(err);
        }
          console.log("removed...");
      });
  })
app.post("/allOrders",urlencodedParser,(req,res)=>{
     console.log("ok");
      var arr=JSON.parse(req.body.AllOrders);
     //console.log("arr : "+arr);
    allOrders.insertMany(arr, function(err, res) {
    if (err) throw err;
    console.log("Number of documents inserted: " + res.insertedCount);
  });
  })
app.get("/logout",function(req,res){
               console.log(req.session.user);
        req.session.destroy(function(err){
            if(err)
                console.log(err);
            console.log("DEStroyed");
 
        })
})
app.listen(3000);
console.log("Server Up!");
