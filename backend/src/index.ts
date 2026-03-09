import express from 'express';
import 'dotenv/config';
import loginRoute from './routes/login.routes.js';
import logoutRoute from './routes/logout.routes.js';
import registerRoute from './routes/register.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
);

// login route
app.use('/login', loginRoute);

// register route
app.use('/register', registerRoute);

// logout route
app.use('/logout', logoutRoute);

// listener
app.listen(PORT, () => {
  console.log(`Server started on PORT ${PORT}.`);
});

export { app };
