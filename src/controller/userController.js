const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userSchema = require("../schema/user");
require('dotenv').config();

exports.createUser = (req,res,next) => {
   


    const { error } = userSchema.validate(req.body);

    if (!error) {

      const secretKey = process.env.JWT_SECRET_KEY
      const { name, email, password } = req.body;

      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({ error: err });
        } else {
          const user = new User(name, email, hash);
          user
            .save()
            .then((result) => {
              const userPayload = {
                name: req.body.name,
                email: req.body.email,
                userId: result.insertedId,
              };
             
              const token = jwt.sign(userPayload, secretKey, { expiresIn: "10d" });
              res.cookie("token", token);
              res.status(201).json({
                message: "User created successfully",
                token: token,
              });
            })
            .catch((err) => {
                console.log(err);
              res.status(500).json({ error: err });
            });
        }
      });
    } else {
      res.status(400).send({ error: "Invalid Parameter" });
    }

}

exports.getCart = (req, res, next) => {
     
    const {userId} = req.user;
    User.getCart(userId)
    .then(result => {
        res.status(200).send(result)
    })
    .catch(err => {
        res.status(500).json({ error: "Internal Error" });
    })
    
    
}