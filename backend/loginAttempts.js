const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const loginAttemptsSchema = new Schema(
  {
    username: String,
    ip: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("LoginAttempt", loginAttemptsSchema);
