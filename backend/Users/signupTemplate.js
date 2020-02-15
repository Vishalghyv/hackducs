const layout=require('../layout');
const {getError}=require('../helper');

module.exports=(p,k)=>{
    return layout(`<form  action="/signupUser" method="POST">
    <input type="text" name="fullName" placeholder="name" >
    <input type="tel" name="contactPhone" placeholder="contact" required>
    ${getError(p,'contactPhone')}
    
    <input type="text" name="address" placeholder="address" >
    <input type="email" name="email" placeholder="email" >
    ${k}
    <input type="submit">
    
    
    </form>`)
}