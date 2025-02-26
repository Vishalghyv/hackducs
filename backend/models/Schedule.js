const mongoose = require("mongoose");
const { Schema } = mongoose;
const StopSchema = require("./Stop");

const scheduleSchema = new Schema({
  _driver: { type: Schema.Types.ObjectId, ref: "Driver" },
  driverName: String,
  stops: [StopSchema]
});

module.exports = scheduleSchema;
