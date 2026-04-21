require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});


// 1. READ ALL (Buscar todas as pessoas)

app.get('/pessoas', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM pessoas ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});


// 2. READ ONE COMPLETO (Buscar uma pessoa + currículo inteiro) - BÔNUS PARA O APP!

app.get('/pessoas/:id/completo', async (req, res) => {
    const { id } = req.params;
    try {
        const pessoa = await pool.query('SELECT * FROM pessoas WHERE id = $1', [id]);
        if (pessoa.rows.length === 0) return res.status(404).json({ erro: 'Pessoa não encontrada' });

        const expProf = await pool.query('SELECT * FROM experiencias_profissionais WHERE pessoa_id = $1', [id]);
        const expAcad = await pool.query('SELECT * FROM experiencias_academicas WHERE pessoa_id = $1', [id]);
        const projetos = await pool.query('SELECT * FROM projetos WHERE pessoa_id = $1', [id]);

        // Junta tudo em um único objeto JSON
        res.json({
            ...pessoa.rows,
            experiencias_profissionais: expProf.rows,
            experiencias_academicas: expAcad.rows,
            projetos: projetos.rows
        });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});


// 3. CREATE 

app.post('/pessoas', async (req, res) => {
    const { nome, resumo_perfil } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO pessoas (nome, resumo_perfil) VALUES ($1, $2) RETURNING *',
            [nome, resumo_perfil]
        );
        res.status(201).json(result.rows);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});


// 4. UPDATE 

app.put('/pessoas/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, resumo_perfil } = req.body;
    try {
        const result = await pool.query(
            'UPDATE pessoas SET nome = $1, resumo_perfil = $2 WHERE id = $3 RETURNING *',
            [nome, resumo_perfil, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ erro: 'Pessoa não encontrada' });
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});


// 5. DELETE

app.delete('/pessoas/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM pessoas WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ erro: 'Pessoa não encontrada' });
        res.json({ mensagem: 'Pessoa deletada com sucesso!' });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT} e banco conectado!`);
});