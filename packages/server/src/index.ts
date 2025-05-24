import express from 'express';
import { McpServer } from '@modelcontextprotocol/sdk';

// Simple Express application that hosts an MCP server
const app = express();
const port = process.env.PORT || 3000;

// Attach MCP server to Express app
const mcp = new McpServer({ app });

// Log any context sent from the client
mcp.onContext((ctx: unknown) => {
  console.log('Received context:', ctx);
});

// Basic health check endpoint
app.get('/', (_req, res) => {
  res.send('ok');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
