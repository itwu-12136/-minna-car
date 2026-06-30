import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { apiRoutes } from './routes/api.js';
import { pageRoutes } from './routes/pages.js';

const app = new Hono();

app.use('*', cors());

// API routes
app.route('/api', apiRoutes);

// Page routes (HTML)
app.route('/', pageRoutes);

export default app;
