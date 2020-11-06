const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs');
const models = require('../models')

router.get('/', (req, res) => {
    models.Recipe.findAll({
        where: {
            user_id: req.session.user_id
            }
    })
    .then((recipes) =>{
        res.render('mypage', {recipes: recipes, user_id: req.session.user_id})
    })
})

router.get('/edit-recipe/:recipeId', async (req,res) => {
    const recipeId = req.params.recipeId
    const updateRecipe = models.Recipe.findOne({
        where: {
            id: recipeId
            }
    }).then(recipe=>{
        res.render('edit-recipe',recipe.dataValues)
    })
    
})

router.get('/add-recipe', (req,res) => {
    res.render('add-recipe')
})

router.get('/recipe-detail/:recipeId', (req,res) => {
    const recipeId = req.params.recipeId

    models.Recipe.findByPk(recipeId, {
    })
    .then((recipe) => {
        let ingredientList = recipe.dataValues.ingredients.split('.')
        let title = recipe.dataValues.title
        let picture =recipe.dataValues.picture
        let cook_time = recipe.dataValues.cook_time
        let course = recipe.dataValues.course
        let url = recipe.dataValues.url
        let instruction = recipe.dataValues.directions
        let notes = recipe.dataValues.notes
        let ingredientListObject = ingredientList.map((ingredient)=>{
            return {ingredient}
        })

        let recipeObject = {
            title:title,
            picture:picture,
            cook_time:cook_time,
            course:course,
            url:url,
            directions:instruction,
            notes:notes,
        }

        res.render('recipe-detail', {recipe:recipeObject, ingredients:ingredientListObject})
    })

})

router.get('/filter-course', (req,res) => {

    models.Recipe.findAll({
        // where: {
        //     user_id: req.session.user_id
        //     }
    })
    .then((recipes) =>{
        res.render('filter-course', {postFilter: recipes}) /*, user_id: req.session.user_id}*/
    })
})

router.post('/add-recipe', (req,res) => {

    const title = req.body.title
    const cook_time = req.body.cook_time
    const course = req.body.course
    const url = req.body.url
    const picture = req.body.picture
    const ingredients = req.body.ingredients
    const directions = req.body.directions
    const notes = req.body.notes
    const user_id = req.session.user_id
    
    //Building recipe object:
    
    let recipe = models.Recipe.build ({
        title: title,
        cook_time: cook_time,
        course: course,
        url: url,
        picture: picture,
        ingredients: ingredients,
        directions: directions,
        notes: notes,
        user_id: user_id      
    })
    // Saving recipe object to the Recipe Datsbase
    recipe.save().then((savedRecipe) => {
        res.redirect('/mypage')
    })
})

router.post('/delete-recipe',(req,res) => {
    const recipeId = req.body.recipeId

    models.Recipe.destroy ({
        where: {
            id: recipeId
        }
    }).then(deletedRecipe => {
        res.redirect('/mypage')
    })
})

router.post('/edit-recipe/:recipeId', (req,res) => {
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
        res.redirect('/mypage')
    })

})

router.post('/filter-course', (req,res) => {

    const course = req.body.course

    models.Recipe.findAll({
        where: {
            course: course,
            user_id: req.session.user_id
        }
    }).then((filteredRecipes) => {
        res.render('filter-course', {postFilter: filteredRecipes})
    })
})
module.exports = router