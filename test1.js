// const express = require("express");
// const bcrypt = require("bcrypt");
// const { pool } = require("./dbConfig");
// const users = [];
// const passport = require("passport");
// const flash = require("express-flash");
// const session = require("express-session");
// const flash = require("flash");
// const app = express();
// const port = process.env.PORT || 4000;
// app.set("view engine", "ejs");
// app.use(express.urlencoded({ extended: false }));

// const initializePassport = require("./passportConfig");

// initializePassport(passport);

// app.use(
//   session({
//     // Key we want to keep secret which will encrypt all of our information
//     secret: process.env.SESSION_SECRET,
//     // Should we resave our session variables if nothing has changes which we dont
//     resave: false,
//     // Save empty value if there is no vaue which we do not want to do
//     saveUninitialized: false,
//   })
// );
// // Funtion inside passport which initializes passport
// // app.use(passport.initialize());
// // Store our variables to be persisted across the whole session. Works with app.use(Session) above
// app.use(passport.session());
// app.use(flash());

// app.get("/", function (req, res) {
//   res.render("index");
// });
// app.get("/register", checkAuthenticated, function (req, res) {
//   res.render("register");
// });
// app.get("/login", checkAuthenticated, function (req, res) {
//   res.render("login");
// });
// app.get("/map", function (req, res) {
//   res.render("map");
// });

// app.post(
//   "/login",
//   passport.authenticate("local", {
//     successRedirect: "/",
//     failureRedirect: "/login",
//     failureFlash: true,
//   })
// );

// function checkAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) {
//     return res.redirect("/");
//   }
//   next();
// }

// function checkNotAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) {
//     return next();
//   }
//   res.redirect("/login");
// }

// app.post("/register", async (req, res) => {
//   let errors = [];
//   const flag = false;
//   const hashedpassword = await bcrypt.hash(req.body.password, 10);
//   let { User, Email, password, password2 } = req.body;
//   const email = validateEmail(Email);
//   console.log(email);
//   if (email) {
//     pool.query(
//       `SELECT * FROM users
//               WHERE email = $1`,
//       [Email],
//       (err, results) => {
//         if (err) {
//           console.log(err);
//         }
//         console.log(results.rows);
//         if (results.rows.length > 0) {
//           errors.push({ message: "already registerd" });
//           res.render("register", { errors });
//         } else {
//           pool.query(
//             `INSERT INTO users (name, email, password)
//                           VALUES ($1, $2, $3)
//                           RETURNING id, password`,
//             [User, Email, hashedpassword],
//             (err, results) => {
//               if (err) {
//                 console.log(err);
//                 res.sendStatus(500);
//                 return;
//               }
//               // console.log(results.rows);
//               res.redirect("/login");
//             }
//           );
//         }
//       }
//     );
//   } else if (!User || !Email || !password || !password2) {
//     errors.push({ message: "Please enter all fields" });
//   } else if (password.length < 6) {
//     errors.push({ message: "Password must be at least 6 characters long" });
//   } else if (!email) {
//     errors.push({
//       message: "Please enter email in the corect way xxx@xxx.xxx",
//     });
//   } else if (password !== password2) {
//     errors.push({ message: "Passwords do not match" });
//   }

//   if (errors.length > 0) {
//     res.render("register", { errors });
//   }
//   console.log(errors);
//   errors.length = 0;
// });

// function validateEmail(Email) {
//   var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
//   return emailPattern.test(Email);
// }

// app.listen(port, () => {
//   console.log("listen on port " + port);
// });
