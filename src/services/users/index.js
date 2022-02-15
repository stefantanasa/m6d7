import express from "express"
import createHttpError from "http-errors"
import UsersModel from "./schema.js"

const usersRouter = express.Router()

usersRouter.post("/", async (req, res, next) => {
  try {
    const newUser = new UsersModel(req.body) // here happens validation of req.body, if it is not ok Mongoose will throw an error (if it is ok user it is not saved in db yet)
    const { _id } = await newUser.save() // this is the line in which the interaction with Mongo happens (it is ASYNC!)
    res.status(201).send({ _id })
  } catch (error) {
    next(error)
  }
})

usersRouter.get("/", async (req, res, next) => {
  try {
    const users = await UsersModel.find()
    res.send(users)
  } catch (error) {
    next(error)
  }
})

usersRouter.get("/:userId", async (req, res, next) => {
  try {
    const userId = req.params.userId

    const user = await UsersModel.findById(userId)
    if (user) {
      res.send(user)
    } else {
      next(createHttpError(404, `User with id ${userId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

usersRouter.put("/:userId", async (req, res, next) => {
  try {
    const userId = req.params.userId
    const updatedUser = await UsersModel.findByIdAndUpdate(userId, req.body, {
      new: true, // by default findByIdAndUpdate returns the record pre-modification, if you want to get back the newly updated record you should use the option new: true
    })
    if (updatedUser) {
      res.send(updatedUser)
    } else {
      next(createHttpError(404, `User with id ${userId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

usersRouter.delete("/:userId", async (req, res, next) => {
  try {
    const userId = req.params.userId
    const deletedUser = await UsersModel.findByIdAndDelete(userId)
    if (deletedUser) {
      res.status(204).send()
    } else {
      next(createHttpError(404, `User with id ${userId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

export default usersRouter
