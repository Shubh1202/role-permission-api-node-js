const express = require("express")
const app = express()
const allRoutes = require("./routes/index")
const middleware = require("./middleware/error")

app.use(express.urlencoded({extended: true}))
app.use(express.json())



app.use('/api/v1', allRoutes)

app.use(middleware.apiNotFound)

app.use(middleware.manageError)

module.exports = app