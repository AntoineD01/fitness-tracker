require('dotenv').config();
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.send('OK');
});

// Proxy /api/workouts to workout-service
app.use(
  '/api/workouts',
  createProxyMiddleware({
    target: 'http://workout-service:3000',
    changeOrigin: true,
    pathRewrite: {
      '^/api/workouts': '/workouts',
    },
  })
);

// Proxy /api/meals to nutrition-service
app.use(
  '/api/meals',
  createProxyMiddleware({
    target: 'http://nutrition-service:3000',
    changeOrigin: true,
    pathRewrite: {
      '^/api/meals': '/meals',
    },
  })
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));
