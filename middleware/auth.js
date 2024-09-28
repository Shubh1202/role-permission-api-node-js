const jsonwebtoken = require('jsonwebtoken')
const userModel = require("../models/users")

const authUser = (async (req, res, next) => {
    try{
        let obj = {}
        let token = req?.headers?.authorization

        if(!token){
            obj = {
                http_code: 401,
                status: 'error',
                message: "Token is required to access this resource"
            }
            throw obj
        }

        const bearer = token.startsWith('Bearer')

        if(!bearer){
            obj = {
                http_code: 401,
                status: 'error',
                message: "Bearer token is required to access this resource"
            }
            throw obj
        }

        token = token.split(' ')[1]

        const jwtResponse = await jsonwebtoken.verify(
            token, 
            process.env.ACCESS_TOKEN_KEY, 
            {
                algorithm: process.env.ACCESS_TOKEN_ALGO
            }
        )

        const dbResponse = await userModel.findById(jwtResponse.id).populate('role', ['role_name', '-_id'])
        

        if(!dbResponse){
            obj = {
                http_code: 401,
                status: 'error',
                message: "Your token is invalid"
            }
            throw obj            
        }

        console.log(dbResponse)

        req.user = dbResponse

        next()

    }catch(error){
        return next(error)
    }
})



const authorizeRole = ((...role) => {
    return ((req, res, next) => {
        try{
            const isAuth = role.includes(req.user?.role[0]['role_name'])
            let obj = {}
            if(!isAuth){
                obj = {
                    http_code: 401,
                    message: 'You are not authorized to access this resource.'
                }

                throw obj
            }

            next()

        }catch(error){
            next(error)
        }
    })
})

module.exports = {
    authUser,
    authorizeRole
}