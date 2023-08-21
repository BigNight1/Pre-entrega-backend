import passport from "passport";
import userModel from "../dao/models/userSchema";
import GitHubStrategy from "passport-github2";

const initPassport = () => {
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientId: "Iv1.5e07bb792c8a3b76",
        clientSecret: "b76779a99cb40930302f4e6ff5a9a8cc31dfda44",
        callbackURL: "http://localhost:8080/api/session/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await userModel.findOne({ email: profile._json.email });
          if (!user) {
            let newUser = {
              first_name: profile._json.name,
              last_name: "",
              email: profile._json.email,
              age: "",
              password: "",
            };
            let result = await userModel.create(newUser);
            done(null, result);
          }else{
            done(null,user)
          }
        } catch (error) {
            return done(error)
        }
      }
    )
  );
};

passport.serializeUser((user,done)=>{
  done(null,user._id)
})

passport.deserializeUser(async(id,done)=>{
  let user = await userModel.findById(id)
})

export default initPassport;