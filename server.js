const {API_HOST, API_VERSION, API_PORT} = require("dotenv").config({path: './config/.env'}).parsed
const { dbConnection } = require("./config/dbConfig")
const app = require("./app")

app.listen(API_PORT, (async(error) => {
    if(error){
        console.log(`Error in server starting: `, error)
        throw error
    }
    await dbConnection()
    const URL = `http://${API_HOST}:${API_PORT}`
    const apiUrl = `${URL}/${API_VERSION}`

    console.log(`Server url is: ${URL}`)
    console.log(`API Url is: ${apiUrl}`)
}))