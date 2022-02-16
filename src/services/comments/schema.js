import mongoose from "mongoose";

const { Schema, model } = mongoose;

const commentSchema = new Schema(
  {
    text: { type: String, default: "No comment" },
  },
  { timestamps: true }
);

export default model("comment", commentSchema);
