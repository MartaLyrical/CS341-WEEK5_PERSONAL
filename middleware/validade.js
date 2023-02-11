const validator = require("../helpers/validate");

const saveMovie = (req, res, next) => {
  const validationRule = {
    movieTitle: "required|string",
    description: "required|string",
    director: "required|email",
    year: "required|integer",
    rate: "required|string",
  };
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: "Validation failed",
        data: err,
      });
    } else {
      next();
    }
  });
};

module.exports = {
  saveMovie,
};
