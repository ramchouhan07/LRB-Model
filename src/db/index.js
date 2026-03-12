import dotenv from "dotenv";
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";  
 dotenv.config({ path: "../.env" });

const connectDB =  async()=>{
        console.log("Connecting to database...")
       
    try{
           const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
            console.log(`connected to database successfully `);
    }
    catch (err){
        console.log("error AA GYA:", err);
        throw err;
        process.exit(1);        
    }   
}
export default connectDB;