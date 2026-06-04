import {v2 as  cloudinary }    from "cloudinary";  
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();
 

    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDANARY_CLOUD_NAME,
        api_key: process.env.CLOUDANARY_API_KEY, 
        api_secret: process.env.CLOUDANARY_API_SECRET 
    })

// console.log("cloudinary config", cloudinary.config());
// console.log("cloudinary config cloud name", cloudinary.config().cloud_name);


const uploadImage = async (filepath)=>{
    try{
        if(!filepath) return null;
        const response = await cloudinary.uploader.upload(filepath, { resource_type: "auto" });

        // console.log("image upload successfully",response.url);
        if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
        return response;
    }
    catch(error){
        if (filepath && fs.existsSync(filepath)) fs.unlinkSync(filepath); // remove the local file from the server if exists
        console.log("failed to upload image on cloudinary", error);
        return null;
    }
}
export {uploadImage}