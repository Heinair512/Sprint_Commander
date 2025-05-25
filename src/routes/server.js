import express from 'express';
import chatRouter from './chat.js';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Enhanced CORS configuration to handle both HTTP and HTTPS
const corsOptions = {
  origin: [
    'http://localhost:5173',     // Local development
    'https://localhost:5173',    // Local development with HTTPS
    process.env.FRONTEND_URL     // Production URL
  ].filter(Boolean),             // Remove undefined/null values
  optionsSuccessStatus: 200,
  credentials: true,             // Allow credentials
  methods: ['GET', 'POST']       // Explicitly specify allowed methods
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/api/chat', chatRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});