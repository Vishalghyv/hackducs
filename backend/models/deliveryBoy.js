const mongoose = require("mongoose");
const { Schema } = mongoose;

const driverSchema = new Schema({
  id: String,
  password:String,
  email:String,
  role: { type: String, default: "bike" },
  address: String,
  contactPhone: String,
  fullName: String,
  status:Boolean
});

module.exports=mongoose.model("delivery", driverSchema);
