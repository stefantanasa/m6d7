import express from "express";
import createHttpError from "http-errors";
import CommentsModel from "./schema.js";
import BlogsModel from "./schema.js";

const commentsRouter = express.Router();

commentsRouter.post("/", async (req, res, next) => {
  try {
    const newComment = new CommentsModel(req.body);
    const { _id } = await newComment.save();
    res.status(201).send({ _id });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

commentsRouter.get("/", async (req, res, next) => {
  try {
    const comments = await CommentsModel.find();
    res.send(comments);
  } catch (error) {
    next(error);
  }
});

commentsRouter.get("/:commentId", async (req, res, next) => {
  try {
    const commentId = req.params.commentId;

    const comment = await CommentsModel.findById(commentId);
    if (comment) {
      res.send(comment);
    } else {
      next(createHttpError(404, `comment with id ${commentId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

commentsRouter.put("/:commentId", async (req, res, next) => {
  try {
    const commentId = req.params.commentId;
    const updatedComment = await CommentsModel.findByIdAndUpdate(
      commentId,
      req.body,
      {
        new: true, // by default findByIdAndUpdate returns the record pre-modification, if you want to get back the newly updated record you should use the option new: true
      }
    );
    if (updatedComment) {
      res.send(updatedComment);
    } else {
      next(createHttpError(404, `Comment with id ${commentId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

commentsRouter.delete("/:commentId", async (req, res, next) => {
  try {
    const commentId = req.params.commentId;
    const deletedComment = await CommentsModel.findByIdAndDelete(commentId);
    if (deletedComment) {
      res.status(204).send();
    } else {
      next(createHttpError(404, `Comment with id ${commentId} not found!`));
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

export default commentsRouter;
