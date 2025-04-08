import express from 'express'
import cors from 'cors'

const app = express();
app.use(cors());
app.use(express.json());

// after the newDB is created which contains both the post and the comment, response the newDB to the frontend
const newDB = {};

// quering the incoming post along with it's comments
app.post('/events', (req, res) => {
    const { event } = req.body;
    console.log("Incoming body--->", event);

    try {
        // event received from post successfully
        if (event.type === 'PostCreated') {
            const { postId, title } = event;
            newDB[postId] = { postId, title, comments: {} }; // keeping the comments empty for future use
        };

        if (event.type === 'CommentUpdated') {
            const { id, content, postId, status } = event;
            // const newEvent = {id, content, postId} // assigning the properties to a new variable

            // check if the post exist first
            if (newDB[postId]) {
                newDB[postId].comments[id] = { id, content, postId, status }; // if the post exist, add the comment
            } else {
                console.log("Post not found!");
            }

            console.log("New DB--->", newDB);
        };

        // new database after connecting post and comment
        // console.log("New DB:", JSON.stringify(newDB, null, 2));

        res.send({});
    } catch (error) {
        console.log(error);
    }
});

// route to fetch the queried post (+comments)
// http://localhost:9002/posts
app.get('/posts', (req, res) => {
    res.send({ newDB });
});

app.listen(9002, () => {
    console.log("Query server is running on port 9002");
})
