import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  // who posted
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userName: { type: String, required: true },

  // content
  text: { type: String, required: true },
  imageUrl: { type: String, default: "" },

  // interactions
  likes: { type: Number, default: 0 },
  comments: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
      user: String, // commenter name
      text: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],

  // timestamps
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Post", postSchema);
