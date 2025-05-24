import { test } from 'node:test';
import assert from 'node:assert';
import { createApp } from '../dist/index.js';
import { fetchGarminData } from '../dist/garmin.js';
import http from 'node:http';
import { once } from 'node:events';

// Ensure environment variables are set for tests
process.env.GARMIN_EMAIL = 'user@example.com';
process.env.GARMIN_PASSWORD = 'secret';

test('fetchGarminData returns mock data', async () => {
  const data = await fetchGarminData();
  assert.ok(Array.isArray(data));
  assert.ok(data.length > 0);
});

test('GET /garmin/activities returns data', async () => {
  const app = createApp();
  const server = http.createServer(app);
  server.listen(0);
  await once(server, 'listening');
  const { port } = server.address();
  const res = await fetch(`http://localhost:${port}/garmin/activities`);
  const body = await res.json();
  assert.ok(Array.isArray(body));
  server.close();
});
