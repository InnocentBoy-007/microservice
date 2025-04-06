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
app.post('/events', (req, res) => {
    /**
     * Check if the incoming 'content' contains the word 'Orange'.
     * If it has, remove/delete the 'content'
     * Else, update, 'status:'approved' with a new event, {type:'CommentModerated'} and send it back to event bus
     */
    const event = req.body.event;
    console.log("Old Incoming body--->", event);
    // checking if the 'content' has the word 'Orange' or 'orange' in it
    if (event.content.toLowerCase().includes("orange") ? event.status = 'rejected' : 'approved');
    // after updated
    console.log("New Incoming body--->", event);

    fetch('http://localhost:9005/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: { type: 'CommentModerated' } }),
    });

    res.send({ status: 'pending' });
});

app.listen(9003, () => {
    console.log("Moderation service is running on port 9003");
});
