const permissionModel = require("../models/permissions")

const createPermission = (async(req, res, next) => {
    try{
        let obj = {}
        const { permission_name, is_default, description } = req.body

        const dbResponse = await new permissionModel({
            permission_name,
            is_default,
            description
        }).save()

        if(!dbResponse){
            obj = {
                http_code: 400,
                message: 'Permission not created.'
            }
            throw obj
        }

        obj = {
            http_code: 200,
            message: 'Permission successfully created.',
            data: dbResponse
        }

        return res.send(obj)


    }catch(error){
        return next(error)
    }
})

const getPermission = (async(req, res, next)=>{
    try{
        let obj = {}

        const dbResponse = await  permissionModel.find({})

        if(!dbResponse){
            obj = {
                http_code: 400,
                message: 'Permission not found.'
            }
            throw obj
        }

        obj = {
            http_code: 200,
            message: 'Permission successfully fetched.',
            data: dbResponse
        }

        return res.send(obj)


    }catch(error){
        return next(error)
    }    
})

const deletePermission = (async(req, res, next)=>{
    try{
        const id = req.params.id
        let obj = {}

        const dbResponse = await  permissionModel.findByIdAndDelete(id)

        if(!dbResponse){
            obj = {
                http_code: 400,
                message: 'Permission not found for delete.'
            }
            throw obj
        }

        obj = {
            http_code: 200,
            message: 'Permission successfully deleted.',
        }

        return res.send(obj)


    }catch(error){
        return next(error)
    }    
})

const updatePermission = (async(req, res, next)=>{
    try{
        const id = req.params.id
        const { permission_name, is_default = 0} = req.body

        let obj = {}

        const dbResponse = await  permissionModel.findById(id)

        if(!dbResponse){
            obj = {
                http_code: 400,
                message: 'Permission not found for update.',
            }
            throw obj
        }

        dbResponse.permission_name = permission_name

        if(is_default)
        dbResponse.is_default = is_default

        const updateReponse = await dbResponse.save(
            {
                new: true,
                runValidators: true,
            }
        )

        obj = {
            http_code: 200,
            message: 'Permission successfully updated.',
            data: dbResponse
        }

        return res.send(obj)


    }catch(error){
        return next(error)
    }    
})


module.exports = {
    createPermission,
    getPermission,
    deletePermission,
    updatePermission
}