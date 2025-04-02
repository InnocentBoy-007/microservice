import express from 'express';
import { randomBytes } from 'crypto';
import cors from 'cors'

const app = express();
app.use(cors());
app.use(express.json());

const commentsByPostId = {};

// post method
app.post('/post/:id/comment', (req, res) => {
    const commentId = randomBytes(4).toString('hex');
    const { content } = req.body;

    const comments = commentsByPostId[req.params.id] || [];
    const newComment = { id: commentId, content }; // ✅ Fix: Use 'id' instead of 'commentId'
    comments.push(newComment);

    commentsByPostId[req.params.id] = comments;

    console.log("Successfully posted a comment!");

    res.send(newComment); // ✅ Fix: Send only the new comment
});


// get method
app.get('/post/:id/comment', (req, res) => {
    console.log("Successfully fetched all comments!");

    res.send(commentsByPostId[req.params.id] || []);
});

app.get('/', (req, res) => {
    res.send("welcome to comments server!");
});

app.listen(9001, () => {
    console.log("Comments server is running on port 9001");
});