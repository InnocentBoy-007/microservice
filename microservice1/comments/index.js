import express from 'express';
import { randomBytes } from 'crypto';
import cors from 'cors'

const app = express();
app.use(cors());
app.use(express.json());

const commentsByPostId = {};

// post method
app.post('/post/:id/comment', async (req, res) => {
    const commentId = randomBytes(4).toString('hex');
    const { content } = req.body;
    console.log("Content of comment-->", req.body);
    

    const comments = commentsByPostId[req.params.id] || [];
    const newComment = { id: commentId, content }; // ✅ Fix: Use 'id' instead of 'commentId'
    comments.push(newComment);

    commentsByPostId[req.params.id] = comments;

    console.log("Successfully posted a comment!");

    // an event is sent to event-bus
    await fetch('http://localhost:9005/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'CommentCreated', id: commentId, content, postId: req.params.id }),
    });
    console.log("Event triggered by comment! The postId--->", req.params.id);

    res.send(newComment); // ✅ Fix: Send only the new comment
});

// receives event from event-bus
app.post('/events', (req, res) => {
    console.log("Event received: ", req.body.event);
});


// business logic route with GET method
app.get('/post/:id/comment', (req, res) => {
    console.log("Successfully fetched all comments!");

    res.send(commentsByPostId[req.params.id] || []);
});

app.listen(9001, () => {
    console.log("Comments server is running on port 9001");
});