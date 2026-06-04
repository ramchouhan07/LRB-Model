import mongoose, { Mongoose,Schema, Types } from "mongoose";

const shopSchema = new Schema({
    title:{
        type: String,
        required: true,
        trim: true,
        index: true
    },
    address:{
        type: String,
        required: true
    },
    owner:{
        type: Types.ObjectId,
        ref: "User",
       
    },
    shopImage:{
        type: String,
       requered: true
    },
    description:{
        type: String,
        required: true
    },
    city:{
        type: String,
        required: true
    },
    pincode:{
        type: Number,
        required: true
    },
    category:{
        type: String,
        required: true
    },
      products: {
    type: Array,
    default: [],
  },
    
    openTime:{
        type: String,
        required: true
    },
    closeTime:{
        type: String,
        required: true
    }
},
{
    timestamps: true
}
)

export const Shop =   mongoose.model("Shop", shopSchema)