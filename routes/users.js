const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs');
const models = require('../models')

router.get('/register', (req,res) => {
    res.render('register')
})

router.get('/login', (req, res) => {
    res.render('login')
})

router.get('/', (req,res)=>{
    res.render('login')
})

router.get('/sign-out', (req,res) => {

    let signOut = req.session.destroy
    signOut

    res.redirect('login')
})

router.post('/register', async(req, res) => {
    const username = req.body.username
    const password = req.body.password
    const currentUser = await models.User.count({
        where: {
            user_name: username
            }
    }).then((user)=> {return user})
    if(currentUser){
        res.render('register', { message: 'Username has already taken!' })
    }else{
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(password, salt, function (err, hash) {
    
                if (password == '') {
                    res.render('register', { message: 'Must enter a password!' })
                }
    
                else if (err) {
                    res.redirect('register', { message: 'Error' })
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
    }
    

})

router.post('/guest-login', async(req,res) => {
    const username = 'Guest'
    const password = 'guest1'
    
    const returnUser = await models.User.findOne({
        where: {
            user_name: username
            }
    })


    bcrypt.compare(password, returnUser.password, function (err, result) {
        console.log(result)
        if (result) {
            if (req.session) {
                req.session.isAuthenticated = true
                req.session.username = username
                req.session.user_id = returnUser.id

                res.redirect('/mypage')
            } else {
                res.redirect('/error')
            }
        }
    }) 
})

router.post('/login', async(req, res) => {
    const username = req.body.username
    const password = req.body.password

    const returnUser = await models.User.findOne({
        where: {
            user_name: username
            }
    })

    bcrypt.compare(password, returnUser.password, function (err, result) {
        console.log(result)
        if (result) {
            if (req.session) {
                req.session.isAuthenticated = true
                req.session.username = username
                req.session.user_id = returnUser.id

                res.redirect('/mypage')
            } else {
                res.redirect('/error')
            }
        }
    }) 
})


 module.exports = router