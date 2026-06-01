const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const scheduleRoutes = require('./routes/scheduleRoutes');
const messageRoutes = require("./routes/messageRoutes");

require('dotenv').config();

const app = express();

// Middleware
const allowedOrigins = [
    process.env.CLIENT_URL,
    "https://elitebarber-ruby.vercel.app",
    "http://localhost:5173"
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || process.env.NODE_ENV !== "production" || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        callback(new Error(`Acesso de CORS negado para a origem: ${origin}`));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express.json());

// Conexão com MongoDB
const URI = process.env.MONGO_URI;

mongoose.connect(URI)
    .then(() => console.log("MongoDB conectado"))
    .catch(err => console.error(err));

// Rotas
app.use('/api/schedules', scheduleRoutes);
app.use('/api/messages', messageRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
