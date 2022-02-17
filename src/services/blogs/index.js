import express from "express";
import createHttpError from "http-errors";
import BlogsModel from "./schema.js";
import CommentsModel from "../comments/schema.js";

const blogsRouter = express.Router();

blogsRouter.post("/", async (req, res, next) => {
  try {
    const newBlog = new BlogsModel(req.body); // here happens validation of req.body, if it is not ok Mongoose will throw an error (if it is ok user it is not saved in db yet)
    const { _id } = await newBlog.save(); // this is the line in which the interaction with Mongo happens (it is ASYNC!)
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

blogsRouter.get("/", async (req, res, next) => {
  try {
    const blogs = await BlogsModel.find();
    res.send(blogs);
  } catch (error) {
    next(error);
  }
});

blogsRouter.get("/:blogId", async (req, res, next) => {
  try {
    const blogId = req.params.blogId;

    const blog = await BlogsModel.findById(blogId);
    if (blog) {
      res.send(blog);
    } else {
      res.send(`Blog with id ${blogId} not found!`);
    }
  } catch (error) {
    console.log("this is the error: ", error);
    next(error);
  }
});

blogsRouter.put("/:blogId", async (req, res, next) => {
  try {
    const blogId = req.params.blogId;
    const updateBlog = await BlogsModel.findByIdAndUpdate(blogId, req.body, {
      new: true, // by default findByIdAndUpdate returns the record pre-modification, if you want to get back the newly updated record you should use the option new: true
    });
    if (updateBlog) {
      res.send(updateBlog);
    } else {
      next(createHttpError(404, `Blog with id ${blogId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.delete("/:blogId", async (req, res, next) => {
  try {
    const blogId = req.params.blogId;
    const deleteBlog = await BlogsModel.findByIdAndDelete(blogId);
    if (deleteBlog) {
      res.status(204).send();
    } else {
      next(createHttpError(404, `User with id ${blogId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.post("/:blogId/blogComment", async (req, res, next) => {
  try {
    const blogsComment = await CommentsModel.findById(req.body.commentId, {
      _id: 0,
    });
    if (blogsComment) {
      const commentToInsert = {
        ...blogsComment.toObject(),
      };
      const modifiedBlog = await BlogsModel.findByIdAndUpdate(
        req.params.blogId,
        { $push: { blogComments: commentToInsert } },
        { new: true }
      );
      if (modifiedBlog) {
        res.send(modifiedBlog);
      } else {
        next(
          createHttpError(404, `User with Id ${req.params.userId} not found!`)
        );
      }
    } else {
      next(
        createHttpError(404, `Blog with user ${req.params.blogId} not found`)
      );
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.get("/:blogId/blogComment", async (req, res, next) => {
  try {
    const blog = await BlogsModel.findById(req.params.blogId);
    if (blog) {
      res.send(blog.blogComments);
    } else {
      next(
        createHttpError(404, `blog with Id ${req.params.blogId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.get("/:blogId/blogComment/:commentId", async (req, res, next) => {
  try {
    const blog = await BlogsModel.findById(req.params.blogId);
    console.log("Comment id: ", blog._id.toString());
    if (blog) {
      const blogComment = blog.blogComments.find(
        (comment) => comment._id.toString() == req.params.commentId // You CANNOT compare a string (req.params.bookId) with an ObjectID (book._id) --> to compare the two things a solution could be to convert ObjectId into string
      );
      if (blogComment) {
        res.send(blogComment);
      } else {
        next(
          createHttpError(
            404,
            `The omment with Id ${req.params.commentId} not found in purchase history!`
          )
        );
      }
    } else {
      next(
        createHttpError(
          404,
          `Comment with Id ${req.params.commentId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

// blogsRouter.get("/:blogId/blogComment/:commentId", async (req, res, next) => {
//   try {
//     const blog = await BlogsModel.findById(() => req.params.blogId);

//     if (blog) {
//       const blogComment = blog.blogComments.findByIdAndDelete(
//         req.params.commentId
//       ); // You CANNOT compare a string (req.params.bookId) with an ObjectID (book._id) --> to compare the two things a solution could be to convert ObjectId into string
//       console.log(blogComment);
//       if (blogComment) {
//         res.send(blogComment);
//       } else {
//         next(
//           createHttpError(
//             404,
//             `The omment with Id ${req.params.commentId} not found in purchase history!`
//           )
//         );
//       }
//     } else {
//       next(
//         createHttpError(
//           404,
//           `Comment with Id ${req.params.commentId} not found!`
//         )
//       );
//     }
//   } catch (error) {
//     next(error);
//   }
// });

export default blogsRouter;
