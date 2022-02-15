import mongoose from "mongoose"

const { Schema, model } = mongoose

const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    dateOfBirth: { type: Date, required: false },
    age: { type: Number, min: 18, max: 65, required: true },
    professions: [String],
  },
  {
    timestamps: true, // adds and manages automatically createdAt and updatedAt fields
  }
)

export default model("User", userSchema) // this model is now automatically linked to the "users" collection, if the collection is not there it will be automatically created
