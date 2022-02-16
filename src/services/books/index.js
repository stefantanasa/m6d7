import express from "express";
import q2m from "query-to-mongo";
import BooksModel from "./schema.js";

const booksRouter = express.Router();

booksRouter.get("/", async (req, res, next) => {
  try {
    console.log("QUERY ", req.query);
    console.log("QUERY-TO-MONGO: ", q2m(req.query));
    const mongoQuery = q2m(req.query);
    const total = await BooksModel.countDocuments(mongoQuery.criteria);
    const books = await BooksModel.find(mongoQuery.criteria)
      .limit(mongoQuery.options.limit)
      .skip(mongoQuery.options.skip)
      .sort(mongoQuery.options.sort); // no matter in which order you call this options, Mongo will ALWAYS do SORT, SKIP, LIMIT in this order
    res.send({
      links: mongoQuery.links("/books", total),
      total,
      totalPages: Math.ceil(total / mongoQuery.options.limit),
      books,
    });
  } catch (error) {
    next(error);
  }
});

export default booksRouter;
