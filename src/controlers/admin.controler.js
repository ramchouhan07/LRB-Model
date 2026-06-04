import { DB_NAME } from "../constants.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { upload } from "../middlewarse/multer.js";
import { uploadImage } from "../utils/cloudinary.js";
import { apiResponce } from "../utils/apiResponce.js";
import jwt from "jsonwebtoken"



const generateAcceessTokenAndRefreshToken = async (userId) => {


    try {
        const user = await User.findById(userId)
        const refreshToken = user.generateRefreshToken()
        const accessToken = user.generateAccessToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    }
    catch (error) {
        throw new apiError(500, "failed to generate access token and refresh token")
    }

}





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

    const { fullName, email, password } = req.body;
    if (fullName == "") {
        throw new apiError(400, "fullName is required");
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
        $or: [{ email }, { fullName }]
    })

    if (axistedUser) {
        throw new apiError(409, "user already exist with this email or username");
    }


    // const avatarLocalPath = req?.files?.avatar[0]?.path;
    // console.log("avatar local path", avatarLocalPath);


    // if (!avatarLocalPath) {
    //     throw new apiError(400, "avatar is required");
    // }




    // const avatarResponse = await uploadImage(avatarLocalPath);

    // if (!avatarResponse) {
    //     throw new apiError(500, "failed to upload avatar image");
    // }

    const user = await User.create({
        fullName,
        role: "user",
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

// login user
//  algo
//  req.body > Data
//  username or email 
//  find user 
//  password check 

const LoginUser = asyncHandler(async (req, res, next) => {
    const { email, password, fullName } = req.body;

    if (!email || !password) {
        throw new apiError(400, "email or username are required");
    }


    const user = await User.findOne({
        $or: [{ email },
        { fullName }
        ]
    })
    if (!user) {
        throw new apiError(404, "user does not exist");

    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new apiError(404, "password is incorrect");

    }
    const { accessToken, refreshToken } = await generateAcceessTokenAndRefreshToken(user._id)

    const logedInUser = await User.findById(user._id).
        select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }
    return res.status(200)
        .cookie('accessToken', accessToken, options)
        .cookie('refreshToken', refreshToken, options)
        .json(new apiResponce(200, { user: logedInUser, accessToken, refreshToken }, "user loged in successfully")
        )
})

// for now logout is skip 
// const logoutUser = asyncHandler(async(req,res,next)=>{
//     User.findById()
// })

const refreshAccessToken = asyncHandler(async (req, res, next) => {
    const { incomingRefreshToken } = req.cookies.refreshAccessToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new apiError(400, "refresh token is required")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
        const user = User.findById(decodedToken._id)
        if (!user) {
            throw new apiError(404, "invalid refresh token")
        }
        if (incomingRefreshToken !== user.refreshToken) {
            throw new apiError(400, "refresh token does not match")
        }

        const options = {
            httpOnly: true,
            secure: true
        }
        const { accessToken, newRefreshToken } = await generateAcceessTokenAndRefreshToken(user._id)

        return res.status(200)
            .cookie("refreshToken", newRefreshToken, options)
            .cookie("accessToken", accessToken, options)
            .json(new apiResponce(200,
                { accessToken, refreshToken: newRefreshToken },
                "access token refreshed successfully"))


    }
    catch (error) {
        throw new apiError(401, "invalid refresh token")
    }
})

const changeCurrentPassword = asyncHandler(async (req, res, next) => {
    const { oldpassword, newpassword } = req.body
    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await User.isPasswordCorrect(oldpassword)
    if (!isPasswordCorrect) {
        throw new apiError(400, 'password is incorrect')
    }

    user.password = newpassword
    await user.save({ validateBeforeSave: false })
    return res
        .status(200)
        .json(new apiResponce(200, 'password change successfully'))


})

const getCurrentUser = asyncHandler(async (req, res, next) => {
    return res
        .status(200)
        .json(new apiResponce(200, req.user, 'current user fetch successfully'))
})

const updateAccountDetails = asyncHandler(async (req, res, next) => {
    const { email, fullName } = req.body
    if (!email || !fullName) {
        throw new apiError(200, 'all fields are reqire')
    }
    const user = User.findByIdAndUpdate(
        req.body._id,
        {
            email,
            fullName
        },
        { new: true }
    ).select("-password")
    return res
        .status(200)
        .json(new apiResponce(200, 'account details updated successfully'))
})

const updateUserAvatar = asyncHandler(async (req, res, next) => {
    const avatarLocalPath = req.body
    if (!avatarLocalPath) {
        throw new apiError(400, 'Avatar file is missing')
    }

    const avatar = await uploadImage(avatarLocalPath)
    if (!avatar.url) {
        throw new apiError(400, 'Error while uploading')
    }

    findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        }
    )

})

const getUserChannelProfile = asyncHandler((req, res, next) => {
    const { fullName } = req.params
    if (!fullName) {
        throw new apiError(400, "fullname not found")
    }

})

export {
    registerUser,
    LoginUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    getUserChannelProfile
}
