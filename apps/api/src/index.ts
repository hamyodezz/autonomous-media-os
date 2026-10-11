import Fastify from 'fastify';

const app = Fastify({ logger: true });

app.get('/health', async () => {
  return { ok: true, service: 'autonomous-media-os-api' };
});

app.get('/api/v1/ping', async () => {
  return { message: 'pong', timestamp: new Date().toISOString() };
});

const start = async () => {
  try {
    await app.listen({ port: 4000, host: '0.0.0.0' });
    console.log('API listening on http://localhost:4000');
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

start();
