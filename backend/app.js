//Imports
var express = require('express')
const session = require('express-session');
const cookieSession = require('cookie-session');
const multer = require("multer");
const upload = multer({storage: multer.memoryStorage(), limits:{files: 5}}) ;
const { check } = require('express-validator');
const {validationResult}=require('express-validator');
var uniqid = require('uniqid');
var cors = require('cors')
var bodyparser = require('body-parser')
var path = require('path')
var mongoose = require('mongoose')
const passport = require("passport");
var NodeGeocoder = require('node-geocoder');
var methodOverride=require("method-override");
// const multer = require('multer');
// const ejs = require('ejs');

var route = require('./route')
const User=require('./models/User');
const signuptempUser=require('./Users/signupTemplate');
const signuptempManu=require('./Manufacture/signupTemplate');
const  {createPassword,comparePasswords}=require('./password');
const {contactvalidity,emailexists}=require('./validators');
const {handleErrors,requireLogin}=require('./middleware');
const {create,sign,update}=require('./Sign_Sign');

const {layout}=require('./Users/home');
const SignUpUser=require('./Users/SignUpform');
const SignInUser=require('./Users/SignInform');
const SignUpManu=require('./Manufacture/signup');
const SignInManu=require('./Manufacture/signin');
const SignUpDel =require('./Delivery/signup');
const signuptempDel=require('./Delivery/signupTemplate');
const SignInDel=require('./Delivery/signin');
const Driver=require('./models/Driver');
const Manufacturer=require('./models/Manufacturer');
const OrderPlace=require('./models/Order');
const Images=require('./showImages');

var app = express();
app.set("view engine",'js');
app.use(
  cookieSession({
    keys: ['lkasld235j']
  })
);
app.use(methodOverride("_method"));


mongoose.connect("mongodb://127.0.0.1/ewaste!",{
	useUnifiedTopology:true,
	useNewUrlParser:true
}).then(()=>{
  console.log("connected to DB!");
}).catch(err=>{
	console.log("error");
});

//Constants
const hostname = '127.0.0.1';
const port = 2000;



//Moongoose
// mongoose.connect(url);
// mongoose.connection.on('connected',() =>{
//   console.log("Connection made to mongodb @ 27017")
// })

//Routing
// app.get("/", express.static(path.join(__dirname, "./public")));
app.use(session({secret: 'ssshhhhh',proxy: true,
    resave: true,
    saveUninitialized: true}));
app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
//sign up route

///USER ROUTES//////////////////////

app.get('/user',(req,res)=>{
  res.send(`<a href="/signupUser/${req.session.user._id}/edit">Edit</a>
    <a href="  ">Order</a>`)
    
});

app.get('/signupUser',(req,res)=>{
  res.send(layout(SignUpUser()));
});

app.post('/signupUser',[
  contactvalidity,
  emailexists,
],handleErrors(signuptempUser,User),
create(User));


app.get('/signinUser',(req,res)=>{
  res.send(layout(SignInUser()));
});
app.post('/signinUser', sign(User));  

app.get('/signout',requireLogin,async(req,res)=>{
  req.session=null;
  res.redirect('/signup');
});

app.get('/signupUser/:id/edit',async (req,res)=>{
  res.send(`<form  action="/signupUser/${req.session.user._id}?_method=PUT" method="POST">
    <input type="text" name="fullName" value=${req.session.user.fullName}  >
    <input type="text" name="password" required>
    <input type="tel" name="contactPhone" value=${req.session.user.contactPhone} required>
    <input type="text" name="address"value=${req.session.user.address} >
    <input type="text" name="email" value=${req.session.user.email} >
    <input type="submit">
    
    
    </form>`);
   });

app.put('/signupUser/:id',async (req,res)=>{
  const rec= await createPassword(req.body);
  User.findByIdAndUpdate(req.params.id,rec,(err,response)=>{
    res.redirect('/user');
  })
  });

///////////////MANUFACTURER ROUTES///////////////////////////
app.get('/signupManu',(req,res)=>{
  res.send(layout(SignUpManu()));
});

app.post('/signupManu',[
  contactvalidity,
  emailexists,
],handleErrors(signuptempManu,Manufacturer),
create(Manufacturer));


app.get('/signinManu',(req,res)=>{
  res.send(layout(SignInManu()));
});
app.post('/signinManu', sign(Manufacturer)); 

//////DELIVERY GUY ROUTES/////////////////////

