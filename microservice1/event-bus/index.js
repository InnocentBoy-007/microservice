import express from 'express'
import cors from 'cors'

const app = express();
app.use(cors());
app.use(express.json());

// global error handler
app.use((err, req, res, next) => {
    console.log(err);
});

// http://localhost:9005/events
app.post('/events', (req, res) => {
    const event = req.body.event;
    console.log("Request body-->", event);

    if (event.type === 'CommentCreated') {
        event.isForwarded = false;
        fetch('http://localhost:9003/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ event })
        });
    }

    // handles the moderated comment
    if (event.type === 'CommentModerated') {
        event.isForwarded = false;
        // emits events to this specific endpoint (comments server)
        fetch('http://localhost:9001/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ event })
        });
    };

    // after the comment is updated, send the comment to the query server
    if (event.type === 'CommentUpdated') {
        event.isForwarded = false;
        fetch('http://localhost:9002/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ event })
        });
    }

    // Only forward the original event, not events that are already forwarded
    // You might want to add a flag to check if this is an original event
    if (!event.isForwarded) {
        // Mark the event as forwarded
        const forwardedEvent = { ...event, isForwarded: true };

        // Forward to all services
        const services = [
            'http://localhost:9000/events',  // posts
            'http://localhost:9001/events',  // comments
            'http://localhost:9002/events'   // query
        ];

        services.forEach(url => {
            fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ event: forwardedEvent })
            });
        });
    }

    res.send({ status: 'Ok' });
});

app.listen(9005, () => {
    console.log("Event-bus is listening at port 9005");
});
