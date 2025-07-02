require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../models/Category');

async function limparCategoriasInvalidas() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado ao MongoDB');

    // 1. Remover categorias com nome: null
    const apagados = await Category.deleteMany({ nome: null });
    console.log(`🧹 Categorias removidas com nome: null => ${apagados.deletedCount}`);

    // 2. Remover índice antigo (se existir)
    const indexes = await Category.collection.indexes();
    const temIndiceNome = indexes.find(i => i.name === 'nome_1');

    if (temIndiceNome) {
      try {
        await Category.collection.dropIndex('nome_1');
        console.log('📉 Índice nome_1 removido com sucesso');
      } catch (err) {
        console.warn('⚠️ Erro ao tentar remover índice nome_1:', err.message);
      }
    }

    // 3. Recriar índice único corretamente
    await Category.collection.createIndex({ nome: 1 }, { unique: true });
    console.log('✅ Índice nome_1 recriado com sucesso como UNIQUE');

    process.exit(0);
  } catch (err) {
    console.error('❌ Erro ao limpar ou recriar índice:', err);
    process.exit(1);
  }
}

limparCategoriasInvalidas();
