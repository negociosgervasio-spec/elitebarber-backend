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
        const isVercelSubdomain = origin && origin.endsWith('.vercel.app');
        if (!origin || process.env.NODE_ENV !== "production" || allowedOrigins.includes(origin) || isVercelSubdomain) {
            return callback(null, true);
        }
        callback(new Error(`Acesso de CORS negado para a origem: ${origin}`));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express.json());

// Conexão com MongoDB
const URI = process.env.MONGO_URI || process.env.MONGO_URL;

if (!URI) {
    console.error('Erro: variável de ambiente MONGO_URI não definida. Defina a string de conexão MongoDB em Render ou no arquivo .env.');
    process.exit(1);
}

if (!URI.startsWith('mongodb://') && !URI.startsWith('mongodb+srv://')) {
    console.error('Erro: MONGO_URI inválido. A string de conexão deve começar com "mongodb://" ou "mongodb+srv://".');
    process.exit(1);
}

// Conecta com opções e log de diagnóstico mais detalhado
mongoose.connect(URI, {
    serverSelectionTimeoutMS: 10000
})
    .then(() => console.log("MongoDB conectado"))
    .catch(err => {
        console.error('Falha ao conectar ao MongoDB:', err.message);
        console.error(err.stack);
        console.error('\nDica: verifique se o IP deste servidor está liberado no MongoDB Atlas (Network Access → Add IP Address).');
        console.error('Para deploys em serviços como Render, permita temporariamente 0.0.0.0/0 ou configure as faixas de IP do provedor.');
        console.error('Também confirme que `MONGO_URI` contém usuário, senha e nome do banco, ex: mongodb+srv://user:pass@cluster0.mongodb.net/DBNAME?retryWrites=true&w=majority');
        process.exit(1);
    });

// Rotas
app.use('/api/schedules', scheduleRoutes);
app.use('/api/messages', messageRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
