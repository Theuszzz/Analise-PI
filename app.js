const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
    }
});

// Criar tabela de itens, se não existir
db.run(`
    CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        quantity INTEGER NOT NULL
    )
`);

// Endpoint para buscar todos os itens do estoque
app.get('/items', (req, res) => {
    const query = 'SELECT * FROM items';
    db.all(query, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ data: rows });
    });
});

// Endpoint para adicionar um item ao estoque
app.post('/items', (req, res) => {
    const { name, quantity } = req.body;

    if (!name || !quantity || quantity <= 0) {
        res.status(400).json({ error: 'Nome e quantidade são obrigatórios, e a quantidade deve ser maior que zero.' });
        return;
    }

    const query = 'INSERT INTO items (name, quantity) VALUES (?, ?)';
    db.run(query, [name, quantity], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ id: this.lastID });
    });
});

// Servir o HTML principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
