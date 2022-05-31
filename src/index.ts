import express from 'express';
import auth from './routes/auth';
import bodyParser from 'body-parser';
import sessions from 'express-session';
import IAuthSession from './interfaces/authSession';
import main from './routes/main';

const app = express();

app.use(bodyParser.json());

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
app.use('/', main);
app.use('/auth', auth)

app.listen(5000, () => {
    console.log('The application is listening on port 5000!');
})