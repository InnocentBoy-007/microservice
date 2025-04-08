import express from 'express'
import cors from 'cors'

const app = express();
app.use(cors());
app.use(express.json());

// global error handler
app.use((err, req, res, next) => {
    console.log("Error: ", err);
});

const events = []; // stores the events

// http://localhost:9005/events
app.post('/events', (req, res) => {
    const event = req.body.event;
    events.push(event);
    console.log("Request body-->", event);
    console.log("Events--->", events);


    // posts server
    fetch("http://localhost:9000/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event })
    }).catch((err) => {
        console.log(err.message);
    });


    // comments server
    fetch("http://localhost:9001/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event })
    }).catch((err) => {
        console.log(err.message);
    });


    // query server
    fetch("http://localhost:9002/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event })
    }).catch((err) => {
        console.log("Fetching query service failed: ", err.message);
    });


    // moderation server
    fetch("http://localhost:9003/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event })
    }).catch((err) => {
        console.log(err.message);
    });

    res.send({});
});

// list of events created
// http://localhost:9005/events
app.get('/events', (req, res) => {
    res.send(events);
});

app.listen(9005, () => {
    console.log("Event-bus is listening at port 9005");
});
