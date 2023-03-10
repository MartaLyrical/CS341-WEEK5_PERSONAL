const mongodb = require("../db/connect");
const ObjectId = require("mongodb").ObjectId;

const getAll = async (req, res) => {
  try {
    const result = await mongodb
      .getDb()
      .db("movies")
      .collection("movies")
      .find();
    result.toArray().then((lists) => {
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(lists);
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

const getSingle = async (req, res) => {
  try {
    const movieId = new ObjectId(req.params.id);
    const result = await mongodb
      .getDb()
      .db("movies")
      .collection("movies")
      .find({ _id: movieId });
    result.toArray().then((lists) => {
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(lists[0]);
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

const createMovie = async (req, res) => {
  console.log("creating a new movie");
  const movie = {
    movieTitle: req.body.movieTitle,
    description: req.body.description,
    director: req.body.director,
    year: req.body.year,
    rate: req.body.rate,
  };
  const response = await mongodb
    .getDb()
    .db("movies")
    .collection("movies")
    .insertOne(movie);
  if (response.acknowledged) {
    res.status(201).json(response);
  } else {
    res.status(500).json(response.error || "Error, movie not created");
  }
};

const updateMovie = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json("Must use a valid Movie id to update a Movie.");
  }
  const movieId = new ObjectId(req.params.id);
  const movie = {
    movieTitle: req.body.movieTitle,
    description: req.body.description,
    director: req.body.director,
    year: req.body.year,
    rate: req.body.rate,
  };
  const response = await mongodb
    .getDb()
    .db("movies")
    .collection("movies")
    .replaceOne({ _id: movieId }, movie);
  console.log(response);
  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || "Error, movie was not updated.");
  }
};

const deleteMovie = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json("Must use a valid Movie id to delete a Movie.");
  }
  const movieId = new ObjectId(req.params.id);
  const response = await mongodb
    .getDb()
    .db("movies")
    .collection("movies")
    .deleteOne({ _id: movieId }, true);
  //.removeOne({ _id: movieId }, true);
  console.log(response);
  if (response.deletedCount > 0) {
    res.status(204).send();
  } else {
    res
      .status(500)
      .json(response.error || "Some error occurred while deleting the movie.");
  }
};

module.exports = {
  getAll,
  getSingle,
  createMovie,
  updateMovie,
  deleteMovie,
};
