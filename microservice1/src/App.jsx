import React, { useState, useEffect } from 'react'

export default function App() {
  const [title, setTitle] = useState('');
  const [posts, setPosts] = useState([]); // include objects inside an array

  const postService = async (e) => {
    e.preventDefault();
    try {
      console.log("First request!");
      const response1 = await fetch('http://localhost:9000/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
      });
      
      if(!response1.ok) {
        console.log("Error while posting a post!");
      }
      
      // if the first request is ok, move on to the next request to fetch a complete posts, that has an array of it's comments
      const data1 = await response1.json();
      if(data1.posted) {
        console.log("Post posted!");
        // if posted, moving on the 'GET' posts
        const response2 = await fetch('http://localhost:9002/posts', {
          method: 'GET',
          headers: {'Content-Type': 'application/json'}
        });

        if(response2.ok) {
          const data = await response2.json();
          console.log(data.newDB);
        }
      }

    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      <div>App</div>
      <form onSubmit={postService}>
        <h1>Posts</h1>
        <input type='text'
          id='title'
          value={title}
          placeholder='Enter your title here'
          onChange={(e) => setTitle(e.target.value)} />
        <button type='submit'>Post</button>
      </form>

    </>

  )
}
