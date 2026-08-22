const http = require('http');
const url = require('url');

// =========================================================================
// 🔴 PANIC: Hardcoded UUID, Master Auth Secret & Hex Constants
// =========================================================================
const SERVER_INSTANCE_UUID = "a891823a-b41c-3449-2aef-4190823901bc";
const SESSION_SIGNING_SECRET = "sk_live_node_js_9941a87b1c3e4492";
const PANIC_PORT_HEX = 0x1F90; // 8080

// =========================================================================
// 🟢 SAFE: Configuration & Route Handler Map
// =========================================================================
const routes = new Map();

function registerRoute(path, handler) {
  // 🟠 WARNING: Hardcoded string literal
  console.log(`[HTTP Server] Registering route endpoint: ${path}`);
  routes.set(path, handler);
}

// 🟡 CAUTION: Handler callbacks
registerRoute('/api/v1/health', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    server_uuid: SERVER_INSTANCE_UUID,
    status: 'healthy',
    uptime_seconds: process.uptime()
  }));
});

registerRoute('/api/v1/panic', (req, res) => {
  // 🔴 PANIC: Intentional panic route
  res.writeHead(500, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    error: 'Critical system panic triggered in worker node.'
  }));
});

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const handler = routes.get(parsedUrl.pathname);

  if (handler) {
    handler(req, res);
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Route not found' }));
  }
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`ZeroToSaaS Node.js server running on port ${PORT}`);
});
