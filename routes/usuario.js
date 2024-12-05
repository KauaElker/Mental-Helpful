const express = require('express');
const pool = require('./config');
const router = express.Router();

// Rota de registro (POST /register)
router.post('/createUsuario', async (req, res) => {
  const { nome, email, senha, telefone } = req.body;

  if (!nome || !email || !senha || !telefone) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  try {
    const connection = await pool.getConnection();
    try {
      const query = 'CALL sp_create_usuario(?, ?, ?, ?)';
      const values = [nome, email, senha, telefone];

      await connection.query(query, values);
      connection.release();

      return res.status(201).json({ message: 'Usuário registrado com sucesso!' });
    } catch (err) {
      connection.release();
      return res.status(500).json({ message: 'Erro ao registrar usuário.' });
    }

  } catch (err) {
    return res.status(500).json({ message: 'Erro ao gerar hash da senha.' });
  }
});

// Rota de login (POST /login)
router.post('/readUsuario', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ message: 'CPF/CNPJ e senha são obrigatórios.' });
  }

  try {
    const connection = await pool.getConnection();
    try {
      const query = 'SELECT * FROM vw_usuarios WHERE usu_email = ?';
      const [results] = await connection.query(query, [email]);
      connection.release();

      if (results.length === 0) {
        return res.status(400).json({ message: 'Usuário não encontrado.' });
      }

      const usuario = results[0];

      const isMatch = senha == usuario.usu_senha ? true : false;

      if (!isMatch) {
        return res.status(400).json({ message: 'Senha incorreta.' });
      }

      return res.status(200).json({
        message: 'Login realizado com sucesso!',
        usu_id: usuario.usu_id, // Retorna o ID do usuário
      });

    } catch (err) {
      connection.release();
      console.error('Erro ao consultar o banco:', err);
      return res.status(500).json({ message: 'Erro ao autenticar usuário.' });
    }
  } catch (err) {
    console.error('Erro ao conectar ao banco:', err);
    return res.status(500).json({ message: 'Erro ao conectar ao banco de dados.' });
  }
});

module.exports = router;