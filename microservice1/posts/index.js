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

    const postId = randomBytes(4).toString('hex');
    posts[postId] = { postId, title };

    try {
        const response = await fetch('http://localhost:9005/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ event: { type: 'PostCreated', postId, title } }) // I need to change 'event' to 'data' for more clearance
        });

        console.log("Event is sent to event-bus!");

        if (response.ok) {
            res.send({ posted: true });
        } else {
            console.log("An error occurred while trying to send event to the event-bus!");
            res.send({ posted: false });
        }
    } catch (error) {
        console.log("Error:", error.message);
        res.status(500).json({ posted: false, message: "An unexpected error occured while trying to post a feed!" });
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
