import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { checkDbConnection } from './config/database.js';
import dotenv from 'dotenv'
import { logger } from 'hono/logger';
import usersRouter from './routes/usersRouter.js'
import { handleErrorResponse } from './middlewares/error-handler-middleware.js';
import { DEFAULT_ERROR_MESSAGE } from './utils/errors.js';
import authRouter from './routes/authRouter.js';
import teamsRouter from './routes/teamsRouter.js';
import packagesRouter from './routes/packagesRouter.js';
import { jwt } from 'hono/jwt';
import { rateLimit } from './middlewares/rateLimitter.js';

dotenv.config()

const app = new Hono()

// * Middlewares
app.use(logger())
app.use(rateLimit({ maxRequests: 100, windowMs: 60000 }));

// * Jwt Authetication
app.use('/auth/me', jwt({ secret: process.env['JWT_SECRET']!}))
app.use('/teams/*', jwt({ secret: process.env['JWT_SECRET']!}))
app.use('/packages/*', jwt({ secret: process.env['JWT_SECRET']!}))

// * Routes
app.route('/users', usersRouter)
app.route('/auth', authRouter)
app.route('/teams', teamsRouter)
app.route('/packages', packagesRouter)

// * Error Middleware
app.onError((err, c) => {
  return handleErrorResponse(c, err, DEFAULT_ERROR_MESSAGE)
})

checkDbConnection().then(() => {
  const port = parseInt(process.env.SERVER_PORT!)
  console.log(`Server is running on http://localhost:${port}`);

  serve({
    fetch: app.fetch,
    port,
  });
}).catch((error) => {
  console.error('Server not started due to database connection failure:', error);
  process.exit(1);
});