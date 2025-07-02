# Sistema de Controle de Estoque - Insumos T.I.

Este é um sistema interno desenvolvido para gerenciar o estoque da empresa. Ele fornece funcionalidades de cadastro de produtos, movimentações de entrada e saída E categorias.

## 🚀 Funcionalidades

- Cadastro de Produtos
- Registro de Movimentações (Entrada/Saída)
- Categorização de Produtos
- Logs de Auditoria
- API RESTful usando Node.js e MongoDB
- Separação de responsabilidades com uso de rotas e modelos

## 🧰 Tecnologias Utilizadas

- Node.js
- Express
- MongoDB (com Mongoose)
- dotenv
- CORS

## 📦 Instalação

```bash
git clone https://github.com/uleomagro/Estoque_Insumos_TI.git
cd Estoque_Insumos_TI
npm install
```

## ⚙️ Configuração

Crie um arquivo `.env` com as seguintes variáveis:

```env
MONGODB_URI=your_mongodb_connection_string
```

## ▶️ Execução

```bash
npm start
```

O servidor estará disponível em `http://localhost:3000`.

## 📁 Estrutura de Pastas

- `models/` - Definições dos modelos de dados (Produto, Categoria, Movimentações, etc.)
- `routes/` - Rotas organizadas por funcionalidade
- `index.js` - Ponto de entrada da aplicação
- `.env` - Variáveis de ambiente (não incluído no repositório)

## ❗ Aviso de Segurança

> Certifique-se de NUNCA versionar seu arquivo `.env` ou qualquer outro com dados sensíveis. Assegure-se de configurar seu `.gitignore` corretamente.

---

## 📄 Licença

Este projeto está licenciado sob os termos da [MIT License](./LICENSE).
