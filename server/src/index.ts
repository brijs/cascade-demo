import express from 'express';
import dotenv from 'dotenv';
import Constants from './constants';
import MedplumClientSingleton from './medplumClient';
import apiRouter from './routes/index';

dotenv.config();

const app = express();
app.use(express.json());

// Initialize the Medplum client singleton
const medplumClient = MedplumClientSingleton.getInstance();


app.get('/', (req, res) => {
    res.send('Cascade Demo API server!');
});

app.use('/api', apiRouter);


app.listen(Constants.PORT, () => {
    console.log(`Server running at http://localhost:${Constants.PORT}`);
});
