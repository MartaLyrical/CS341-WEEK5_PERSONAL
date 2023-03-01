const express = require("express");
const bodyParser = require("body-parser");
const mongodb = require("./db/connect");
const port = process.env.PORT || 8080;
const app = express();
const swaggerAutogen = require("swagger-autogen")();
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const passport = require("passport");
const { auth, requiresAuth } = require("express-openid-connect");
const session = require("express-session");
require("./auth");
require("dotenv").config();
const Movie = require("./helpers/validate");
const router = express.Router();
const mongoose = require("mongoose");

/*const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
};*/

mongodb.initDb((err) => {
  try {
    app.listen(port);
    console.log(`Connected to DB and listening on ${port}`);
  } catch (error) {
    console.log("Cannot connect to the database!", error);
  }
});

// establish a connection to the mongo database
/*mongoose.connect(
  process.env.MONGODB_URI,
  { useNewUrlParser: true },
  (err, res) => {
    if (err) {
      console.log("Connection failed: " + err);
    } else {
      console.log("Connected to database!");
    }
  }
);

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// req.isAuthenticated is provided from the auth router
app.get("/", (req, res) => {
  res.send(req.oidc.isAuthenticated() ? "Logged in" : "Logged out");
});

app.get("/profile", requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});

app.get("/movies", requiresAuth(), (req, res) => {
  console.log(req);
  Movie.find()
    .then((movies) => {
      res.status(200).json(movies);
    })
    .catch((err) => {
      res.status(500).json({ message: "An error occured", error: err });
    });
});*/

//app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

app.use(session({ secret: "movies", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send('<a href="/auth/google"> Authenticate with Google </a>');
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/protected",
    failureRedirect: "/auth/failure",
  })
);

app.get("/auth/failure", (req, res) => {
  res.send("Something went wrong. Please try again later...");
});

app.get("/protected", isLoggedIn, (req, res) => {
  res.send(
    'Welcome to Marta Movies  <a href="/api-docs"> Check the movies </a>'
  );
});

app.get("/logout", (req, res) => {
  req.logout();
  req.session.destroy();
  res.send("Goodbye!");
});

app.get("/auth/google/failure", (req, res) => {
  res.send("Failed to authenticate..");
});

// auth router attaches /login, /logout, and /callback routes to the baseURL
//app.use(auth(config));

// req.isAuthenticated is provided from the auth router
//app.get("/", (req, res) => {
// res.send(req.oidc.isAuthenticated() ? "Logged in" : "Logged out");
//});

//app.get("/profile", requiresAuth(), (req, res) => {
// res.send(JSON.stringify(req.oidc.user));
//});

app
  .use(
    "/api-docs",
    requiresAuth(),
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
  )
  .use(express.json())
  .use(bodyParser.json())
  .use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
  })
  .use("/", require("./routes"));
process.on("uncaughtException", (err, origin) => {
  console.log(
    process.stderr.fd,
    `Caught exception: ${err}\n` + `Exception origin: ${origin}`
  );
});
