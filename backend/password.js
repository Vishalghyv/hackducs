const crypto = require('crypto');
const util = require('util');
const scrypt = util.promisify(crypto.scrypt);

module.exports={
    async createPassword(attrs){
        const salt = crypto.randomBytes(8).toString('hex');
    const buf = await scrypt(attrs.password, salt, 64);
    const record = {
      ...attrs,
      password: `${buf.toString('hex')}.${salt}`
    };
    return record;

    },
     async comparePasswords(saved, supplied) {
        // Saved -> password saved in our database. 'hashed.salt'
        // Supplied -> password given to us by a user trying sign in
        const [hashed, salt] = saved.split('.');
        const hashedSuppliedBuf = await scrypt(supplied, salt, 64);
    
        return hashed === hashedSuppliedBuf.toString('hex');
      }
    


}