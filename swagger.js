const swaggerAutogen = require("swagger-autogen")();
const doc = {
  info: {
    title: "Favorite Movies",
    description: "Marta Movies",
  },
  host: "cs341-week5.onrender.com",
  schemes: ["https"],
};

const outputFile = "./swagger.json";
const endpointsFiles = ["./routes/index.js"];

// generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc);
