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

app.use(express.urlencoded())

app.use(express.static("css"))
app.use(express.static("images"))

// initialize the session 
app.use(session({
    secret: 'USEASECUREKEYHERE',
    resave: false,
    saveUninitialized: true
}))
/*
// all routes going to /trips will be handled by tripsRouter 
app.use('/trips',authenticate,tripsRoutes)

app.get('/trips', authenticate, (req, res) => {
    res.render('trips', { allTrips: trips })
})
*/

app.engine('mustache',mustacheExpress())
app.set('views','./views')
app.set('view engine','mustache')


// app.get('/',async(req,res)=>{
//     const resultData = await axios.get('')
//     res.render('index')
// })


app.get('/register', (req, res) => {
    res.render('register')
})

app.get('/login', (req, res) => {
    console.log('login page')
    res.render('login')
})

app.get('/mypage', authenticate, (req, res) => {
    res.render('mypage')
    // res.render('trips', { allTrips: trips })
})

app.post('/register', async(req, res) => {
    const username = req.body.username
    const password = req.body.password

    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(password, salt, function (err, hash) {

            if (password == '') {
                res.render('/register', { message: 'Must enter a password!' })
            }

            if (err) {
                res.redirect('/register', { message: 'Error' })
            } else {
                let user =
                models.User.build ({
                    user_name: username,
                    password: hash,
                })
                user.save().then((savedUser) => {
                    res.render('confirmRegister', savedUser.dataValues)
                }).catch((error) => {
                    res.render('error')
                })

            }

        })
    })

})

app.post('/login', async(req, res) => {
    const username = req.body.username
    const password = req.body.password
    console.log(username, password)

    const returnUser = await models.User.findAll({
        where: {
            user_name: username
            }
    })
    console.log(returnUser)


    bcrypt.compare(password, returnUser[0].password, function (err, result) {
        console.log(result)
        if (result) {
            if (req.session) {
                req.session.isAuthenticated = true
                req.session.username = username

                res.redirect('/mypage')
            } else {
                res.redirect('/error')
            }
        }
    }) 
})


// //authentication middleware
function authenticate(req, res, next) {
    console.log('authenticate')
        if (req.session) {
            if (req.session.username) {
                //continue with client's original request
                next()
            } else {
                res.redirect('/login')
            }
        }
    }



app.listen(3000,()=>{
    console.log('Server Is Running')
})