import express from 'express';
import { randomBytes } from 'crypto';
import cors from 'cors'

const app = express();
app.use(cors());
app.use(express.json());

// acts as a database
const posts = {};

app.use((err, req, res, next) => {
    console.log(err);
    
})

app.post('/posts', (req, res) => {
    const { title } = req.body;
    
    // generating random number for post id
    const postId = randomBytes(4).toString('hex');
    posts[postId] = {
        postId, title
    }
    res.send({posts});
});

// getting posts (GET)
app.get('/posts', (req, res) => {
    res.send(posts);
})

app.listen(9000, () => {
    console.log("Server is listening at port 9000");
});

