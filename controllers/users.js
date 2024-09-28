const userModel = require("../models/users")
const roleModel = require("../models/roles")
const mongoose = require("mongoose")

const createUser = (async (req, res, next) => {
    try{
        const { name, email, password, role } = req.body

        let assignedRoles = role
        let obj = {}

        if(!assignedRoles || assignedRoles.length === 0){
            assignedRoles = await roleModel.findOne({slug:'user'}).select(["_id"])
            assignedRoles = assignedRoles._id
        }else{
            const validIds = mongoose.isValidObjectId(assignedRoles)
            if(!validIds){
                obj = {
                    http_code:400,
                    message: "Invalid roles"
                }
                throw obj
            }
            const rolesAreExist = await roleModel.find({slug: {$ne: 'admin'}, _id: {$in: assignedRoles} }).select(["_id", 'role_name'])
            if(rolesAreExist?.length === 0){
                obj = {
                    http_code:400,
                    message: "Invalid roles"
                }
                throw obj                
            }
        }

        const dbResponse = await new userModel({
            name,
            email,
            password,
            role: assignedRoles
        }).save()

        if(!dbResponse){
            obj = {
                http_code:400,
                message: "User cannot be created. try again later."
            }
            throw obj
        }

        obj = {
            http_code:400,
            message: "User successfully created",
            data: dbResponse
        }

        return res.send(obj)
    }catch(error){
        return next(error)
    }
})

const loginUser = (async(req, res, next) => {
    try{
        const { email, password } = req.body
        let obj = {}

        const dbResponse = await userModel.findOne({email}).select(['password'])

        if(!dbResponse){
            obj = {
                http_code: 400,
                message: `Enter valid login detail`
            }
            throw obj
        }

        const isPasswordMatch = await dbResponse.comparePassword(password)
        if(!isPasswordMatch){
            obj = {
                http_code: 400,
                message: `Enter valid login detail`
            }
            throw obj
        }

        const token = await dbResponse.generateToken()

        obj = {
            http_code: 200,
            message: `User successfully logedin`,
            token
        }

        return res.send(obj)
    }catch(error){
        return next(error)
    }
})

const listUsers = (async(req, res, next) => {
    try{
        let obj = {}
        const dbResponse = await userModel.find({})
        obj = {
            http_code: 200,
            message: `User successfully get`,
            data: dbResponse
        }

        return res.send(obj)

    }catch(error){
        return next(error)
    }
})

module.exports = {
    createUser,
    loginUser,
    listUsers
}