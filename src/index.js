

import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";



dotenv.config();

const PORT = process.env.PORT || 8000;

connectDB().
    then(() => {
       
        app.listen(PORT, () => {
            console.log(`app is listening on port ${PORT}`);
        }
        )}
    )
    .catch((err) => {
        console.log("Error connecting to database:", err);
        // process.exit(1);
    }
    )










/*
(async () => {
    try {
        await mongoose.connect(`${process.env.mongodbUri}/${DB_NAME}`)
        app.on("error", (error) => {
            console.log("app is not ready to connect to database", error);
            throw error;
        })
        app.listen(process.env.PORT,()=>{
            console.log(`app is listening on port ${process.env.PORT}`);    
        })
    }
    catch (err) {
        console.log("error:", err);
        throw err;
    }
})()
    */