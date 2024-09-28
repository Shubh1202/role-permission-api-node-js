const mongoose = require("mongoose");

/*
0 -> user
1 -> admin
2 -> subadmin
3 -> editor
*/
const roleSchema = new mongoose.Schema({
    role_name: {
        type: String,
        required: true
    },
    slug:{
        type: String,
        unique: true,
    },
    permissions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'permissions',
            required: true
        }
    ]
    // value: {
    //     type: Number,
    // },
},
{
    timestamps: true
})

roleSchema.pre("save", async function(next){
    this.role_name = this.role_name.toLocaleLowerCase()

    const slug = this.role_name.replace(/ /g,'-').toLocaleLowerCase()
    const isExist = await this.constructor.findOne({slug: slug})
    this.slug = slug

    if(isExist){
        let obj = {
            http_code: 400,
            message: 'Role is already exist'
        }

        throw obj
    }

    next()
})




module.exports = mongoose.model("roles", roleSchema, 'roles')