// utils/fileLogger.js
const fs   = require('fs');
const path = require('path');

// caminho para o arquivo de log (na raiz do projeto)
const logPath = path.join(__dirname, '..', 'audit.log');

/**
 * Grava no final do arquivo uma linha com timestamp e o payload JSON.
 * @param {Object} entry  
 */
function logToFile(entry) {
  const line = JSON.stringify({
    timestamp: new Date().toISOString(),
    ...entry
  }) + '\n';
  // se o arquivo não existir, ele é criado automaticamente
  fs.appendFile(logPath, line, err => {
    if (err) console.error('❌ Erro ao gravar log:', err);
  });
}

module.exports = { logToFile };
