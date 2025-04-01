import express from 'express';
import { randomBytes } from 'crypto';

const app = express();
app.use(express.json());

const commentsByPostId = {};

// post method
app.post('/post/:id/comment', (req, res) => {
    const commentId = randomBytes(4).toString('hex');
    const { content } = req.body;

    const comments = commentsByPostId[req.params.id] || [];
    comments.push({id: commentId, content});

    commentsByPostId[req.params.id] = comments;

    console.log("Successfully posted a comment!");
    

    res.send(commentsByPostId);
});

// get method
app.get('/post/:id/comment', (req, res) => {
    const comments = commentsByPostId[req.params.id] || [];
    console.log("Successfully fetched all comments!");

    res.send(commentsByPostId);
});

app.get('/', (req, res) => {
    res.send("welcome to comments server!");
});

app.listen(9001, () => {
    console.log("Comments server is running on port 9001");
});