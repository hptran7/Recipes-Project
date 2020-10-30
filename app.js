const express = require('express')
const app= express()
const mustacheExpress = require('mustache-express')
const axios = require('axios')

app.use(express.urlencoded())

app.engine('mustache',mustacheExpress())
app.set('views','./views')
app.set('view engine','mustache')


app.get('/',async(req,res)=>{
    const resultData = await axios.get('')
    res.render('index')
})


app.listen(3000,()=>{
    console.log('Server Is Running')
})