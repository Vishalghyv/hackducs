module.exports=()=>{
   return `<form  action="/signupUser" method="POST">
    <input type="text" name="fullName" placeholder="name" >
    <input type="text" name="password" placeholder="password">
    <input type="tel" name="contactPhone" placeholder="contact" required>
    <input type="text" name="address" placeholder="address" >
    <input type="text" name="email" placeholder="email" >
    <input type="submit">
    
    
    </form>`
}