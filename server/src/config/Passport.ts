import { profile } from "console";
import passport from "passport";
import passportGoogle from "passport-google-oauth20";
import { UserModel } from "../DB";

const GoogleStrategy = passportGoogle.Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL:
        "https://smartclip.duckdns.org/api/v1/users/google/redirect/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      const user = await UserModel.findOne({ googleId: profile.id });

      if (!user) {
        const newUser = await UserModel.create({
          googleId: profile.id,
          username: profile.displayName,
          email: profile.emails?.[0].value,
        });
        if (newUser) {
          done(null, newUser);
        }
      } else {
        done(null, user);
      }

      console.log("Profile from passport.js", profile);
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  const user = await UserModel.findById(id);
  done(null, user);
});