app.get('/signupDel',(req,res)=>{
  res.sendFile(path.join(__dirname, 'delAdd.html'));
});

app.post('/signupDel',requireLogin,async (req,res)=>{
  console.log(req.body);
  res.send("submitter");
  var record={
    fullName:req.body.fullName,
    email:req.body.email,
    password:req.body.password,
    coordinates:[req.body.lat,req.body.lng],
    contactPhone:req.body.contactPhone,
    address:req.body.address,
    destination:req.body.destination,
  }
  Driver.create(record,(err,rec)=>{
    if(err)
    console.log(err);
    console.log(rec);
    req.session.delivery = rec;
  })
  // req.session.delivery = ;
});


app.get('/signinDel',(req,res)=>{
  res.send(layout(SignInDel()));
});
app.post('/signinDel',(req,res)=>{
  console.log(req.body.email);
  console.log(req.session.user);
   // console.log(res);
  Driver.find({email:req.body.email},async function(err,rec){
            for(u of rec){
            //Prints true and flase for the correct and wrong password
              // x = await comparePasswords(u.password,req.body.password);
              if(req.body.password == u.password){
                x = true
              }else{
                x = false
              }
              if(x)
              { 
                sess=req.session;
                sess.delivery = u;
                res.send(u);
              }
            } 
          
        })
}); 
app.get("/iss200.png", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/iss200.png"));
});


app.get('/orderImages',(req,res)=>{
  OrderImages.find({},(err,r)=>{
    try{
      res.send(Images(r[0].images));
    }catch{
      res.send("No image posted");
    }
   
     
  });
});
app.get('/orderRec',(req,res)=>{
  OrderPlace.find({},(err,r)=>{
    try{
      res.send(r);
    }catch{
      res.send("No image posted");
    }
   
     
  });
});
app.get('/delRec',(req,res)=>{
  Driver.find({},(err,r)=>{
    try{
      res.send(r);
    }catch{
      res.send("No image posted");
    }
   
     
  });
});
app.get('/orderDel',(req,res)=>{
  OrderPlace.deleteMany({},(err)=>{
    if(err)
    console.log(err);
    });
})
app.get('/orderPLacement',requireLogin,async (req,res)=>{
   res.sendFile(path.join(__dirname, 'index.html'));
});
app.post('/orderPLacement',upload.array('images',5),async (req,res)=>{
  res.send("submitter");
  var images=[];
  for(let i of req.files)
  {
    images.push(i.buffer.toString('base64'));
  }
  var work = Boolean
  if(req.body.working){
    work = true
  }else{
    work = false
  }
  var record={
    product:req.body.product,
    description:req.body.description,
    destination:req.body.destination,
    coordinates:[req.body.lat,req.body.lng],
    work:work,
    recieved:false,
    images:images
  }
  driver = await schedules(record)
  if(driver==null){
    console.log(driver)
    record["driverId"] = null;
  }else{
    record["driverId"] = driver._id
    console.log(driver)
  }
  record._user=req.session.user._id;
  console.log()
  OrderPlace.create(record,(err)=>{
    if(err){console.log(err);}
    console.log("done");
  })
});
var options = {
  provider: 'openstreetmap',
  formatter: null
};
var geocoder = NodeGeocoder(options);

app.post('/geocoder/:lat/:lng',(req,res)=>{
  geocoder.reverse({lat:req.params.lat, lon:req.params.lng}, function(err, re) {
  res.send(re);
  });
  
});

async function schedules(record){
  // const pickups = await OrderPlace.find({ recieved: false });
  const drivers = await Driver.find({ status: false });
  const des = [];
  des.push([record.coordinates]);
  const del = [];
  const schedules = [];
  if(drivers.length==0){
    return null;
  }
  min = Math.sqrt(Math.pow((drivers[0].coordinates[0])-des[0][0],2)+Math.pow((drivers[0].coordinates[1])-des[0][1],2));
  i=0   
  minEle = 0
  while (drivers.length < i) {  
      temp = Math.sqrt(Math.pow((drivers[i].coordinates[0])-des[0][0],2)+Math.pow((drivers[i].coordinates[1])-des[0][1],2))
      if(temp<min){
          min = temp
          minEle = i
          }
          i++;
    }
    let driver = drivers.pop(minEle);
    if (driver === undefined) {
      return null;
    }
  return driver
}

// Finalizing
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

