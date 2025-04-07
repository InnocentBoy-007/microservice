import express from 'express';
import { randomBytes } from 'crypto';
import cors from 'cors'

const app = express();
app.use(cors());
app.use(express.json());

// acts as a database
const posts = {};

// global error handler
app.use((err, req, res, next) => {
    console.log(err);
});

app.post('/posts', async (req, res) => {
    const { title } = req.body;

    // generating random number for post id
    const postId = randomBytes(4).toString('hex');
    posts[postId] = { postId, title };

    // sending an event to the event bus
    const response = await fetch('http://localhost:9005/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: { type: 'PostCreated', postId, title } })
    });
    console.log("Event is sent to event-bus!");

    if (response.ok) {
        const data = await response.json();
        res.send((data.posted) ? {posted: true} : {posted: false});
    } else {
        console.log("An error occured while trying to send event to the event-bus!");
    }
});

// endpoint to receive event from event-bus
app.post('/events', (req, res) => {
    console.log('Event received: ', req.body.event);
    return res.send({});
});

// getting posts (GET)
app.get('/posts', (req, res) => {
    res.send(posts);
})

app.listen(9000, () => {
    console.log("Server is listening at port 9000");
});
