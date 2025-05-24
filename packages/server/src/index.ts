import express from 'express';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { fetchGarminData } from './garmin';
import { parseQuery } from './nlpAgent';
import { z } from 'zod';

async function handleQuery(query: string) {
  const intent = parseQuery(query);
  const activities = await fetchGarminData();

  if (intent.intent === 'steps' && intent.date) {
    const match = activities.find(a => a.date === intent.date);
    return { steps: match?.steps ?? null };
  }

  return { activities };
}

export function createApp() {
  const app = express();

  const mcp: any = new McpServer({ app } as any);

  // MCP tool to fetch Garmin data
  mcp.tool('garmin.activities', async () => {
    const activities = await fetchGarminData();
    return { content: [{ type: 'text', text: JSON.stringify(activities) }] };
  });

  // MCP tool that accepts a natural language query and returns Garmin data
  mcp.tool('garmin.query', { query: z.string().describe('Natural language query') }, async ({ query }: { query: string }) => {
    const result = await handleQuery(query);
    return { content: [{ type: 'text', text: JSON.stringify(result) }] };
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

  // REST endpoint to query Garmin data using natural language
  app.post('/garmin/query', express.json(), async (req, res) => {
    try {
      const { query } = req.body as { query: string };
      const result = await handleQuery(query);
      res.json(result);
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
