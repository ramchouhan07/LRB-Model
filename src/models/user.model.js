import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
       
         role: {
    type: String,
    enum: ["user", "shopkeeper"],
    required: true,
    default: "user"
  },
        email: {
            required: true,
            type: String,
            trim: true,
       
            
            lowercase: true

        },
          userName: {
            type: String,
            trim: true,
    
  },
           
        
        fullName: {
            type: String,
            trim: true,
            required: false,
            index: true
        },
        avatar: {
            type: String,  //cloudinary url
            trim: true,
            required: false,
            index: true
        },
     
     
        password: {
            type: String,
           required: function () {
    return this.role === "shopkeeper";
  },
        },
        refreshToken: {
            type: String,
        },
       otp: {
            type: String,
        },
        otpExpiry: {
            type: Date
        }

    },
    { timestamps: true })


userSchema.pre("save", async function (next) {
 if(!this.isModified("password"))    return next();
    this.password  = await  bcrypt.hash(this.password, 10);
    next();
  })

  userSchema.methods.isPasswordCorrect = async function(password){
 return   bcrypt.compare(password, this.password)
  }
userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
        _id: this.id,
        email: this.email,
        fullName: this.fullName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY 
        }
    )
}
 userSchema.methods.generateRefreshToken  = function(){
     return jwt.sign(
        {
        _id: this.id,
        email: this.email,
     
        fullName: this.fullName,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )

 }
export const User  = mongoose.model("User", userSchema);