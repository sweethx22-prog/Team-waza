const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'AccesoSalud'
});

db.connect((err) => {
  if (err) {
    console.error('Error al conectar con MySQL:', err);
    return;
  }
  console.log('Conectado a MySQL');
});

app.get('/solicitudes', (req, res) => {
  db.query('SELECT * FROM Solicitudes ORDER BY Id DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post('/solicitudes', (req, res) => {
  const { Nombre, Colonia, TipoAyuda, Detalle, Calle, Estado, CodigoMedicamento } = req.body;

  const query = `
    INSERT INTO Solicitudes (Nombre, Colonia, TipoAyuda, Detalle, Calle, Estado, CodigoMedicamento)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [Nombre, Colonia, TipoAyuda, Detalle, Calle, Estado || 'Pendiente', CodigoMedicamento || null], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, id: result.insertId });
  });
});

app.put('/solicitudes/:id', (req, res) => {
  const { id } = req.params;
  const { Estado, CodigoMedicamento } = req.body;

  const query = 'UPDATE Solicitudes SET Estado = ?, CodigoMedicamento = ? WHERE Id = ?';
  db.query(query, [Estado, CodigoMedicamento || null, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

app.listen(port, () => {
  console.log(`Servidor listo en http://localhost:${port}`);
});
