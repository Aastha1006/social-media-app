import React, { useState, useEffect } from "react";
import axios from "axios";
import "./profile.css";

function Profile() {
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const name = localStorage.getItem("name");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUserData();
    fetchUserPosts();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await axios.get(
        `${
          process.env.REACT_APP_API_URL ||
          "https://social-media-app-hpdy.onrender.com"
        }/api/user/profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserData(res.data);
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const res = await axios.get(
        `${
          process.env.REACT_APP_API_URL ||
          "https://social-media-app-hpdy.onrender.com"
        }/api/posts`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const userPosts = res.data.filter((p) => p.userName === name);
      setPosts(userPosts);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="profile-wrapper">
      <div className="top-bar">
        <h2>My Profile </h2>
        <div className="top-buttons">
          <button onClick={() => (window.location.href = "/feed")}>
            Back to Feed
          </button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {userData ? (
        <div className="profile-info">
          <div className="info-card">
            <h3>{userData.name}</h3>
            <p>
              <strong>Email:</strong> {userData.email}
            </p>
            <p>
              <strong>Joined:</strong>{" "}
              {new Date(userData.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      ) : (
        <p className="loading-text">Loading profile...</p>
      )}

      <h3 className="posts-heading">Your Posts & Activities</h3>

      <div className="posts-section">
        {posts.length === 0 ? (
          <p className="no-posts">You haven't posted anything yet 🌱</p>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="post-card">
              <h4>{post.text}</h4>
              {post.imageUrl && (
                <img src={post.imageUrl} alt="Post" className="post-img" />
              )}
              <p className="post-date">
                {new Date(post.createdAt).toLocaleString()}
              </p>
              <div className="post-stats">
                ❤️ {post.likes || 0} Likes &nbsp; 💬{" "}
                {post.comments?.length || 0} Comments
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Profile;
