const express= require("express");
const app = express();
const userRoute = require('./routes/user')
const productRoute = require('./routes/product')
const {createDBConnection} = require("./util/database")
const cookieParser = require("cookie-parser");

require('dotenv').config()

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/', (req,res,next) => {
    res.send("welcome")
})

app.use('/user', userRoute);
app.use('/product', productRoute)


createDBConnection(() => {
    app.listen(4004,() => {
        console.log("server started")
    })
})
