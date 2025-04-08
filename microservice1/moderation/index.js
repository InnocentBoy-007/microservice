import express from 'express'
import cors from 'cors'

const app = express();

app.use(cors());
app.use(express.json());

// global error handler
app.use((err, req, res, next) => {
    console.log(err);
});


// listens events from event-bus
app.post('/events', async (req, res) => {
    /**
     * Check if the incoming 'content' contains the word 'Orange'.
     * If it has, remove/delete the 'content'
     * Else, update, 'status:'approved' with a new event, {type:'CommentModerated'} and send it back to event bus
     */
    let { id, content, postId, status, type } = req.body.event;
    console.log("Incoming body -->", req.body.event);

    if (type === 'CommentCreated') {
        // checking if the 'content' has the word 'Orange' or 'orange' in it
        status = content.toLowerCase().includes("orange") ? 'rejected' : 'approved';

        // after the comment is moderated/filtered, send the event to event-bus
        await fetch('http://localhost:9005/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ event: { type: 'CommentModerated', id, content, postId, status } }),
        });
    }

    res.send({});
});

app.listen(9003, () => {
    console.log("Moderation service is running on port 9003");
});
