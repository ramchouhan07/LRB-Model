import express from "express";
import cors from "cors";
const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended: true, limit:"16kb"}))
app.use(express.static("public")    )

// import routs
import userRouts from "./routes/user.routs.js";
app.use("/api/v1/user", userRouts); 
//http://localhost:8000/api/v1/user/register

export { app }; 


