const mongoose = require("mongoose");
const { Schema } = mongoose;
const OrderSchema = require("./Order");

const driverSchema = new Schema({
  id: String,
  role: { type: String, default: "bike" },
  address: String,
  coordinates:[Number],
  contactPhone: String,
  fullName: String,
  status:Boolean
});

mongoose.model("driver", driverSchema);
