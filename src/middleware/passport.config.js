import passport from "passport";
import GitHubStrategy from "passport-github2";
import dotenv from "dotenv";
import GithubUser from "../dao/models/githubuserSchema.js";


dotenv.config({ path: ".env" });

const initPassport = () => {
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: process.env.clientID,
        clientSecret: process.env.clientSecret,
        callbackURL: "https://backend-en-arreglo.onrender.com/api/session/github/callback",
      },
      async (accessToken, refreshToken, profile, cb) => {
        const existingUser = await GithubUser.findOne({
          accountId: profile.id,
          provider: "github",
        });
        if (!existingUser) {
          const newUser = new GithubUser({
            accountId: profile.id,
            name: profile.username,
            provider: profile.provider,
          });
          await newUser.save();
          return cb(null, newUser);
        } else {
          console.log("Github user already exist in DB..");
          return cb(null, existingUser);
        }
      }
    )
  );
};

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await GithubUser.findById(id);
    done(null, user);
  } catch (error) {
    console.error("Deserialization Error:", error);
    done(error, null);
  }
});

export default initPassport;

