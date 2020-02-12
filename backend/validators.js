const {check}=require('express-validator')
module.exports={
    contactvalidity:check('contactPhone')
    .trim()
    .isInt()
    .isLength({min:6,max:10})
    .withMessage('Enter valid phone number'),

    emailexists:check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Invalid value')
}