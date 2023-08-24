import mongoose from "mongoose";

const githubUserSchema = new mongoose.Schema({
    accountId: String,
    name: String,
    provider: String,
})

const GithubUser = mongoose.model("GithubUser", githubUserSchema);

export default GithubUser