
import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const productSchema = new Schema(
    {
        productFile:{
            type:String,
            requre:true

        } ,
        image:{
            type:String,
            requre:true
        },
        title:{
            type:String,
            requre:true,
            trim:true,
            index:true  
        },
        description:{
            type:String,
            requre:true
       
        },views:{
            type:Number,
            default:0
        },
        idPublished:{
            type:Boolean,
            default:true
        },
        owner:{
            types:Schema.types.ObjectId,
            ref:"User",
            requre:true
        }


    },

    {
        timeStamps: true

    }
); 


const Product   = mongoose.model("Product",productSchema);