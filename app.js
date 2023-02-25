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
require("./auth");

/*const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
};*/

app.get("/", (req, res) => {
  res.send('<a href="/auth/google"> Authenticate with Google </a>');
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get("/protected", (req, res) => {
  res.send("Hello");
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

/*app
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
});*/

mongodb.initDb((err) => {
  try {
    app.listen(port);
    console.log(`Connected to DB and listening on ${port}`);
  } catch (error) {
    console.log("Cannot connect to the database!", error);
  }
});
