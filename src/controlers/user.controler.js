import { DB_NAME } from "../constants.js";
import { asyncHandler } from "./../untils/asyncHandler.js";
import { apiError } from "../untils/apiError.js";
import { User } from "../models/user.model.js";
import { upload } from "../middlewarse/multer.js";
import { uploadImage } from "../untils/cloudinary.js";
import { apiResponce } from "../untils/apiResponce.js";


const registerUser = asyncHandler(async (req, res, next) => {

    // get user details from frontEnd
    // validation - not empty
    // check if user already exist - username or email
    // check for Image
    // upload them to cloudnary
    // create user object create entry in DB 
    // remove pass and refresh and token field from responce
    // check for user creation 
    // return responce  

    const { fullName, userName, email, password} = req.body;
    if (fullName == "") {
        throw new apiError(400, "fullName is required");
    }
    if (userName == "") {
        throw new apiError(400, "userName is required");
    }
    if (email == "") {
        throw new apiError(400, "email is required");
    }
    // const emailRegex = '/^[^\s@]+@[^\s@]+\.[^\s@]+$/';

    // if (!emailRegex.test(email)) {
    //     throw new apiError(400, "Invalid email format");
    // }
    if (password == "") {
        throw new apiError(400, "password is required");
    }


    //check user already exist
    const axistedUser = await User.findOne({
        $or: [{ email }, { userName }]
    })

    if (axistedUser) {
        throw new apiError(409, "user already exist with this email or username");
    }


    const avatarLocalPath = req?.files?.avatar[0]?.path;
    console.log("avatar local path", avatarLocalPath);
    const coverImageLocalPath = req?.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
        throw new apiError(400, "avatar is required");
    }
    if (!coverImageLocalPath) {
        throw new apiError(400, "cover image is required");
    }



    const avatarResponse = await uploadImage(avatarLocalPath);
    const coverImageResponse = await uploadImage(coverImageLocalPath);

    if (!avatarResponse) {
        throw new apiError(500, "failed to upload avatar image");
    }

    const user = await User.create({
        fullName,
        avatar: avatarResponse.url,
        coverImage: coverImageResponse?.url || "",
        userName,
        email,
        password

    })

//means user nhi bna he
    const createdUser = await User.findById(user._id).select("-password -refreshToken ")
    if (!createdUser) {
        throw new apiError(500, "something went wrong when creating user")
    }


    return res.status(201).json(
        new apiResponce(201, createdUser, "user created successfully")


    )

})


export { registerUser };


