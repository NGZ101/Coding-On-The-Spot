const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(express.static('frontend')); 

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '30mei2005',
  database: 'gamesdb'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Terkoneksi ke database MySQL!');
});

// 1. READ: Mengambil semua data game (Untuk DataTables)
app.get('/api/games', (req, res) => {
    const sql = "SELECT * FROM games";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ data: results }); 
    });
});

// 2. CREATE: Menambah game baru
app.post('/api/games', (req, res) => {
    const { title, genre, price } = req.body;
    const sql = "INSERT INTO games (title, genre, price) VALUES (?, ?, ?)";
    
    db.query(sql, [title, genre, price], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Game berhasil ditambahkan!" });
    });
});

// 3. READ 1 DATA: Mengambil data game spesifik (Untuk mengisi form edit)
app.get('/api/games/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM games WHERE id = ?";
    
    db.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: "Game tidak ditemukan" });
        res.json(results[0]); 
    });
});

// 4. UPDATE: Menyimpan hasil edit game
app.put('/api/games/:id', (req, res) => {
    const id = req.params.id;
    const { title, genre, price } = req.body;
    const sql = "UPDATE games SET title = ?, genre = ?, price = ? WHERE id = ?";
    
    db.query(sql, [title, genre, price, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Game berhasil diupdate!" });
    });
});

// 5. DELETE: Menghapus game
app.delete('/api/games/:id', (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM games WHERE id = ?";
    
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Game berhasil dihapus!" });
    });
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});