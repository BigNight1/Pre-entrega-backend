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
        clientID: "Iv1.5e07bb792c8a3b76",
        clientSecret: "b76779a99cb40930302f4e6ff5a9a8cc31dfda44",
        callbackURL: "http://localhost:8080/api/session/github/callback",
      },
      async (accessToken, refreshToken, profile, cb) => {
        const existingUser = await GithubUserModel.findOne({
          accountId: profile.id,
          provider: "github",
        });
        if (!existingUser) {
          const newUser = new GithubUserModel({
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
    const user = await GithubUserModel.findById(id);
    done(null, user);
  } catch (error) {
    console.error("Deserialization Error:", error);
    done(error, null);
  }
});

export default initPassport;
