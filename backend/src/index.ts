import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import usersRoute from './router/users_routes.js';
import restroomRoutes from './router/restrooms_routes.js';
import { cors } from 'hono/cors';
import { drizzle } from "drizzle-orm/node-postgres";
import 'dotenv/config';
import { logger } from 'hono/logger';

const app = new Hono()

app.use('api/*', cors());

export const db = drizzle(process.env.DATABASE_URL!, {logger: true});

app.use(logger())
app.route("api/users", usersRoute);
app.route("api/restrooms", restroomRoutes);

serve({
  fetch: app.fetch,
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
