const mongoose = require("mongoose");
const { Schema } = mongoose;
const OrderSchema = require("./Order");

const userSchema = new Schema({
  googleId: String,
  password:String,
  credits: { type: Number, default: 0 },
  role: { type: String, default: "client" },
  company: String,
  address: String,
  contactPhone: Number,
  fullName: String,
  email: String // should be num? + how to validate israeli phone
});

module.exports=mongoose.model("users", userSchema);
