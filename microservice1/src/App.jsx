import React, { useState, useEffect } from "react";

export default function App() {
  const [title, setTitle] = useState("");
  const [posts, setPosts] = useState([]); // include objects inside an array
  const [message, setMessage] = useState("");

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
      setPosts(fetchedPosts);
      setMessage(fetchedPosts.length === 0 ? "No posts available" : "");

      console.log(data.newDB);
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
      await fetchPosts();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <>
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
