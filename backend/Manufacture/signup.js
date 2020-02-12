module.exports=()=>{
    return `<form  action="/signupManu" method="POST">
     <input type="text" name="fullName" placeholder="name" >
     <input type="text" name="password" placeholder="password">
     <input type="tel" name="contactPhone" placeholder="contact" required>
     <input type="text" name="address" placeholder="address" >
     <input type="text" name="email" placeholder="email" >
     <input type="text" name="type_of_ewaste" placeholder="Refrigerator,iron.." >

     <input type="submit">
     
     
     </form>`
 }