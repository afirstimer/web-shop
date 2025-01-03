import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import shopRoute from "./routes/shop.route.js";
import categoryRoute from "./routes/category.route.js";
import listingRoute from "./routes/listing.route.js";
import settingRoute from "./routes/setting.route.js";
import proxyRoute from "./routes/proxy.route.js";
import templateRoute from "./routes/template.route.js";

const app = express();

app.use(cors({
    origin: [process.env.CLIENT_URL, "https://www.amazon.com"],
    credentials: true,    
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/shops", shopRoute);
app.use("/api/categories", categoryRoute);
app.use("/api/listings", listingRoute);
app.use("/api/templates", templateRoute);
app.use("/api/settings", settingRoute);
app.use("/api/proxy", proxyRoute);

app.listen(8800, () => {
    console.log("Listening on port 8800");
}).on("error", (err) => {
    console.log(err);
}).catch((err) => {
    console.log(err);
});

