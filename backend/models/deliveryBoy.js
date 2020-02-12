const mongoose = require("mongoose");
const { Schema } = mongoose;

const driverSchema = new Schema({
  password:String,
  email:String,
  role: { type: String, default: "bike" },
  address: String,
  destination:String,
  contactPhone: String,
  fullName: String,
  status:Boolean
});

module.exports=mongoose.model("delivery", driverSchema);
