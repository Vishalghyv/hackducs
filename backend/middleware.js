const {validationResult}=require('express-validator');
const User=require('./models/User');
module.exports={
    handleErrors:(template,owner)=>{
                             return function(req,res,next)
                             {
                                     var l,k;
                                        const p=validationResult(req);
                                        owner.find({email:req.body.email},(err,rec)=>{
                                        if(rec.length>0)
                                        { l=rec.length;
                                            k="Email is already in use";
                                        }
                                        if(!p.isEmpty() || l){
                                        return res.send(template(p,k));
                                        }
                                        else
                                        {next();}
                                    });
                            }
                        },
    requireLogin: (req,res,next)=>      {
                          if (!req.session.user) {
                            return res.status(401).redirect('/signin');
                          }
                          next();
                        },
    requireSuperLogin: (req,res,next)=>      {
                            if (!req.session.superuser) {
                              return res.status(401).redirect('/signinManu');
                            }
                            next();
                          },
    requireDeliveryLogin: (req,res,next)=>      {
                              if (!req.session.delivery) {
                                return res.status(401).redirect('/signinManu');
                              }
                              next();
                            }                          
}