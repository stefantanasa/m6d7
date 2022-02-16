import mongoose from "mongoose";

const { Schema, model } = mongoose;

const blogSchema = new Schema(
  {
    category: { type: String, required: true },
    title: { type: String, required: true },
    cover: {
      type: String,
      default: "https://picsum.photos/200/300",
    },
    readTime: {
      value: { type: Number, required: true },
      unit: { type: String, default: "minutes" },
    },
    author: {
      name: { type: String, required: true },
      avatar: {
        type: String,
        required: true,
        default: "https://picsum.photos/200",
      },
    },
    content: { type: String, required: true },
    blogComments: [
      {
        text: { type: String, required: true },
        datePosted: { type: Date, default: Date.now() },
      },
    ],
  },
  { timestamps: true }
);
export default model("Blog", blogSchema);
