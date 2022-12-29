const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

//middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.6ertblk.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const myTaskCollection = client.db('dailyTask').collection('myTasks');

        /* added task to databese from client side */
        app.post('/addTask', async (req, res) => {
            const task = req.body;
            const result = await myTaskCollection.insertOne(task);
            res.send(result)
        });

        /* get myTasks from database and show client side */
        app.get('/myTasks', async (req, res) => {
            const query = {};
            const myTasks = await myTaskCollection.find(query).toArray();
            res.send(myTasks)
        });


    }
    finally {

    }
}
run().catch(err => console.error(err))



app.get('/', async (req, res) => {
    res.send('Daily Task server is running')
})

app.listen(port, () => {
    console.log(`Daily task server running on ${port}`);
})