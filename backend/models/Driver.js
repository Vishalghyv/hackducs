const mongoose = require("mongoose");
const { Schema } = mongoose;
const OrderSchema = require("./Order");

const driverSchema = new Schema({
	email:String,
	password:String,
	role: { type: String, default: "bike" },
	address: String,
	destination:String,
	coordinates:[Number],
	contactPhone: String,
	fullName: String,
	status:{type:Boolean,default:false}
});

module.exports=mongoose.model("driver", driverSchema);
