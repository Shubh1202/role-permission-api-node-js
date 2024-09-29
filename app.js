const express = require("express")
const app = express()
const allRoutes = require("./routes/index")
const middleware = require("./middleware/error")
const seeder = require("./seeder/seeder")

app.use(express.urlencoded({extended: true}))
app.use(express.json())



app.use(process.env.API_VERSION, allRoutes)

app.use(middleware.apiNotFound)

app.use(middleware.manageError)

module.exports = app