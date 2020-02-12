const layout=require('../layout');
const {getError}=require('../helper');

module.exports=(p,k)=>{
    return layout(`<form  action="/signupDel" method="POST">
    <input type="text" name="fullName" placeholder="name" >
    <input type="text" name="password" placeholder="password">
    <input type="tel" name="contactPhone" placeholder="contact" required>
    ${getError(p,'contactPhone')}
    <input type="text" name="address" placeholder="address" >
    <input type="text" name="email" placeholder="email" >
    ${k}
    <input type="submit">
    
    
    </form>`)
}