import express from 'express';
import driveRoutes from './routes/drive.js';
import teamRoutes from './routes/team.js';

const baseApiRoute = '/api/v1';

const app = express();

app.use(express.json());
app.use(baseApiRoute + '/drivers', driveRoutes);
app.use(baseApiRoute + '/teams', teamRoutes);

const port = 3000;
app.listen(port, () => {
  console.log(`API F1 rodando na url http://localhost:${port}`);
});
