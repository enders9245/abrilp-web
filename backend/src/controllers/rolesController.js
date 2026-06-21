const db = require("../config/db");

const getRoles = (req, res) => {
  db.query("SELECT * FROM roles ORDER BY id DESC", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

const createRol = (req, res) => {
  const { nombre, descripcion } = req.body;

  db.query(
    "INSERT INTO roles (nombre, descripcion, estado) VALUES (?, ?, 'ACTIVO')",
    [nombre, descripcion],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ success: true, id: result.insertId });
    }
  );
};

const updateRol = (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, estado } = req.body;

  db.query(
    "UPDATE roles SET nombre = ?, descripcion = ?, estado = ? WHERE id = ?",
    [nombre, descripcion, estado, id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ success: true });
    }
  );
};

const deleteRol = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM roles WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ success: true });
  });
};

module.exports = {
  getRoles,
  createRol,
  updateRol,
  deleteRol,
};