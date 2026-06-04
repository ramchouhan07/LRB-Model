import { asyncHandler } from "../utils/asyncHandler.js";
import { Shop } from "../models/shop.model.js";
import { uploadImage } from "../utils/cloudinary.js";






const createShops = asyncHandler(async (req, res)=>{





  const data = req.body;
  const shopImage = req.file.path
console.log("data from frontend", data)
console.log("file from frontend", req.file)

 
const {title, address,  description, city, pincode, category, openTime, closeTime} = req.body


if(!title){
    throw new Error("title is required")
}

if(!address){
    throw new Error("address is required")
}



if(!shopImage){
    throw new Error("shopimage is required")
}
const uploadshopImage = await uploadImage(shopImage)
if(!uploadshopImage){
    throw new Error("failed to upload shop image")
}

console.log("url", uploadshopImage.secure_url)


if(!description){
    throw new Error("description is required")
}
if(!city){
    throw new Error("city is required")
}
if(!pincode){
    throw new Error("pincode is required")
}
if(!category){
    throw new Error("category is required")
}
if(!openTime){
    throw new Error("opening time is required")
}
if(!closeTime){
    throw new Error("closeing time is required")
}


  const createShop = new Shop({
  title: req.body.title,
  address: req.body.address,
  description: req.body.description,
  city: req.body.city,
  pincode: req.body.pincode,
  category: req.body.category,
  openTime: req.body.openTime,
  closeTime: req.body.closeTime,
  shopImage: uploadshopImage.secure_url
});
  const saveShop = await createShop.save()



res.status(200).json({
  success:true,
  File: req.file,
  data: saveShop
})

})


export {createShops}