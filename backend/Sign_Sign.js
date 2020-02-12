var uniqid = require('uniqid');
const session = require('express-session');
const  {createPassword,comparePasswords}=require('./password');

module.exports={
    create:(owner)=>{
        return async function(req,res){
            req.body.googleId=uniqid();
            req.session.userId=req.body.googleId;
            const rec= await createPassword(req.body);
            console.log(rec);
            owner.create(rec,(err)=>{
              if(err)
              console.log(err);
              else{
                  res.send("Account  created");
              }
            })
          }
    },

    sign:(owner)=>{
      return (req,res)=>{
  
        owner.find({email:req.body.email},async function(err,rec){
            for(u of rec){
            //Prints true and flase for the correct and wrong password
              x = await comparePasswords(u.password,req.body.password);
              if(x)
              { 
                sess=req.session;
                sess.user = u;
                res.send(u);
              }
            } 
          
        });
      }
    }
}