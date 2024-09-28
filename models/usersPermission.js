const mongoose = require("mongoose")

/***
 Example: 
 user_id: objectid
 permissions: [
 {
      permission_name: 'users',
      permission_value: [0,1,2,3]
 },
 {
      permission_name: 'products',
      permission_value: [0,1,3]
 },
 {
      permission_name: 'orders',
      permission_value: [0,1]
 },
 ]
 
 */

const usersPermissionSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    permissions: [{
        permission_name: {
            type: String,
        },
        permission_value: [Number] //0-create, 1->read, 2-edit, 3->delete
    }]
}, {
    timestamps: true
})

module.exports = mongoose.model('usersPermission', usersPermissionSchema, 'usersPermission')