require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../models/Category');

async function corrigirCategorias() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🔗 Conectado ao MongoDB');

    // 1. Apagar documentos que têm 'name' no lugar de 'nome'
    const apagados = await Category.deleteMany({ name: { $exists: true } });
    console.log(`🧹 Categorias com campo errado 'name': ${apagados.deletedCount} apagadas`);

    // 2. Apagar documentos com nome: null
    const nulos = await Category.deleteMany({ nome: null });
    console.log(`🧹 Categorias com nome: null removidas: ${nulos.deletedCount}`);

    // 3. Dropar todos os índices antigos
    await Category.collection.dropIndexes();
    console.log('📉 Todos os índices antigos removidos');

    // 4. Recriar índice correto em 'nome'
    await Category.collection.createIndex({ nome: 1 }, { unique: true });
    console.log('✅ Índice { nome: 1 } recriado com UNIQUE');

    console.log('🚀 Limpeza e correção finalizadas com sucesso!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Erro durante correção:', err);
    process.exit(1);
  }
}

corrigirCategorias();
