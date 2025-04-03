import express from 'express';
import { randomBytes } from 'crypto';
import cors from 'cors'

const app = express();
app.use(cors());
app.use(express.json());

// acts as a database
const posts = {};

app.use((err, req, res, next) => {
    console.log(err);
})

app.post('/posts', async (req, res) => {
    const { title } = req.body;

    // generating random number for post id
    const postId = randomBytes(4).toString('hex');
    posts[postId] = { postId, title };

    // sending an event to the event bus
    await fetch('http://localhost:9005/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'PostCreated', postId, title })
    });
    console.log("Event is sent to event-bus!");

    res.send({ posts });
});

// endpoint to receive event from event-bus
app.post('/events', (req, res) => {
    console.log('Event received: ', req.body.event);
    res.send({});
});

// getting posts (GET)
app.get('/posts', (req, res) => {
    res.send(posts);
})

app.listen(9000, () => {
    console.log("Server is listening at port 9000");
});

