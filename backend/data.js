const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DataSchema = new Schema(
  {
  	name: String,
    username: String,
    password: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Data", DataSchema);

