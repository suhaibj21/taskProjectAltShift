const express = require("express");
const passport = require("passport");
const initializePassport = require("./auth");
const bcrypt = require("bcrypt");
const { pool } = require("./dbConfig");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const users = [];

const app = express();

initializePassport(passport);
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

const port = process.env.PORT || 4000;
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.get("/", checkAuthenticated, function (req, res) {
  res.render("index", { name: req.user.name });
});
app.get("/register", checkNotAuthenticated, function (req, res) {
  res.render("register");
});
app.get("/login", checkNotAuthenticated, function (req, res) {
  res.render("login");
});
app.post;
app.delete("/logout", (req, res) => {
  req.logOut();
  res.redirect("/login");
});
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

app.post("/register", checkNotAuthenticated, async (req, res) => {
  let errors = [];
  const flag = false;
  const hashedpassword = await bcrypt.hash(req.body.password, 10);
  let { User, Email, password, password2 } = req.body;
  const email = validateEmail(Email);
  const user = isUserNameValid(User);
  if (email && user) {
    pool.query(
      `SELECT * FROM users
              WHERE email = $1`,
      [Email],
      (err, results) => {
        if (err) {
          console.log(err);
        }
        console.log(results.rows);
        if (results.rows.length > 0) {
          errors.push({ message: "already registerd" });
          res.render("register", { errors });
        } else {
          pool.query(
            `INSERT INTO users (name, email, password)
                          VALUES ($1, $2, $3)
                          RETURNING id, password`,
            [User, Email, hashedpassword],
            (err, results) => {
              if (err) {
                console.log(err);
                res.sendStatus(500);
                return;
              }
              // console.log(results.rows);
              res.redirect("/login");
            }
          );
        }
      }
    );
  }
  if (!User || !Email || !password || !password2) {
    errors.push({ message: "Please enter all fields" });
  } else if (password.length < 6) {
    errors.push({ message: "Password must be at least 6 characters long" });
  } else if (!email) {
    errors.push({
      message: "Please enter email in the corect way xxx@xxx.xxx",
    });
  } else if (password !== password2) {
    errors.push({ message: "Passwords do not match" });
  } else if (!user) {
    errors.push({ message: "Please enter the username in the correct way" });
  }
  if (errors.length > 0) {
    res.render("register", { errors });
  }
  console.log(errors);
  errors.length = 0;
});

function isUserNameValid(username) {
  console.log(username);

  const res = /^[a-zA-Z0-9_]{5,}[a-zA-Z]+[0-9]*$/.exec(username);
  const valid = !!res;
  return valid;
}
function validateEmail(Email) {
  var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailPattern.test(Email);
}

app.listen(port, () => {
  console.log("listen on port " + port);
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/login");
}
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

app.get("/map", function (req, res) {
  res.render("map");
});
app.post("/map", checkNotAuthenticated, function (req, res) {});
