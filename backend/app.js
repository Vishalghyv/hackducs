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
  Driver.create(record,(err)=>{
    if(err)
    console.log(err);
    console.log("done");
  })
});


app.get('/signinDel',(req,res)=>{
  res.send(layout(SignInDel()));
});
// app.post('/signinDel', sign(DeliveryBoy)); 
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


app.get("/schedules", requireLogin, async (req, res) => {
    
      const pickups = await OrderPlace.find({ recieved: false });
      // const zones = await Zone.find({});
      // const trucks = await Truck.find({});
      const drivers = await Driver.find({ status: false });
      const des = [];
      const del = [];
      const stops = [];
      const schedules = [];
      console.log(pickups)

      //sort to stops by origin
      for (pickup of pickups) {
        stops.push({
          location: pickup.destination,
          description: pickup.description,
          _order: pickup.id,
          product: pickup.product,
          sort: "Pickup"
        });
        des.push([pickup.coordinates]);
      }

      const deviderSize = Math.floor(
        stops.length /drivers.length
      );
      while (drivers.length > 0 && stops.length>0) {
        i=0
        min = Math.sqrt(Math.pow((drivers[0].coordinates[0])-des[0][0],2)+Math.pow((drivers[0].coordinates[1])-des[0][1],2))
        minEle = 0
        dis =0
        while(stops.length>i){
            min = Math.sqrt(Math.pow((drivers[0].coordinates[0])-des[i][0],2)+Math.pow((drivers[0].coordinates[1])-des[i][1],2))
            if(dis<min){
              min = dis
              minEle = i
            }
            i++;
        }
        let driver = drivers.pop(0);
        let de = des.pop(i);
        let st = stops.pop(i);
        if (driver === undefined) {
          break;
        }
        schedules.push({
          driverName: driver,
          st:st,
          de:de
        });
      }
      res.send(schedules);
    }
  );


// Finalizing
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

