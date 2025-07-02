require('dotenv').config();
const mongoose = require('mongoose');

const Category = require('../models/Category');

async function fixCategories() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🔗 Conectado ao MongoDB');

    // 1. Apagar entradas inválidas
    const result = await Category.deleteMany({ nome: null });
    console.log(`🧹 Categorias com nome null removidas: ${result.deletedCount}`);

    // 2. Remover índice antigo (caso necessário)
    try {
      await Category.collection.dropIndex('nome_1');
      console.log('📉 Índice nome_1 removido com sucesso');
    } catch (err) {
      if (err.codeName === 'IndexNotFound') {
        console.log('ℹ️ Índice nome_1 não existia');
      } else {
        throw err;
      }
    }

    // 3. Criar índice novo e único
    await Category.collection.createIndex({ nome: 1 }, { unique: true });
    console.log('✅ Índice nome_1 recriado como unique com sucesso');

    process.exit(0);
  } catch (err) {
    console.error('❌ Erro ao limpar/recriar índice:', err);
    process.exit(1);
  }
}

fixCategories();
