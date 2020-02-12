const mongoose = require("mongoose");
const { Schema } = mongoose;

const manufactureSchema = new Schema({
  id: String,
  password:String,
  email:String,
  type_of_ewaste:[String],
  address: String,
  contactPhone: String,
  fullName: String,
  status:Boolean
});

module.exports=mongoose.model("manufracturer", manufactureSchema);
