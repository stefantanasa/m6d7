import mongoose from "mongoose";

const { Schema, model } = mongoose;

new postsAuthorsSchema = new Schema(
    {
        authorId: {type: Schema.Types.ObjectId, ref: "User", required: true },
        blogs: [{category: String, title: String, content: String, cover: String }]
    },
    {timestamps: true}
)
export default model('BlogPosts', postsAuthorsSchema )