import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
        name: {
            type: String,
            require: true,
            trim: true,
            index: true
        },
        email: {
            requre: true,
            type: String,
            trim: true,
            unique: true,
            lowercase: true

        },
        fullName: {
            type: String,
            trim: true,
            requre: true,
            index: true
        },
        avtar: {
            type: String,  //cloudinary url
            trim: true,
            requre: true,
            index: true
        },
        coverImage: {
            type: String,  //cloudinary url

        },
        wathcHistry: {
            type: Schema.Types.ObjectId,
            ref: "Product"
        },
        password: {
            type: String,
            require: [true, "Please provide a password"],
        },
        refresqhToken: {
            type: String,
        }

    },
    { timeStapms: true })


userSchema.pre("save", async function (next) {
 if(!this.isModified("password"))    return next();
    this.password  = await  bcrypt.hash(this.password, 10);
    next();
  })

  userSchema.methods.isPasswordCorrect = async function(password){
 return await  bcrypt.compare(password, this.password)
  }
userSchema.methods.generateAccessToken = function(){
    jwt.sign(
        {
        _id: this.id,
        email: this.email,
        username: this.username,
        fullName: this.fullName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY 
        }
    )
}
 userSchema.methods.generateRefreshToken  = function(){
     jwt.sign(
        {
        _id: this.id,
        email: this.email,
        username: this.username,
        fullName: this.fullName,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )

 }
export const User  = mongoose.model("User", userSchema);