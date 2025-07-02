require('dotenv').config();
const mongoose         = require('mongoose');
const express          = require('express');
const cors             = require('cors');
const productsRouter   = require('./routes/products');
const movementsRouter  = require('./routes/movements');
const categoryRoutes   = require('./routes/category');
const app              = express();


// 1) Middlewares padrão
app.use(cors());
app.use(express.json());

// 2) Front-end estático
app.use(express.static('public'));

// 3) Suas APIs
app.use('/api/products', productsRouter);
app.use('/api/movements', movementsRouter);
app.use('/categorias', categoryRoutes);

// 4) Conexão com MongoDB Atlas
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✔️ Conectado ao MongoDB Atlas!');
    const Product = require('./models/Product');
    console.log('🗃️ Modelo Product carregado:', !!Product);
  })
  .catch(err => console.error('❌ Erro ao conectar ao MongoDB:', err));

// 5) Rota de teste
app.get('/', (req, res) => {
  res.send('🚀 Backend do StockMaster rodando!');
});

// 6) Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando em http://0.0.0.0:${PORT}`);
});
