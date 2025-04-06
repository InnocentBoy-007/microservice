import express from 'express';
import { randomBytes } from 'crypto';
import cors from 'cors'

const app = express();
app.use(cors());
app.use(express.json());

// global error handler
app.use((err, req, res, next) => {
    console.log(err);
});

const commentsByPostId = {};

// post method
app.post('/post/:id/comment', async (req, res) => {
    const commentId = randomBytes(4).toString('hex');
    const { content } = req.body;
    const postId = req.params.id;

    console.log("Content of comment-->", content);
    console.log("PostId--->", postId);

    commentsByPostId[postId] = [
        ...(commentsByPostId[postId] || []),
        { id: commentId, content }
    ];

    console.log("Successfully posted a comment!");

    // Send event to event-bus
    await fetch('http://localhost:9005/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            event: {
                type: 'CommentCreated',
                id: commentId,
                content,
                postId,
                status: 'pending'
            }
        }),
    });

    res.send(commentsByPostId[postId]);
});


// receives event from event-bus
app.post('/events', async(req, res) => {
    const incoming_body = req.body.event;
    if(incoming_body.type === 'CommentCreated') {
        const { id, postId, status, content } = incoming_body;
        console.log("Event received: ", incoming_body);
    
        /**
         * check if the status received from event is 'accepted' or 'rejected'
         * if it is rejected, delete the comment, else send new event to the event-bus with the new event, {type: CommentUpdated}
         */
        const comments = commentsByPostId[postId];
        const comment = comments.find(comment =>  comment.id === id); // return the comment that has the same id with the incoming comment id
        comment.status = status; // update the existing status with the incoming status
    
        await fetch('http://localhost:9005/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ event: { type: 'CommentUpdated', id, postId, status, content } })
        });
    }

    res.send({});
});


// business logic route with GET method
app.get('/post/:id/comment', (req, res) => {
    console.log("Successfully fetched all comments!");

    res.send(commentsByPostId[req.params.id] || []);
});

app.listen(9001, () => {
    console.log("Comments server is running on port 9001");
});
