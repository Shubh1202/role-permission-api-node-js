const jsonwebtoken = require('jsonwebtoken')
const userModel = require("../models/users")
const { jwtDecode }  = require("jwt-decode")

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

        const dbResponse = await userModel.findById(jwtResponse.id).populate({path: 'role', select: ['role_name', 'permissions', "-_id"], populate: ({path: 'permissions', select: ['slug', "-_id"]})})
    
        if(!dbResponse){
            obj = {
                http_code: 401,
                status: 'error',
                message: "Your token is invalid"
            }
            throw obj            
        }

        const methodObject = {
            create: 'POST',
            update: 'PUT',
            delete: 'DELETE',
            read: 'GET',
            "full-access": "full-access",
        }

        // console.log(`req method ==> `,req.method)
        console.log(`Logged in user ==> `,dbResponse)
        // console.log(`Logged in user Role ==> `,dbResponse?.role)
        // console.log(`Logged in user Permission ==> `,dbResponse?.role?.permissions)

        if(dbResponse.role?.role_name !== 'admin'){
            const permissions = dbResponse.role?.permissions?.map(data => methodObject[data?.slug])
            const hasPermission = permissions.find(prx => prx === req.method || prx === 'full-access')
            console.log(permissions)
            console.log(hasPermission)
            if(!hasPermission){
                obj = {
                    http_code: 401,
                    status: 'error',
                    message: "Access Forbidden: You don't have permission to access this resource"
                }
                throw obj      
            }
        }

        req.user = dbResponse

        next()

    }catch(error){
        return next(error)
    }
})



const authorizeRole = ((...role) => {
    return ((req, res, next) => {
        try{
            const isAuth = role.includes(req.user?.role?.role_name)
            let obj = {}

            if(!isAuth){
                obj = {
                    http_code: 401,
                    message: 'You are not authorized to access this resource.'
                }

                throw obj
            }

            const hasPermission = 

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