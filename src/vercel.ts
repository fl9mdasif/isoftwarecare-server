import mongoose from 'mongoose';
import app from './app';
import config from './app/config';
import seedSuperAdmin from './app/db';

/**
 * Vercel serverless entry point.
 *
 * src/server.ts (used by `npm run dev` / `npm start`) is a traditional
 * always-on process: connect once, then app.listen(). Neither of those make
 * sense under Vercel's Node runtime — there is no persistent process, each
 * invocation gets a request handler call, and app.listen() binds a port
 * nothing is listening for. So this is a second, dedicated entry rather
 * than a branch inside server.ts.
 *
 * The connection is started here at module scope, not inside a handler
 * function. A serverless container keeps its module cache warm across
 * invocations, so this `mongoose.connect()` call runs once per cold start
 * and is reused by every warm invocation after that — not once per request.
 * Mongoose buffers model calls by default, so a request that lands while
 * the connection is still opening does not fail; it waits for the same
 * in-flight connection rather than racing it.
 */
mongoose
  .connect(config.database_url as string)
  .then(() => {
    console.log('Database connected successfully');
    return seedSuperAdmin();
  })
  .catch((err) => {
    // Nothing to fail loudly to here — this runs outside any request's
    // try/catch. Logging is what actually surfaces a bad DATABASE_URL in
    // Vercel's function logs instead of every request hanging silently.
    console.error('Database connection failed:', err);
  });

export default app;
