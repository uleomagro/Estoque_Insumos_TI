const express      = require('express');
const router       = express.Router();
const Movement     = require('../models/Movement');
const { logToFile } = require('../utils/fileLogger');

// GET /api/movements — lista movimentos
router.get('/', async (req, res) => {
  try {
    const list = await Movement
      .find()
      .sort({ date: -1 })
      .populate('product', 'category code');
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar lançamentos.' });
  }
});

// POST /api/movements — registra um novo lançamento
router.post('/', async (req, res) => {
  try {
    const { product, type, technician, quantity, destinatario, observation } = req.body;
    const mv = new Movement({ product, type, technician, quantity, destinatario, observation });
    const saved = await mv.save();

    // audit log em arquivo: registro de movimentação
    logToFile({
      user:       req.auth.user,
      action:     type === 'entrada' ? 'movement-in' : 'movement-out',
      resource:   'movement',
      resourceId: saved._id,
      details:    saved.toObject()
    });

    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
