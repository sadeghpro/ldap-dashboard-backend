import express from 'express';
import auth from './routes/auth';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json());

//Routes
app.use('/auth', auth)


app.get('/', (req, res) => {
    res.send('Well done!');
})

app.listen(5000, () => {
    console.log('The application is listening on port 5000!');
})