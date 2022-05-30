import express from 'express';

const app = express();

app.get('/', (req, res) => {
    res.send('Well done!');
})

app.listen(5000, () => {
    console.log('The application is listening on port 5000!');
})