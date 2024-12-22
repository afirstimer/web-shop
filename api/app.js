import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import shopRoute from "./routes/shop.route.js";

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,    
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/shops", shopRoute);

app.listen(8800, () => {
    console.log("Listening on port 8800");
}).on("error", (err) => {
    console.log(err);
});
