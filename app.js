const express = require('express')
const app= express()
const mustacheExpress = require('mustache-express')
const axios = require('axios')
const models = require('./models')
const { Op } = require("sequelize");
const { urlencoded } = require('express');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const session = require('express-session')
const userRoutes = require('./routes/users')
const myPageRoutes = require('./routes/mypage')
const apiMenuRoutes = require('./routes/apiRecipe')

require('dotenv').config()

app.use(express.urlencoded())

// app.use(express.static("css"))
// app.use(express.static("images"))

app.use('/css', express.static('CSS')) // static folder for css at localhost:3000/css/style.css
app.use('/images', express.static('images'))

// initialize the session 
app.use(session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true
}))

const PORT = process.env.PORT || 8080


app.engine('mustache',mustacheExpress())
app.set('views','./views')
app.set('view engine','mustache')

app.use('/',userRoutes)
app.use('/mypage',authenticate,myPageRoutes)
app.use('/apiMenu',authenticate,apiMenuRoutes)



// //authentication middleware
function authenticate(req, res, next) {
        if (req.session) {
            if (req.session.username) {
                //continue with client's original request
                next()
            } else {
                res.redirect('/login')
            }
        }
    }

app.listen(PORT,()=>{
    console.log('Server Is Running')
})