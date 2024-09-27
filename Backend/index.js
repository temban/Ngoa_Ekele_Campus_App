import express, {json} from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import {dirname,join} from 'path';
import path from 'path';
import {fileURLToPath} from 'url';
import usersRouter from './routes/users-routes.js'
import authRouter from './routes/auth-routes.js'
import googleRouter from './routes/google.js'
import departmentRoutes from './routes/departments-routes.js';
import courseRoutes from './routes/course-routes.js'
import resultsRoutes from './routes/results-route.js'
import newsfeedRoutes from './routes/news-feed-routes.js'
import coursenotesRoutes from './routes/course-notes.js'


dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));


const app = express();
const PORT = process.env.PORT || 5000;
const corsOptions = {credentials:true, origin: process.env.URL || '*'};


app.use(cors(corsOptions));
app.use(json());
app.use(cookieParser());


app.use(cors({
  origin: '*', // Replace with your frontend URL
  credentials: true
}));

app.use('/NewsFeedImages', express.static(path.join(__dirname, 'routes/NewsFeedImages')));
app.use('/CourseNotes', express.static(path.join(__dirname, 'routes/CourseNotes')));
app.use('/ResultPDF', express.static(path.join(__dirname, 'routes/ResultPDF')));
app.use('/', express.static(join(__dirname, 'public')));

app.use('/', usersRouter)
app.use('/', authRouter)
app.use('/', googleRouter)
app.use('/', departmentRoutes)
app.use('/', courseRoutes)
app.use('/', resultsRoutes)
app.use('/', newsfeedRoutes)
app.use('/', coursenotesRoutes)

app.listen(PORT, ()=>console.log( `Server is listening on ${PORT}`));