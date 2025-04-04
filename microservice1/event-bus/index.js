import express from 'express'
import cors from 'cors'

const app = express();
app.use(cors());
app.use(express.json());

// http://localhost:9005/events
app.post('/events', (req, res) => {
    const event = req.body;

    // emits events to this specific endpoint (posts server)
    fetch('http://localhost:9000/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event })
    });

    // emits events to this specific endpoint (comments server)
    fetch('http://localhost:9001/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event })
    });

    // emits events to this specifi endpoint (query server)
    fetch('http://localhost:9002/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event })
    });

    res.send({ status: 'Ok' });
});

app.listen(9005, () => {
    console.log("Event-bus is listening at port 9005");
});