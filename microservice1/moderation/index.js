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
app.post('/events', async(req, res) => {
    /**
     * Check if the incoming 'content' contains the word 'Orange'.
     * If it has, remove/delete the 'content'
     * Else, update, 'status:'approved' with a new event, {type:'CommentModerated'} and send it back to event bus
     */
    const incoming_body = req.body.event;
    console.log("Incoming body -->", incoming_body);
    
    if (incoming_body.type === 'CommentCreated') {
        const { id, content, postId, status } = incoming_body;
        console.log("Old Incoming body--->", incoming_body);
        // checking if the 'content' has the word 'Orange' or 'orange' in it
        if (content.toLowerCase().includes("orange") ? status = 'rejected' : 'approved');
        // after updated
        console.log("New Incoming body--->", incoming_body);

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
