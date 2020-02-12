var express = require('express')
const cookieSession = require('cookie-session');
const { check } = require('express-validator');
const {validationResult}=require('express-validator');
var uniqid = require('uniqid');
var cors = require('cors')
var bodyparser = require('body-parser')
var path = require('path')
var mongoose = require('mongoose')

var route = require('./route')
const User=require('./models/User');
const signuptemp=require('./Users/signupTemplate');
const  {createPassword,comparePassword}=require('./password');

const {layout}=require('./Users/home');
const SignUpform=require('./Users/SignUpform');
const SignInform=require('./Users/SignInform');

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
app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

//sign up route
app.get('/signup',(req,res)=>{
  res.send(layout(SignUpform()));
});

app.post('/signup',[
  check('contactPhone')
  .trim()
  .isInt()
  .isLength({min:6,max:10})
  .withMessage('Enter valid phone number'),
],function(req,res,next){

  const errors=validationResult(req);
  if(!errors.isEmpty()){
    return res.send(signuptemp(errors))
  }

  else
  {next();}
}

,async function(req,res){
  req.body.googleId=uniqid();
  req.session.userId=req.body.googleId;
  const rec= await createPassword(req.body);
  console.log(rec);
  User.create(rec,(err)=>{
    if(err)
    console.log(err);
  })

  
  
  //console.log(req.body);
});

app.get('/signin',(req,res)=>{
  res.send(layout(SignInform()));
});

app.post('/signin', (req,res)=>{
  const use = []
  User.find({email:req.body.email},async function(err,rec){
      for(u of rec){
      //Prints true and flase for the correct and wrong password
        x = await comparePassword(u.password,req.body.password);
        console.log(x);
      } 
    
  });
});






// Finalizing
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
