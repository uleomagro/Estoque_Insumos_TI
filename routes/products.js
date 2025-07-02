const express    = require('express');
const router     = express.Router();
const Product    = require('../models/Product');
const { logToFile } = require('../utils/fileLogger');
const Category = require('../models/Category');

// GET /api/products — lista todos os produtos
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar produtos.' });
  }
});

// POST /api/products — cria um novo produto
router.post('/', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
	const categoriaInformada = req.body.category;
	// Verifica se a categoria existe no banco
	const categoriaExiste = await Category.findOne({ nome: categoriaInformada });
	if (!categoriaExiste) {
		return res.status(400).json({ message: 'Categoria não cadastrada. Por favor, selecione uma válida.' });
	}

    // audit log em arquivo: criação de produto
    logToFile({
      user:       req.auth.user,
      action:     'create',
      resource:   'product',
      resourceId: savedProduct._id,
      details:    savedProduct.toObject()
    });

    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/products/:id — atualiza um produto existente
router.put('/:id', async (req, res) => {
  try {
    // guarda estado antes da atualização
    const beforeUpdate = await Product.findById(req.params.id).lean();
    if (!beforeUpdate) {
      return res.status(404).json({ error: 'Produto não encontrado.' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).lean();

    // audit log em arquivo: atualização de produto
    logToFile({
      user:       req.auth.user,
      action:     'update',
      resource:   'product',
      resourceId: req.params.id,
      details: {
        before: beforeUpdate,
        after:  updatedProduct
      }
    });

    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/products/:id — remove um produto existente
router.delete('/:id', async (req, res) => {
  try {
    // guarda estado antes da deleção
    const toDelete = await Product.findById(req.params.id).lean();
    if (!toDelete) {
      return res.status(404).json({ error: 'Produto não encontrado.' });
    }

    await Product.deleteOne({ _id: req.params.id });

    // audit log em arquivo: deleção de produto
    logToFile({
      user:       req.auth.user,
      action:     'delete',
      resource:   'product',
      resourceId: req.params.id,
      details:    toDelete
    });

    res.json({ message: 'Produto removido com sucesso.' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH /api/products/:id/stock — ajusta estoque do produto
router.patch('/:id/stock', async (req, res) => {
  const { operation, quantity } = req.body;
  const change = operation === 'increment'
    ? quantity
    : operation === 'decrement'
      ? -quantity
      : 0;

  try {
    // estado antes do ajuste
    const beforeAdjust = await Product.findById(req.params.id).lean();
    if (!beforeAdjust) {
      return res.status(404).json({ error: 'Produto não encontrado.' });
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { $inc: { stock: change } },
      { new: true }
    ).lean();

    // audit log em arquivo: ajuste de estoque
    logToFile({
      user:       req.auth.user,
      action:     'update_stock',
      resource:   'product',
      resourceId: req.params.id,
      details: {
        beforeStock: beforeAdjust.stock,
        change,
        afterStock:  updated.stock
      }
    });

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
