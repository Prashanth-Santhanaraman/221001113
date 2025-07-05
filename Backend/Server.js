const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());
mongoose
  .connect("mongodb://127.0.0.1:27017/Afford")
  .then(() => {
    console.log("Connected to the db");
  })
  .catch((err) => {
    console.log(err);
  });

const urlSchema = mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  currentdates: {
    type: Date,
  },
  validity: {
    type: Date,
  },
  shortcode: {
    type: String,
  },
  count: {
    type: Number,
    default: 0,
  },
  clickTimeStamp:{
    type:Date,
    default: new Date().now
  }
});

const urlModel = mongoose.model("user", urlSchema);

const generateShortCode = () => {
  const code = Math.floor(Math.random() * 100000);
  return code;
};

app.post("/shorturls", async (req, res) => {
  const { url, validity = 30, shortcode } = req.body;
  if (!url) {
    return res.status(404).json({ message: "Url or shortcode is not found" });
  }
  let newshortcode;
  if (!shortcode) {
    newshortcode = generateShortCode();
  }
  const date = new Date();
  const currentdate = date.now;
  const newValidity = date.toISOString(date.getTime() + validity * 60);
  const userdata = await urlModel.create({
    url,
    currentdates: date.toISOString(currentdate),
    validity: newValidity,
    shortcode: shortcode || newshortcode,
  });
  console.log(userdata);
  const url1 = new URL("http://localhost:4000/shorturls/");
  if (userdata) {
    return res.status(201).json({
      shortlink: url1.href + userdata.shortcode,
      expiry: userdata.validity,
    });
  }
});

app.get("/shorturls/:id",async(req,res) => {
    const {id} = req.params
    console.log(req.baseUrl)
    const date= new Date()
    const urldetail = await urlModel.findOne({shortcode:id})
    if(urldetail){
        urldetail.count += 1
        urldetail.clickTimeStamp = date.now
        await urldetail.save()
        res.redirect(urldetail.url)
    }
})

app.post("/shorturls/:id", async (req, res) => {
  const { id } = req.params;
  const userdetails = await urlModel.findOne({ shortcode: id });
  if (userdetails) {
    res
      .status(201)
      .json({
        count: userdetails.count,
        creationdate: userdetails.currentdates,
        expirydate: userdetails.validity,
      });
  }
});

app.listen(4000, (req, res) => {
  console.log("Listening at port 4000");
});
