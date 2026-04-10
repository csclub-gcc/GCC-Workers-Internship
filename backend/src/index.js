const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME || 'gccworkersinternship';
const FRONTEND_ORIGINS = (process.env.FRONTEND_ORIGINS || 'http://localhost:5173,http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

let mongoClient;
let mongoDb;

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || FRONTEND_ORIGINS.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
  }),
);
app.use(express.json());

app.get('/api/health', async (req, res) => {
  if (!mongoDb) {
    return res.status(503).json({ status: 'error', mongo: 'disconnected' });
  }

  try {
    await mongoDb.command({ ping: 1 });
    return res.json({ status: 'ok', mongo: 'connected' });
  } catch (error) {
    return res.status(503).json({
      status: 'error',
      mongo: 'disconnected',
      message: error.message,
    });
  }
});

async function connectToMongo() {
  if (!MONGO_URI) {
    console.warn('MongoDB disabled: Missing MONGO_URI in environment');
    return;
  }

  if (mongoClient) {
    await mongoClient.close().catch(() => {});
  }

  mongoClient = new MongoClient(MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
  });

  await mongoClient.connect();
  mongoDb = mongoClient.db(MONGO_DB_NAME);
  await mongoDb.command({ ping: 1 });
}

async function startServer() {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Allowed frontend origins: ${FRONTEND_ORIGINS.join(', ')}`);
  });

  try {
    await connectToMongo();
    console.log(`MongoDB connected to database "${mongoDb.databaseName}"`);
  } catch (error) {
    mongoDb = null;
    console.warn(`MongoDB unavailable at startup: ${error.message}`);
    console.warn('Backend will stay up for local dev. Reset the Atlas DB user password in MongoDB Atlas and update backend/.env.');
  }
}

startServer().catch((error) => {
  console.error('Failed to start server:', error.message);
  process.exit(1);
});

process.on('SIGINT', async () => {
  if (mongoClient) {
    await mongoClient.close().catch(() => {});
  }
  process.exit(0);
});
