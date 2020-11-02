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

*/

app.engine('mustache',mustacheExpress())
app.set('views','./views')
app.set('view engine','mustache')


app.get('/mypage', (req,res) => {
    models.Recipe.findAll()
    .then((recipes) =>{
        console.log(recipes)
        res.render('mypage', {recipes: recipes})
    })
})


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
    res.render('mypage', {recipes: recipes})
})

app.get('/edit-recipe/:recipeId', (req,res) => {
    const recipeId = req.params.recipeId
    console.log(recipeId)
    res.render('edit-recipe', {recipeId: recipeId})
})

/*

*/

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

app.get('/',async(req,res)=>{
    const resultData = await axios.get('https://api.spoonacular.com/recipes/complexSearch?query=pasta&number=16&apiKey=aeaea5163d2a46529d7c282344fc87d5')
    res.render('index',{recipes:resultData.data.results})
})

app.post('/recipe-search',async(req,res)=>{
    let recipeSearch = req.body.recipeSearch
    const resultData = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?query=${recipeSearch}&number=16&apiKey=aeaea5163d2a46529d7c282344fc87d5`)
    res.render('index',{recipes:resultData.data.results})
})

app.get('/:recipeid',async(req,res)=>{
    let recipeId = req.params.recipeid
    const recipeDetail = await axios.get(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=aeaea5163d2a46529d7c282344fc87d5&includeNutrition=true`)
    let extendedIngredientsDetail = recipeDetail.data.extendedIngredients
    let ingredients = extendedIngredientsDetail.map((ingredient)=>{
        return ingredient.originalString
    })
    let ingredientsString= ingredients.join(" ")
    const ingredientObject ={
        title:recipeDetail.data.title,
        image:recipeDetail.data.image,
        cooktime:recipeDetail.data.readyInMinutes,
        course:recipeDetail.data,
        ingredient:ingredientsString,
        instruction: recipeDetail.data.instructions
    }
    console.log(ingredientObject)
    res.render('recipeDetail',ingredientObject)
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

                res.redirect('/mypage' /*, { message2: `Welcome ${username}!` }*/)
            } else {
                res.redirect('/error' /*, { message: 'Username or password is incorrect' }*/)
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

app.post('/sign-out', (req,res) => {
    const signOutButton = req.body.signOutButton

    let signOut = req.session.destroy
    console.log(signOut)
    signOut

    res.redirect('login')
})

app.post('/add-recipe', async (req,res) => {

    const title = req.body.title
    const cook_time = req.body.cook_time
    const course = req.body.course
    const url = req.body.url
    const picture = req.body.picture
    const ingredients = req.body.ingredients
    const directions = req.body.directions
    const notes = req.body.notes
    // const user_id = req.body.user_id
    
    //Building recipe object:
    let recipe = await
    models.Recipe.build ({
        title: title,
        cook_time: cook_time,
        course: course,
        url: url,
        picture: picture,
        ingredients: ingredients,
        directions: directions,
        notes: notes,
        // user_id: user_id      
    })
    // Saving recipe object to the Recipe Datsbase
    await recipe.save().then((savedRecipe) => {
        console.log('saved')
        res.render('mypage', savedRecipe.dataValues)
    }).catch((error) => {
        res.render('error')
    })
})

app.post('/delete-recipe',(req,res) => {
    const recipeId = req.body.recipeId

    models.Recipe.destroy ({
        where: {
            id: recipeId
        }
    }).then(deletedRecipe => {
        console.log(deletedRecipe)
        res.redirect('/mypage')
    })
})

app.post('/edit-recipe', (req,res) => {
    const recipeId = req.body.recipeId

    const title = req.body.title
    const cook_time = req.body.cook_time
    const course = req.body.course
    const url = req.body.url
    const picture = req.body.picture
    const ingredients = req.body.ingredients
    const directions = req.body.directions
    const notes = req.body.notes

    models.Recipe.update({
        title: title,
        cook_time: cook_time,
        course: course,
        url: url,
        picture: picture,
        ingredients: ingredients,
        directions: directions,
        notes: notes,
    }, {
        where: {
            id: recipeId
        }
    }).then(updatedRecipe => {
        console.log(updatedRecipe)
        res.redirect('/mypage')
    })

})

/*

*/

app.listen(3000,()=>{
    console.log('Server Is Running')
})