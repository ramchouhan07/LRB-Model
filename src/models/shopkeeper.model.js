import mongoose, {Schema} from "mongoose";


const shopkeeperSchema   = new mongoose.Schema({
    shopkeeper:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    shop:{
         type: Schema.Types.ObjectId,
        ref: "User"
    }

},{timestamps})

export const shopkeeper = mongoose.model("shopkeeper", shopkeeperSchema)