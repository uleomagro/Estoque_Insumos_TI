const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  user:       { type: String, required: true },                       // usuário que fez a ação
  action:     { type: String, required: true },                       // ex: 'create', 'update', 'delete', 'movement'
  resource:   { type: String, required: true },                       // ex: 'product', 'movement'
  resourceId: { type: mongoose.Schema.Types.ObjectId, default: null },// id do documento afetado
  details:    { type: mongoose.Schema.Types.Mixed },                  // opcional: payload ou diff
  timestamp:  { type: Date, default: Date.now }
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
