import express from 'express';
import 'dotenv/config';
import loginRoute from './routes/login.routes.js';
import registerRoute from './routes/register.routes.js';

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

// login route
app.use('/login', loginRoute);

// register route
app.use('/register', registerRoute);

// listener
app.listen(PORT, () => {
  console.log(`Server started on PORT ${PORT}.`);
});

export { app };
