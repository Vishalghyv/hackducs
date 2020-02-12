const mongoose = require("mongoose");
const { Schema } = mongoose;
// const AddressSchema = require("./Address");
// const VolumeSchema = require("./Volume");

const orderSchema = new Schema({
  description: {type:String,default:""},
  _user: { type: Schema.Types.ObjectId, ref: "User" },
  destination: String,
  working: { type: Boolean, default: false },
  // dateOrdered: Date,
  // dateRecieved: Date,
  // dateDelivered: Date,
  coordinates:[Number],
  images: [String]
});

// mongoose.model("Order", orderSchema);

module.exports=mongoose.model("OrderPlace", orderSchema);
