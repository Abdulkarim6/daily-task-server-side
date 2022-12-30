const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

//middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.6ertblk.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);
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
            const email = req.query.email;
            const query = { email }
            const result = await myTaskCollection.find(query).toArray();
            res.send(result);

        });

        /*load data from server and check task status for ckient side Home page*/
        app.get('/checkTaskStatus', async (req, res) => {
            const email = req.query.email;
            const Completed = req.query.Completed;
            const query = { email }
            const myTasks = await myTaskCollection.find(query).toArray();

            const completedTask = myTasks.filter(myTask => {
                const completedTask = myTask.taskStatus === Completed;
                return completedTask;
            })
            const notCompletedTask = myTasks.filter(myTask => {
                const notCompletedTask = myTask.taskStatus !== Completed;
                return notCompletedTask;
            })
            res.send({ myTasks, completedTask, notCompletedTask });
        });
        /* check check check Home */


        /* task stutas update */
        app.put('/task/:id', async (req, res) => {
            const id = req.params.id;
            // console.log('134', id);
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    taskStatus: 'Completed'
                },
            };
            const result = await myTaskCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        });

        /* get completed tasks from database */
        app.get('/completeTasks', async (req, res) => {
            const email = req.query.email;
            // console.log(email,'56');
            const query = { email }
            const result = await myTaskCollection.find(query).toArray();
            res.send(result);
        });

        /* delete task from server */
        app.delete('/taskDeleteAction/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await myTaskCollection.deleteOne(query)
            res.send(result)
        })

        /* task un Complete action  */
        app.put('/taskUncompleteAction/:id', async (req, res) => {
            const id = req.params.id;
            console.log('134', id);
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    taskStatus: ''
                },
            };
            const result = await myTaskCollection.updateOne(filter, updateDoc, options);
            res.send(result);
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