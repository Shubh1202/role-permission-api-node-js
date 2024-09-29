const roleModel = require("../models/roles")

const createRole = (async(req, res, next) => {
    try{
        let obj = {}
        const { role_name, permissions } = req.body

        const dbResponse = await new roleModel({
            role_name,
            permissions
        }).save()

        if(!dbResponse){
            obj = {
                http_code: 400,
                message: 'Role not created.'
            }
            throw obj
        }

        obj = {
            http_code: 200,
            message: 'Role successfully created.',
            data: dbResponse
        }

        return res.send(obj)


    }catch(error){
        return next(error)
    }
})

const getRole = (async(req, res, next)=>{
    try{
        let obj = {}

        const dbResponse = await  roleModel.find({slug: {$ne: 'admin' }})

        if(!dbResponse){
            obj = {
                http_code: 400,
                message: 'Role not found.'
            }
            throw obj
        }

        obj = {
            http_code: 200,
            message: 'Role successfully fetched.',
            data: dbResponse
        }

        return res.send(obj)


    }catch(error){
        return next(error)
    }    
})

const deleteRole = (async(req, res, next)=>{
    try{
        const id = req.params.id
        let obj = {}

        const dbResponse = await  roleModel.findByIdAndDelete(id)

        if(!dbResponse){
            obj = {
                http_code: 400,
                message: 'Role not found for delete.'
            }
            throw obj
        }

        obj = {
            http_code: 200,
            message: 'Role successfully deleted.',
        }

        return res.send(obj)


    }catch(error){
        return next(error)
    }    
})

const updateRole = (async(req, res, next)=>{
    try{
        const id = req.params.id
        const { role_name, value = 0} = req.body

        let obj = {}

        const dbResponse = await  roleModel.findById(id)

        if(!dbResponse){
            obj = {
                http_code: 400,
                message: 'Role not found for update.',
            }
            throw obj
        }

        dbResponse.role_name = role_name

        if(value)
        dbResponse.value = value

        const updateReponse = await dbResponse.save(
            {
                new: true,
                runValidators: true,
            }
        )

        obj = {
            http_code: 200,
            message: 'Role successfully updated.',
            data: dbResponse
        }

        return res.send(obj)


    }catch(error){
        return next(error)
    }    
})


module.exports = {
    createRole,
    getRole,
    deleteRole,
    updateRole
}