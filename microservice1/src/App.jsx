import React, { useState, useEffect } from "react";

export default function App() {
  const [title, setTitle] = useState("");
  const [posts, setPosts] = useState([]);
  const [commentContent, setCommentContent] = useState({});
  const [message, setMessage] = useState("");
  const [loadingStates, setLoadingStates] = useState({}); // Track loading state per post
  const [filteringMessage, setFilteringMessage] = useState("");

  const fetchPosts = async () => {
    try {
      const response = await fetch("http://localhost:9002/posts", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        setMessage("No posts available");
        return;
      }

      const data = await response.json();
      const fetchedPosts = Object.values(data.newDB);
      console.log(fetchedPosts);
      setPosts(fetchedPosts);
      setMessage(fetchedPosts.length === 0 ? "No posts available" : "");
    } catch (error) {
      console.log(error);
      setMessage("An error occurred while fetching posts.");
    }
  };

  const postService = async (e) => {
    e.preventDefault();
    try {
      console.log("Posting a post...");
      const response = await fetch("http://localhost:9000/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(errorMessage.message);
      }

      setTitle("");
      setTimeout(fetchPosts, 1000);
    } catch (error) {
      console.log(error);
    }
  };

  const postComment = async (e, postId) => {
    e.preventDefault();
    const content = commentContent[postId];
    if (!content) return;

    // Set loading state for this specific post
    setLoadingStates((prev) => ({ ...prev, [postId]: true }));

    try {
      const response = await fetch(
        `http://localhost:9001/post/${postId}/comment`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        }
      );

      if (!response.ok) {
        console.error("Failed to post comment");
      }

      const data = await response.json();
      setFilteringMessage(data.message);

      // Clear the comment input for this post
      setCommentContent((prev) => ({ ...prev, [postId]: "" }));

      // Refresh posts after a delay
      setTimeout(() => {
        fetchPosts().then(() => {
          // Reset loading state after fetch completes
          setLoadingStates((prev) => ({ ...prev, [postId]: false }));
        });
      }, 1000);
    } catch (error) {
      console.error(error);
      setLoadingStates((prev) => ({ ...prev, [postId]: false }));
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <>
      <div>
        <h1>'Orange' is not allowed in comment section</h1>
      </div>
      <form onSubmit={postService}>
        <h1>Posts</h1>
        <input
          type="text"
          id="title"
          value={title}
          placeholder="Enter your title here"
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit">Post</button>
      </form>
      <div>
        {posts.length > 0 ? (
          <div>
            {posts.map((data) => (
              <div key={data.postId}>
                <h1>{data.title}</h1>

                {/* Display comments */}
                {data.comments && (
                  <ul style={{ listStyle: "none", padding: 0 }}>
                    {Object.values(data.comments).map((comment) => (
                      <li
                        key={comment.id}
                        style={{
                          padding: "8px 0",
                          borderBottom: "1px solid #eee",
                          color:
                            comment.status === "rejected"
                              ? "#65676B"
                              : "inherit",
                          fontStyle: "normal",
                          fontSize: "14px",
                        }}
                      >
                        {comment.status === "rejected" ? (
                          <span style={{ color: "#65676B" }}>
                            <i>* Your comment has been deleted</i>
                          </span>
                        ) : (
                          comment.content
                        )}
                      </li>
                    ))}

                    {/* Loading message */}
                    {loadingStates[data.postId] && (
                      <li
                        style={{
                          padding: "8px 0",
                          color: "#65676B",
                          fontStyle: "italic",
                        }}
                      >
                        {filteringMessage}
                      </li>
                    )}
                  </ul>
                )}

                {/* Comment form */}
                <form
                  onSubmit={(e) => postComment(e, data.postId)}
                  style={{
                    paddingLeft: "2rem",
                  }}
                >
                  <input
                    type="text"
                    id={`comment-${data.postId}`}
                    value={commentContent[data.postId] || ""}
                    placeholder="Enter your comment here"
                    onChange={(e) =>
                      setCommentContent({
                        ...commentContent,
                        [data.postId]: e.target.value,
                      })
                    }
                    disabled={loadingStates[data.postId]}
                  />
                  <button type="submit" disabled={loadingStates[data.postId]}>
                    {loadingStates[data.postId] ? "Posting..." : "Comment"}
                  </button>
                </form>
              </div>
            ))}
          </div>
        ) : (
          <h1>{message}</h1>
        )}
      </div>
    </>
  );
}
