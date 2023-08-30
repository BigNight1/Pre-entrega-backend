import passport from "passport";
import GitHubStrategy from "passport-github2";
import GithubUserModel from "../dao/models/githubUserschema.js";
import dotenv from "dotenv";
dotenv.config({
  path: ".env"
});
const initPassport = () => {
  passport.use("github", new GitHubStrategy({
    clientID: process.env.clientID,
    clientSecret: process.env.clientSecret,
    callbackURL: "http://localhost:8080/api/session/github/callback"
  }, async (accessToken, refreshToken, profile, cb) => {
    const existingUser = await GithubUserModel.findOne({
      accountId: profile.id,
      provider: "github"
    });
    if (!existingUser) {
      const newUser = new GithubUserModel({
        accountId: profile.id,
        name: profile.username,
        provider: profile.provider
      });
      await newUser.save();
      return cb(null, newUser);
    } else {
      console.log("Github user already exist in DB..");
      return cb(null, existingUser);
    }
  }));
};
passport.serializeUser((user, done) => {
  done(null, user._id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await GithubUserModel.findById(id);
    done(null, user);
  } catch (error) {
    console.error("Deserialization Error:", error);
    done(error, null);
  }
});
export default initPassport;