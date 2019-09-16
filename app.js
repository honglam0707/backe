const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')

//const URI = 'mongodb://userTest:12345678@103.81.87.203:27017/test'
const URI = 'mongodb://localhost:27017/todolist'
mongoose.connect(URI,{useNewUrlParser:true})
		.then(console.log('connected bklq'))
		.catch(console.log)
const app = express();
// ========== middleware (built-in/3rd)==========
// allow CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");
    next();
});
// parser
app.use(express.urlencoded({extended:true}))
app.use(express.json())
// passport
app.use(passport.initialize())
require('./config/passport')(passport)
// router
app.use('/user',require('./route/u_route'))
app.use('/kh',require('./route/kh_r'))
// ====  //
const port = process.env.PORT||1234;
app.listen(port,console.log(`connect on ${port}`))