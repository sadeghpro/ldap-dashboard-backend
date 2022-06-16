import express from 'express';
import auth from './routes/auth';
import bodyParser from 'body-parser';
import sessions from 'express-session';
import IAuthSession from './interfaces/authSession';
import main from './routes/main';
import cors from 'cors';
import profile from './routes/profile';

const app = express();

app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

declare module 'express-session' {
    interface SessionData {
        auth: IAuthSession;
    }
}
//session middleware
app.use(sessions({
    secret: "P>jtd6A?no6Cfhj>&<&%6`DWqz9gH.`g",
    saveUninitialized: true,
    cookie: { maxAge: 1200 * 1000 },
    resave: false
}));



//Routes
app.use('/v1/', main);
app.use('/v1/auth', auth)
app.use('/v1/profile', profile);


// react
app.use(express.static('public'))
app.get('*', (req, res) => {
    res.sendFile(__dirname, 'public/index.html');
})


app.listen(5000, () => {
    console.log('The application is listening on port 5000!');
})