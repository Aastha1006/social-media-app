import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Feed.css";

function Feed() {
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState("");
  const [commentText, setCommentText] = useState({});
  const [preview, setPreview] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState("");
  const name = localStorage.getItem("name");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get(
        "https://social-media-app-hpdy.onrender.com/api/posts"
      );
      setPosts(res.data);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    const file = document.getElementById("imgUpload").files[0];

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result;

      await fetch("https://social-media-app-hpdy.onrender.com/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          text,
          imageUrl: base64Image || "",
        }),
      });

      setText("");
      setPreview("");
      document.getElementById("imgUpload").value = "";
      fetchPosts();
    };

    if (file) reader.readAsDataURL(file);
    else reader.onloadend();
  };

  const handleLike = async (id) => {
    await axios.post(
      `https://social-media-app-hpdy.onrender.com/api/posts/${id}/like`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchPosts();
  };

  const handleComment = async (id) => {
    const text = commentText[id];
    if (!text) return;
    await axios.post(
      `https://social-media-app-hpdy.onrender.com/api/posts/${id}/comment`,
      { text },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setCommentText({ ...commentText, [id]: "" });
    fetchPosts();
  };

  const handleDeletePost = async (id) => {
    await axios.delete(
      `https://social-media-app-hpdy.onrender.com/api/posts/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    fetchPosts();
  };

  const handleDeleteComment = async (postId, commentId) => {
    await axios.delete(
      `http://localhost:8080/api/posts/${postId}/comment/${commentId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchPosts();
  };

  const handleSaveEdit = async (postId, commentId) => {
    if (!editText.trim()) return;
    await axios.put(
      `https://social-media-app-hpdy.onrender.com/api/posts/${postId}/comment/${commentId}`,
      { text: editText },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setEditingComment(null);
    setEditText("");
    fetchPosts();
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const handlePreview = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview("");
    }
  };

  return (
    <div className="feed-container">
      {/* Header */}
      <div className="header">
        <h2>Welcome to the Feed</h2>
        <div className="header-right">
          <button
            className="profile-btn"
            onClick={() => (window.location.href = "/profile")}
          >
            Profile
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <p className="loggedin">
        Logged in as <strong>{name}</strong>
      </p>

      {/* Post Input */}
      <form onSubmit={handlePost} className="post-form">
        <textarea
          rows="3"
          placeholder="Write something..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        ></textarea>
        <div className="file-post-section">
          <input
            type="file"
            id="imgUpload"
            accept="image/*"
            onChange={handlePreview}
          />
          <button type="submit" className="post-btn">
            Post
          </button>
        </div>

        {preview && (
          <div className="preview-container">
            <img src={preview} alt="preview" className="preview-img" />
          </div>
        )}
      </form>

      {/* Posts */}
      <div className="posts">
        {posts.map((p) => (
          <div className="post-card" key={p._id}>
            <p className="post-user">
              <strong>{p.userName}</strong>
            </p>
            <p className="post-text">{p.text}</p>

            {p.imageUrl && (
              <img src={p.imageUrl} alt="Post" className="post-image" />
            )}
            <small className="post-date">
              {new Date(p.createdAt).toLocaleString()}
            </small>

            <div className="like-delete">
              <button className="like-btn" onClick={() => handleLike(p._id)}>
                ❤️ Like ({p.likes || 0})
              </button>
              {p.userName === name && (
                <button
                  className="delete-btn"
                  onClick={() => handleDeletePost(p._id)}
                >
                  🗑️ Delete
                </button>
              )}
            </div>

            {/* Comments */}
            <div className="comment-section">
              <input
                type="text"
                placeholder="Add a comment..."
                value={commentText[p._id] || ""}
                onChange={(e) =>
                  setCommentText({ ...commentText, [p._id]: e.target.value })
                }
              />
              <button
                className="add-comment"
                onClick={() => handleComment(p._id)}
              >
                Add
              </button>

              <div className="comments">
                {p.comments?.map((c) => (
                  <div className="comment" key={c._id}>
                    {editingComment === c._id ? (
                      <>
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="edit-input"
                        />
                        <button
                          className="save-btn"
                          onClick={() => handleSaveEdit(p._id, c._id)}
                        >
                          💾
                        </button>
                        <button
                          className="cancel-btn"
                          onClick={() => setEditingComment(null)}
                        >
                          ❌
                        </button>
                      </>
                    ) : (
                      <>
                        <p>
                          <strong>{c.user}:</strong> {c.text}
                        </p>
                        {c.user === name && (
                          <div className="comment-actions">
                            <button
                              className="edit-btn"
                              onClick={() => {
                                setEditingComment(c._id);
                                setEditText(c.text);
                              }}
                            >
                              ✏️
                            </button>
                            <button
                              className="delete-comment"
                              onClick={() => handleDeleteComment(p._id, c._id)}
                            >
                              ❌
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Feed;
