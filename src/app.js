import express, { response } from "express";
import cors from "cors";
const app = express();
import {  upload } from "./middlewarse/multer.js";
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended: true, limit:"16kb"}))
app.use(express.static("public")    )

// import routs
// import{ userRouts} from "./routes/user.routs.js";
import userRouts from "./models/routes/user.routs.js"
import shopRouter from "./models/routes/shops.routs.js";
import { Shop } from "./models/shop.model.js";



app.use("/api/v1/user", userRouts); 
//http://localhost:8000/api/v1/user/
 
app.post("/signup",(req, res)=>{
    console.log("user data", req.body)
    console.log(req.body)
    res.json({message: "got the feeback"})
})


app.use('/api/v1/shops',shopRouter)




// send shops to fronend
app.get("/api/shops",   async (req, res)=>{
 try{
    
    const shop  = await Shop.find()
 res.json(shop )
}
    catch(error){
          console.error("Error fetching shops:", error);
            res.status(500)
    }
 
})

// app.post("/api/shops", (req, res) => {
//   const data = req.body;

//   console.log("Received from frontend:", data);

//   res.json({
//     message: "Data received successfully",
//     data
//   });
// });

export { app }; 


    