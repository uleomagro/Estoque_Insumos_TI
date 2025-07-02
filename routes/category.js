const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Product = require('../models/Product');

// GET /categorias – listar todas as categorias
router.get('/', async (req, res) => {
  try {
    const categorias = await Category.find();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar categorias' });
  }
});

// POST /categorias – criar nova categoria
router.post('/', async (req, res) => {
  console.log('📥 Body recebido:', req.body);

  const { nome, estoqueMinimo } = req.body;

  if (!nome || typeof nome !== 'string' || nome.trim() === '') {
    console.log('❌ Nome inválido:', nome);
    return res.status(400).json({ message: 'Nome da categoria é obrigatório' });
  }

  if (estoqueMinimo == null || isNaN(estoqueMinimo)) {
    console.log('❌ Estoque inválido:', estoqueMinimo);
    return res.status(400).json({ message: 'Estoque mínimo deve ser um número' });
  }

  try {
    const nomeFormatado = nome.trim().toLowerCase().replace(/^\w/, c => c.toUpperCase());

    const categoriaExistente = await Category.findOne({ nome: nomeFormatado });
    if (categoriaExistente) {
      console.log('⚠️ Categoria duplicada:', nomeFormatado);
      return res.status(400).json({ message: 'Categoria já existe' });
    }

    const novaCategoria = new Category({
      nome: nomeFormatado,
      estoqueMinimo: Number(estoqueMinimo)
    });
    console.log('🧪 Categoria antes de salvar:', novaCategoria);


    await novaCategoria.save();
    console.log('✅ Categoria salva:', novaCategoria);
    res.status(201).json(novaCategoria);
  } catch (error) {
    console.error('🔥 ERRO ao salvar categoria:', error);
    res.status(500).json({ message: 'Erro ao criar categoria' });
  }
});


// DELETE /categorias/:id – excluir uma categoria
router.delete('/:id', async (req, res) => {
  try {
    const categoria = await Category.findById(req.params.id);
    if (!categoria) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }

    // Verifica se existe algum produto usando essa categoria
    const produtosUsando = await Product.findOne({ category: categoria.nome });
    if (produtosUsando) {
      return res.status(400).json({
        message: 'Não é possível excluir: há produtos vinculados a esta categoria.'
      });
    }

    await categoria.deleteOne();
    res.json({ message: 'Categoria excluída com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir categoria' });
  }
});

// GET /sugestoes-compra – categorias abaixo do estoque mínimo
router.get('/sugestoes-compra', async (req, res) => {
  try {
    const categorias = await Category.find();
    const sugestoes = [];

    for (const categoria of categorias) {
      const produtos = await Product.find({
		  category: { $regex: new RegExp(`^${categoria.nome}$`, 'i') } // busca case-insensitive e exata
		});
      const totalEstoque = produtos.reduce((soma, p) => soma + (p.stock || 0), 0);

      if (totalEstoque < categoria.estoqueMinimo) {
        sugestoes.push({
          nome: categoria.nome,
          estoqueAtual: totalEstoque,
          estoqueMinimo: categoria.estoqueMinimo,
          precisaComprar: categoria.estoqueMinimo - totalEstoque
        });
      }
    }

    res.json(sugestoes);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao gerar sugestões de compra.' });
  }
});

// PUT /categorias/:id – atualizar categoria existente
router.put('/:id', async (req, res) => {
  const { nome, estoqueMinimo } = req.body;

  if (estoqueMinimo == null || isNaN(estoqueMinimo)) {
    return res.status(400).json({ message: 'Estoque mínimo deve ser um número' });
  }

  try {
    const categoria = await Category.findById(req.params.id);
    if (!categoria) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }

    // Atualiza os campos
    if (nome && typeof nome === 'string' && nome.trim() !== '') {
      categoria.nome = nome.trim().toLowerCase();
    }
    categoria.estoqueMinimo = Number(estoqueMinimo);

    await categoria.save();
    res.json(categoria);
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    res.status(500).json({ message: 'Erro ao atualizar categoria' });
  }
});


module.exports = router;
