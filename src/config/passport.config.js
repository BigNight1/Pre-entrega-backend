import passport from "passport";
import GitHubStrategy from "passport-github2";
import GithubUserModel from "../dao/models/githubUserschema.js"; // Cambia el nombre de la variable
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const initPassport = () => {
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: process.env.clientID,
        clientSecret: process.env.clientSecret,
        callbackURL: "http://localhost:8080/api/session/githubcallback",
      },
      async (accessToken, refreshToken, profile, cb) => {
        // console.log("GitHub Profile:", profile);
        const githubUser = await GithubUserModel.findOne({
          accountId: profile.id,
          provider: "github",
        });
        if (!githubUser) {
          console.log("Adding new github user to DB...");
          const githubUser = new User({
            accountId: profile.id,
            name: profile.username,
            provider: profile.provider,
          });
          await githubUser.save();
          return db(null, profile);
        } else {
          console.log("Github user already exist in DB..");
          return cb(null, profile);
        }
      }
    )
  );
};

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  let user = await GithubUserModel.findById(id);
});

export default initPassport;
