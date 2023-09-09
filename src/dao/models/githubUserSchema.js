import mongoose from "mongoose";

const githubuserSchema = new mongoose.Schema({
    accountId: String,
    name: String,
    provider: String,
    role: { type: String, default: "user" },
})

const GithubUser = mongoose.model("GithubUser", githubuserSchema);

export default GithubUser