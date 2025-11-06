import { Router } from "express";
import Post from "../models/Post.js";
import auth from "../middleware/auth.js";

const r = Router();

// 🧩 Create Post (with optional image)
r.post("/", auth, async (req, res) => {
  try {
    const { text, imageUrl } = req.body;
    if (!text) return res.status(400).json({ error: "Text is required" });

    const p = await Post.create({
      userId: req.user.id,
      userName: req.user.name,
      text,
      imageUrl,
    });

    res.json(p);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Create failed" });
  }
});

// 🧩 Get All Posts (latest first)
r.get("/", async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
});

// 🧩 Like Post
r.post("/:id/like", auth, async (req, res) => {
  try {
    const p = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    res.json(p);
  } catch (err) {
    res.status(500).json({ error: "Like failed" });
  }
});

// 🧩 Add Comment
r.post("/:id/comment", auth, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "Comment text required" });

    const p = await Post.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          comments: { user: req.user.name, text },
        },
      },
      { new: true }
    );

    res.json(p);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Comment failed" });
  }
});

// 🧩 Delete Comment
r.delete("/:id/comment/:commentId", auth, async (req, res) => {
  try {
    const { id, commentId } = req.params;

    const p = await Post.findOneAndUpdate(
      { _id: id },
      { $pull: { comments: { _id: commentId, user: req.user.name } } },
      { new: true }
    );

    res.json(p);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Delete comment failed" });
  }
});

// Edit (Update) Comment
r.put("/:postId/comment/:commentId", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    comment.text = req.body.text || comment.text;
    await post.save();

    res.status(200).json({ message: "Comment updated", post });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});
// 🧩 Edit Post
r.put("/:id", auth, async (req, res) => {
  try {
    const { text } = req.body;
    const p = await Post.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { text },
      { new: true }
    );
    if (!p) return res.status(403).json({ error: "Not allowed" });
    res.json(p);
  } catch (err) {
    res.status(500).json({ error: "Edit failed" });
  }
});

// 🧩 Delete Post
r.delete("/:id", auth, async (req, res) => {
  try {
    const p = await Post.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!p) return res.status(403).json({ error: "Not allowed" });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

export default r;
