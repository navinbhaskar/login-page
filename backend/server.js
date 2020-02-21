const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const Data = require("./data");
const LoginAttempt = require("./loginAttempts");

const API_PORT = 3001;
const app = express();
const router = express.Router();

mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true});
let db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); 
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));

router.get("/", (req, res) => {
  res.json({ message: "HELLOW WORLDUUHHHH" });
});


router.post("/login", (req, res) => {
  let data = new Data();
  let loginAttempt = new LoginAttempt();

  const { username, password, ip } = req.body;

  if ((!username) || !password) {
    return res.json({
      success: false,
      status: 400,
      message: "INVALID INPUTS"
    });
  }


  Data.find({username: username}, (err, data) => {
    loginAttempt.username = username;
    loginAttempt.ip = ip;
    loginAttempt.save();

    LoginAttempt.find({username: username, ip: ip, createdAt: {$gt:new Date(Date.now() - 24*60*60 * 1000)} }).exec(function (err, results) {
      var count = results.length;
      
      showCaptcha=false;

      if(count >= 3)
        showCaptcha = true

      if (err) 
        return res.json({ success: false, message: err })
      else if(data == '')
        return res.json({ success: false, status: 404, message: 'User not found' })
      else if(data[0]['password'] == password)
        return res.json({ success: true, status: 200, message: 'Successfully logged in', showCaptcha: showCaptcha })
      else
        return res.json({ success: false, status: 400, message: 'Incorrect password' })

    });
  });
});

router.post("/signup", (req, res) => {
  let data = new Data();

  const { name, username, password } = req.body;

  if ((!username) || !password || !name) {
    return res.json({
      success: false,
      error: "Invalid inputs"
    });
  }
  Data.find({username: username}, (err, value) => {

    if (err) 
      return res.json({ success: false, message: err })
    else if(value != '')
      return res.json({ success: false, status: 404, message: 'User already exists' })
    else  {
      data.name = name;
      data.password = password;
      data.username = username;
      data.save(err => {
        if (err) return res.json({ success: false, error: err, status: 400 });
        return res.json({ success: true, status: 201 });
      });
    }
  })
});


app.use("/api", router);

app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
