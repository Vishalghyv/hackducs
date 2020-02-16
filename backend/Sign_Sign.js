var uniqid = require('uniqid');
const session = require('express-session');
const  {createPassword,comparePasswords}=require('./password');
const mongoose=require('mongoose');
mongoose.set('useFindAndModify', false);

module.exports={
    create:(owner)=>{
        return async function(req,res){
            const rec= await createPassword(req.body);
            owner.create(rec,(err)=>{
              if(err)
              console.log(err);
              else{
                  res.redirect("/user");
              }
            })
          }
    },

    sign:(owner)=>{
      return (req,res)=>{
  
        owner.find({email:req.body.email},async function(err,rec){
          if(rec.length==0)
              res.redirect('/signupUser');
            for(u of rec){
            //Prints true and flase for the correct and wrong password
              x = await comparePasswords(u.password,req.body.password);
              if(x)
              { 
                sess=req.session;
                sess.user = u;
                res.redirect('/user');
              }else{
                res.redirect('/signupUser');
              }
            } 
          
        });
      }
    }
}