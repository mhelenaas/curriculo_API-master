const express = require('express');
const pool = require('./db');
const app = express();

app.use(express.json());

app.get('/curriculo', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM curriculo');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/curriculo', async (req, res) => {
    const { nome, number, phone_number, id, cep, email, complement, district, linkedin, nationality } = req.body;
    try {
        const { rows } = await pool.query(
            `INSERT INTO curriculo (nome, number, phone_number, id, cep, email, complement, district, linkedin, nationality) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
            [nome, number, phone_number, id, cep, email, complement, district, linkedin, nationality]
        );
        res.status(201).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/curriculo/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, number, phone_number, cep, email, complement, district, linkedin, nationality } = req.body;

    try {
        const { rowCount, rows } = await pool.query(
            `UPDATE curriculo SET 
                nome = $1, 
                number = $2, 
                phone_number = $3, 
                cep = $4, 
                email = $5, 
                complement = $6, 
                district = $7, 
                linkedin = $8, 
                nationality = $9 
            WHERE id = $10 RETURNING *`,
            [nome, number, phone_number, cep, email, complement, district, linkedin, nationality, id]
        );

        if (rowCount === 0) {
            return res.status(404).json({ message: "Currículo não encontrado" });
        }

        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/curriculo/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const { rowCount, rows } = await pool.query('DELETE FROM curriculo WHERE id = $1 RETURNING *', [id]);

        if (rowCount === 0) {
            return res.status(404).json({ message: "Currículo não encontrado" });
        }

        res.json({ message: "Currículo deletado com sucesso!", deleted: rows[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
