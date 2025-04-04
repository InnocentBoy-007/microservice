import express from 'express'
import cors from 'cors'

const app = express();
app.use(cors());
app.use(express.json());

// after the newDB is created which contains both the post and the comment, response the newDB to the frontend
const newDB = {};

app.post('/events', (req, res) => {
    const incomingBody = req.body.event;

    // event received from post successfully
    if (incomingBody.type === 'PostCreated') {
        const { postId, title } = incomingBody;
        newDB[postId] = { postId, title, comments: [] }; // keeping the comments empty for future use
        console.log("You just received a post created event!");
    };

    if (incomingBody.type === 'CommentCreated') {
        const {id, content, postId} = req.body.event;
        
        if(newDB[postId]) {
            newDB[postId].comments.push({commentId:id, content});
        } else {
            console.log("Post not found!");
        }
        console.log("You just received a comment created event!");
    };

    console.log(incomingBody);

    // new database after connecting post and comment
    console.log("New DB:", JSON.stringify(newDB, null, 2));

    res.send(newDB);
});

app.listen(9002, () => {
    console.log("Query server is running on port 9002");
})