const permissionsModel = require("../models/permissions")
const roleModel = require("../models/roles")

const executeSeeder = (async()=>{

    const isExistPermissions = await permissionsModel.countDocuments()
    if(isExistPermissions === 0){
        const arrayOfObject = [
            {
                permission_name: 'full access',
                slug: 'full-access',
                description: "Allows full access to resources",
            },
            {
                permission_name: 'create',
                slug: 'create',
                description: "Allows creating resources",
            },
            {
                permission_name: 'update',
                slug: 'update',
                description: "Allows updating resources",
            },
            {
                permission_name: 'read',
                slug: 'read',
                description: "Allows reading resources",
            },
            {
                permission_name: 'delete',
                slug: 'delete',
                description: "Allows deleting resources",
            },

        ]
        await permissionsModel.insertMany(arrayOfObject)
    }

    //Create Only Default User First Time Who have only read permission
    const isExistUserRole = await roleModel.countDocuments({slug:'user'})
    if(isExistUserRole === 0){
        const getReadPermission = await permissionsModel.findOne({slug:'read'}).select(["_id"])
        const object = {
            role_name: 'User',
            slug: 'user',
            permissions: getReadPermission?._id
        }
        await new roleModel(object).save()
    }

})()