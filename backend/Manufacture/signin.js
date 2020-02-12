module.exports=()=>{
    return `<form  action="/signinManu" method="POST">
    <input type="email" name="email" placeholder="email" >
    <input type="text" name="password" placeholder="password">
    <input type="submit">
    </form>`
}