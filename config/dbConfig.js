const mongoose = require("mongoose")

module.exports.dbConnection = (async() => {
    try{
        const connectionString = process.env.CONNECTION_STRING
        const connection = await mongoose.connect(connectionString)

        if(!connection){
            throw `Database connection failed`
        }

        console.log(`Database connection strng is: ${connectionString}`)

    }catch(error){
        console.log(`Error inside Database connection: ${error}`)
        throw error
    }
})