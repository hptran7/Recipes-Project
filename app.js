const express = require('express')
const app= express()
const mustacheExpress = require('mustache-express')
const axios = require('axios')

app.use(express.urlencoded())

app.engine('mustache',mustacheExpress())
app.set('views','./views')
app.set('view engine','mustache')


app.get('/',async(req,res)=>{
    const resultData = await axios.get('https://api.edamam.com/search?q=chicken&app_id=28d11a29&app_key=0627b988aaf42dfa9db2bda0bf623c57&from=0&to=6&calories=591-722&health=alcohol-free')
    console.log(resultData.data.hits)
    res.render('index',{recipes:resultData.data.hits})
})


app.listen(3000,()=>{
    console.log('Server Is Running')
})