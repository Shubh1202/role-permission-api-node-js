const mongoose = require("mongoose")

const permissionSchema = new mongoose.Schema({
    permission_name:{
        type: String,
        required: true,
        trim: true
    },
    slug:{
        type: String,
        // required: true,
        trim: true
    },
    description:{
        type: String,
    },
    is_default:{
        type: Number,
        enum: [0, 1], // 0 -> not default, 1 -> default (basically for Admin)
        default: 0
    }
},
{
    timestamps: true
})

permissionSchema.pre("save", async function(next){
    const slug = this.permission_name.replace(/ /g,'-').toLocaleLowerCase()
    const isExist = await this.constructor.findOne({slug: slug})
    this.slug = slug

    if(isExist){
        let obj = {
            http_code: 400,
            message: 'Permission is already exist'
        }

        throw obj
    }

    next()
})

module.exports = mongoose.model('permissions', permissionSchema, 'permissions')