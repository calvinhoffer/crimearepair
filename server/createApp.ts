import express from 'express';
import { submitLead } from './lead';

export function createApp() {
  const app = express();

  app.use(express.json());

  app.post('/api/lead', async (req, res) => {
    const result = await submitLead(req.body ?? {});
    res.status(result.ok ? 200 : 500).json(result);
  });

  return app;
}
