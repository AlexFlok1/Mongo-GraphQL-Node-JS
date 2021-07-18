const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlaceSchema = new Schema( { 
    _id:{
        type: mongoose.ObjectId
    },
    Name:{
        type:String,
        required:true
    },
    Price:{
        type:String
    },
    Phone:{
        type:String
    },
    City:{
        type:String,
        required:true
    },
    State:{
        type:String,
        required:true
    },
    Address:{
        type:String,
        required:true
    },
    City:{
        type:String,
    },
    ZIP:{
        type:String,
    },
    Stars:{
        type:String,
    },
    Lat:{
        type:String
    },
    Lang:{
        type:String
    },
    location:{
        type:{
            type:String,
            enum: [ 'Point' ],
            required:true
        },
        coordinates:{
            type: [Number],
            required:true
        }
    },
    Categories: {
        type:String
    },
    Points: {
        type:Number,
        default: 0
    },
    'Open Time': {
        type: String
    }
 }, { 
     strict:false
  } 
)

module.exports = mongoose.model( 'PlaceModel', PlaceSchema, 'bam_Places' );