import express from 'express';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import accountRoute from './routes/account.routes.js';
import loginRoute from './routes/login.routes.js';
import logoutRoute from './routes/logout.routes.js';
import registerRoute from './routes/register.routes.js';
import sessionRoute from './routes/session.routes.js';

const app = express();
const corsOrigin = process.env.CORS_ORIGIN ?? 'http://localhost:3000';

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  }),
);

app.use('/login', loginRoute);
app.use('/register', registerRoute);
app.use('/logout', logoutRoute);
app.use('/session', sessionRoute);
app.use('/account', accountRoute);

export { app };
