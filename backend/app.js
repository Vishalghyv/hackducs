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
// const multer = require('multer');
// const ejs = require('ejs');

var route = require('./route')
const User=require('./models/User');
const signuptempUser=require('./Users/signupTemplate');
const signuptempManu=require('./Manufacture/signupTemplate');
const  {createPassword,comparePasswords}=require('./password');
const {contactvalidity,emailexists}=require('./validators');
const {handleErrors,requireLogin}=require('./middleware');
const {create,sign}=require('./Sign_Sign');

const {layout}=require('./Users/home');
const SignUpUser=require('./Users/SignUpform');
const SignInUser=require('./Users/SignInform');
const SignUpManu=require('./Manufacture/signup');
const SignInManu=require('./Manufacture/signin');
const SignUpDel =require('./Delivery/signup');
const signuptempDel=require('./Delivery/signupTemplate');
const SignInDel=require('./Delivery/signin');
const DeliveryBoy=require('./models/deliveryBoy');
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
mongoose.connect("mongodb://127.0.0.1/ewaste",{
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
})

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
  res.send(layout(SignUpDel()));
});

app.post('/signupDel',[
  contactvalidity,
  emailexists,
],handleErrors(signuptempDel,DeliveryBoy),
create(DeliveryBoy));


app.get('/signinDel',(req,res)=>{
  res.send(layout(SignInDel()));
});
app.post('/signinDel', sign(DeliveryBoy)); 
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
    description:req.body.description,
    destination:req.body.destination,
    coordinates:[req.body.lat,req.body.lng],
    work:work,
    images:images
  }
  OrderPlace.create(record,(err)=>{
    if(err)
    console.log(err);
    console.log("done");
  })
});
var options = {
  provider: 'openstreetmap',

  // Optional depending on the providers
  // httpAdapter: 'https', // Default
  // apiKey: 'YOUR_API_KEY', // for Mapquest, OpenCage, Google Premier
  formatter: null         // 'gpx', 'string', ...
};
var geocoder = NodeGeocoder(options);
// async function send_coor(req,res,next) {
  //                           await 

                        // }
app.post('/geocoder/:lat/:lng',(req,res)=>{
  geocoder.reverse({lat:req.params.lat, lon:req.params.lng}, function(err, re) {
  res.send(re);
  });
  
});



// Finalizing
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

