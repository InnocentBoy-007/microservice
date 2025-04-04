import { useState, useEffect } from "react";

function App() {
  const [title, setTitle] = useState("");
  const [post, setPost] = useState([]);
  const [postLoading, setPostLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);

  // Comments
  const [comments, setComments] = useState({}); // Stores comments for each post
  const [commentInputs, setCommentInputs] = useState({}); // Stores input per post

  // Fetch all posts when the component loads
  useEffect(() => {
    PostsList();
  }, []);

  const PostsList = async () => {
    try {
      const response = await fetch("http://localhost:9000/posts", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }

      const data = await response.json();
      console.log("Fetched Posts:", data);

      setPost(Object.values(data)); // ✅ Convert object to array
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const PostCreate = async (e) => {
    e.preventDefault();
    setPostLoading(true);
    try {
      const response = await fetch("http://localhost:9000/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      setTitle(""); // ✅ Clear input field

      const newPost = await response.json();
      console.log("New Post Created:", newPost.post);

      setPost((prevPosts) => [...prevPosts, newPost.post]); // ✅ Append new post to state
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setPostLoading(false);
    }
  };

  const CommentCreate = async (postId) => {
    if (!commentInputs[postId]) return; // Prevent empty comments
    setCommentLoading(true);
    try {
      const response = await fetch(`http://localhost:9001/post/${postId}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: commentInputs[postId], postId }),
      });

      if (!response.ok) {
        throw new Error("Failed to create comment");
      }

      const newComment = await response.json(); // ✅ Fix: Await response.json()
      console.log("New Comment Created:", newComment);

      // ✅ Append new comment to the correct post
      setComments((prevComments) => ({
        ...prevComments,
        [postId]: [...(prevComments[postId] || []), newComment],
      }));

      // ✅ Clear input for this post only
      setCommentInputs((prevInputs) => ({
        ...prevInputs,
        [postId]: "", 
      }));

    } catch (error) {
      console.error("Error creating comment:", error);
    } finally {
      setCommentLoading(false);
    }
};


  return (
    <>
      <div>
        <h1>Create a Post</h1>
        <form onSubmit={PostCreate}>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <button type="submit" disabled={postLoading}>
            {postLoading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>

      <h2>All Posts</h2>
      {post.length > 0 ? (
        post.map((p) => (
          <div key={p.postId}>
            <h3>{p.title}</h3>
            <p>ID: {p.postId}</p>

            {/* Display comments for this post */}
            <h4>Comments:</h4>
            <ul>
              {comments[p.postId]?.map((comment) => (
                <li key={comment.commentId}>{comment.content}</li>
              )) || <p>No comments yet</p>}
            </ul>

            {/* Comment form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                CommentCreate(p.postId);
              }}
            >
              <p>Comment</p>
              <input
                type="text"
                value={commentInputs[p.postId] || ""}
                onChange={(e) =>
                  setCommentInputs({
                    ...commentInputs,
                    [p.postId]: e.target.value, // ✅ Only update for this post
                  })
                }
                required
              />
              <button type="submit" disabled={commentLoading}>
                {commentLoading ? "Commenting..." : "Comment"}
              </button>
            </form>
          </div>
        ))
      ) : (
        <p>No posts available</p>
      )}
    </>
  );
}

export default App;
