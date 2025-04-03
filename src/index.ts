import cors from 'cors';
import express from 'express';

// Routes

import RAuth from './routes/auth.routes';
import RItem from './routes/item.routes';
import RList from './routes/list.routes';
import RUser from './routes/user.routes';

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/auth', RAuth);
app.use('/item', RItem);
app.use('/list', RList);
app.use('/user', RUser);

app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});