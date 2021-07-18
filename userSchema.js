const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//sub schemas for account settings
const accountSettingsSchema = new Schema( {
    Name:{
        type:String
    },
    Value:{
        type:String
    },
    createdAt:{
        type:String
    },
    updatedAt:{
        type:String
    },
    Weight:{
        type:String
    }
} )

const UserSchema = new Schema( { 
        device_id:{
            type:String
        },
        firstName:{
            type:String,
            required:true
        },
        lastName:{
            type:String,
            required:true
        },
        displayName:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true
        },
        phoneNumber:{
            type:String,
            required:true
        },
        Birthday:{
            type:String,
            required:true
        },
        Password:{
            type:String,
            required:true
        },
        blockList_Places:{
            type:[String]
        },
        blockList_Users:{
            type:[String]
        },
        bookmarkList_Places:{
            type:[String]
        },
        vistedPlaces:{
            type:[String]
        },
        favoritesFood_Types:{
            type:[String]
        },
        favoritesDrink_Types:{
            type:[String]
        },
        favoritesPlace_Types:{
            type:[String]
        },
        accountSettings:[accountSettingsSchema],
        autologin:{
            type:String,
            default:"true"
        }
    }, 
    { 
     strict:false
    } 
)

module.exports = mongoose.model( 'UserModel', UserSchema, 'bam_Users' );