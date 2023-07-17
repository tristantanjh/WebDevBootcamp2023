//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
// const _ = require("lodash");
const mongoose = require("mongoose");
// const encrypt = require("mongoose-encryption"); <= encryption
// const md5 = require("md5"); <= hashing
// const bcrypt = require("bcryptjs"); // <= better hashing
// const saltRounds = 10;
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require("mongoose-findorcreate");

const app = express();

app.set('view engine', 'ejs');
mongoose.connect("mongodb://127.0.0.1:27017/userDB");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(session({
    secret: process.env.ENCRYPTION_KEY,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    googleId: String,
    secret: String
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);
// userSchema.plugin(encrypt, {secret: process.env.ENCRYPTION_KEY, encryptedFields: ["password"]});

const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, {
        id: user.id,
        username: user.username,
        picture: user.picture
      });
    });
});
passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user);
    });
});
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.route("/")
    .get((req, res) => {
        res.render("home");
    });

app.get("/auth/google",
    passport.authenticate("google", { scope: ["profile"] }));
  
app.get("/auth/google/secrets", 
    passport.authenticate("google", { failureRedirect: "/login" }),
    function(req, res) {
        res.redirect("/secrets");
    });

app.route("/secrets")
    .get((req, res) => {
        User.find({ "secret": { $ne: null } })
            .then((users) => {
                res.render("secrets", { usersWithSecrets: users} );
            });
    });

app.route("/submit")
    .get((req, res) => {
        if (req.isAuthenticated()) {
            res.render("submit");
        } else { 
            res.redirect("/login");
        }
    })
    .post((req, res) => {
        const secret = req.body.secret;
        User.findById(req.user.id)
            .then((user) => {
                if (user) {
                    user.secret = secret;
                    user.save();
                    res.redirect("/secrets");
                }
            });
    });

app.route("/login")
    .get((req, res) => {
        res.render("login");
    })
    .post((req, res) => {
        const user = new User({
            username: req.body.username,
            password: req.body.password
        });

        req.login(user, (err) => {
            if (err) {
                console.log(err);
                res.redirect("/login");
            } else {
                passport.authenticate("local")(req, res, () => {
                    res.redirect("/secrets");
                });
            }
        });
    });

app.route("/register")
    .get((req, res) => {
        res.render("register");
    })
    .post((req, res) => {
        User.register({username: req.body.username}, req.body.password, (err, user) => {
            if (err) {
                console.log(err);
                res.redirect("/register");
            } else {
                passport.authenticate("local")(req, res, () => {
                    res.redirect("/secrets");
                });
            }
        })
    });

app.route("/logout")
    .get((req, res) => {
        req.logout((err) => {
            console.log(err);
        });
        res.redirect("/");
    });


/* hashing using bcrypt */

// app.route("/login")
//     .get((req, res) => {
//         res.render("login");
//     })
//     .post((req, res) => {
//         const username = req.body.username;
//         const password = req.body.password;

//         User.findOne({email: username})
//             .then((foundUser) => {
//                 if (foundUser) {
//                     bcrypt.compare(password, foundUser.password, function(err, result) {
//                         if (result == true) {
//                             res.render("secrets");
//                         } else {
//                             console.log("Password incorrect.");
//                         }
//                     });
//                 } else {
//                     console.log("User not found.");
//                 }
//             })
//             .catch(error => {
//                 console.error('Error:' + error);
//             });
//     });

// app.route("/register")
//     .get((req, res) => {
//         res.render("register");
//     })
//     .post((req, res) => {
//         bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
//             const user = new User({
//                 email: req.body.username,
//                 password: hash
//             });
    
//             user.save()
//                 .then(() => res.render("secrets"))
//                 .catch(error => {
//                     console.error('Error:' + error);
//                 });
//         });
//     });


app.listen(3000, function() {
    console.log("Server started on port 3000");
  });
  