const path = require('path');
const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const authMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/auth');
const clientesRoutes = require('./routes/clientes');
const fidelidadRoutes = require('./routes/fidelidad');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', arquitectura: 'MVC + SOLID + patrones' });
});

app.use('/api/auth', authRoutes);
app.use('/api/clientes', authMiddleware, clientesRoutes);
app.use('/api/fidelidad', authMiddleware, fidelidadRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
