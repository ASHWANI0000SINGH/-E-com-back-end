require("./db/config");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const mongodb = require("mongodb");
const User = require("./db/user");
const Products = require("./db/products");

const Jwt = require("jsonwebtoken");
const jwtKey = "e-com";

const cors = require("cors");
const { response } = require("express");
app.use(cors());
// 639992369ebb5ff95ba0d962

app.use(express.json());
app.post("/register", async (req, res) => {
  let data = new User(req.body);
  let result = await data.save();
  result = await result.toObject();
  delete result.password;
  Jwt.sign({result}, jwtKey, {expiresIn:"12h"},(err,token)=>{
    if(err){
        res.send("Something went wrong")  
    }
    res.send({result,auth:token})
})
})

app.post("/login", async (req, res) => {
  if (req.body.email && req.body.password) {
    let user = await User.findOne(req.body).select("-password");
    if (user) {
      Jwt.sign({ user }, jwtKey, { expiresIn: "12h" }, (err, token) => {
        if (err) {
          res.send("Something went wrong");
        }
        res.send({ user, auth: token });
      });
    } else {
      res.send({ result: "No User found" });
    }
  } else {
    res.send({ result: "No User found" });
  }
});

app.post("/add-product",verifyToken, async (req, res) => {
  let data = new Products(req.body);
  let result = await data.save();
  res.send(result);
});
app.get("/get-product" ,verifyToken,  async (req, res) => {
  let data = await Products.find();
  if (data.length > 0) {
    res.send(data);
  } else {
    res.send({ result: "No Product found" });
  }
});
app.delete("/get-product/:id" ,verifyToken,  async (req, res) => {
  const id = req.params.id;
  let data = await Products.deleteOne({ _id: id });
  if (data.length > 0) {
    res.send(data);
  } else {
    res.send({ result: "No Record Found." });
  }
});

app.get("/get-product/:id",verifyToken, async (req, res) => {
  console.log(req.params.id);
  const id = req.params.id;

  let data = await Products.findOne({ _id: id });

  if (data) {
    res.send(data);
  } else {
    res.send({ result: "No Product found" });
  }
});
app.put("/get-product/:id",verifyToken, async (req, res) => {
  const id = req.params.id;
  let data = await Products.updateOne({ _id: id }, { $set: req.body });
  res.send(data);
});

app.get("/search/:key",verifyToken,  async (req, res) => {
  let result = await Products.find({
    $or: [
      {
        name: { $regex: req.params.key },
      },
      {
        company: { $regex: req.params.key },
      },
      {
        category: { $regex: req.params.key },
      },
    ],
  });
  res.send(result);
});

function verifyToken(req,res,next){
    let token= req.headers['authorization']
    if(token){
       token= token.split(' ')[1];
        console.log("middle ware called if ",token)
        Jwt.verify(token,jwtKey,(err,valid)=>{
            if(err){
           res.status(401).send({result:"please provide valid token"});
            }else{
                next();
            }
        })
    }else{
        res.status(403).send({result:"please provide valid token with header"});

    }
}

app.listen(5000);
