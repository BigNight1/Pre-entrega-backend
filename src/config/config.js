import dotenv from "dotenv"

dotenv.config({ path: ".env" });


const CONFIG={
    port: process.env.port || 3015,
    DB_ECOMMERCE: process.env.DB_ECOMMERCE || "",
    clientID: process.env.clientID || "",
    clientSecret: process.env.clientSecret || "",
}

export default CONFIG