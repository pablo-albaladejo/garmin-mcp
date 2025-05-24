import express from 'express';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { fetchGarminData } from './garmin';

export function createApp() {
  const app = express();

  const mcp = new McpServer({ app });

  // MCP tool to fetch Garmin data
  mcp.tool('garmin.activities', async () => {
    const activities = await fetchGarminData();
    return { activities };
  });

  app.get('/', (_req, res) => {
    res.send('ok');
  });

  // REST endpoint to fetch Garmin data
  app.get('/garmin/activities', async (_req, res) => {
    try {
      const activities = await fetchGarminData();
      res.json(activities);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  return app;
}

if (require.main === module) {
  const port = process.env.PORT || 3000;
  const app = createApp();
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}
