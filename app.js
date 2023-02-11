const express = require("express");
const bodyParser = require("body-parser");
const mongodb = require("./db/connect");
const path = require("path");

const port = process.env.PORT || 8080;
const app = express();
const swaggerAutogen = require("swagger-autogen")();
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

app
  .use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))
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

mongodb.initDb((err) => {
  try {
    app.listen(port);
    console.log(`Connected to DB and listening on ${port}`);
  } catch (error) {
    console.log("Cannot connect to the database!", error);
  }
});
