const db = require("../config/db");

const getUsuarios = (req, res) => {
  const sql = `
    SELECT 
      u.id,
      u.nombre,
      u.email,
      u.rol_id,
      IFNULL(u.estado, 'ACTIVO') AS estado,
      r.nombre AS rol
    FROM usuarios u
    LEFT JOIN roles r ON u.rol_id = r.id
    ORDER BY u.id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("ERROR GET USUARIOS:", err);
      return res.status(500).json({
        success: false,
        message: "Error al obtener usuarios",
        error: err.message,
      });
    }

    res.json(results);
  });
};

const createUsuario = (req, res) => {
  const { nombre, email, password, rol_id, estado } = req.body;

  db.query(
    `INSERT INTO usuarios 
    (nombre, email, password, rol_id, estado)
    VALUES (?, ?, ?, ?, ?)`,
    [nombre, email, password, rol_id, estado || "ACTIVO"],
    (err, result) => {
      if (err) {
        console.error("ERROR CREATE USUARIO:", err);
        return res.status(500).json({
          success: false,
          message: "Error al crear usuario",
          error: err.message,
        });
      }

      res.json({
        success: true,
        id: result.insertId,
      });
    }
  );
};

const updateUsuario = (req, res) => {
  const { id } = req.params;
  const { nombre, email, password, rol_id, estado } = req.body;

  const sql = password
    ? `UPDATE usuarios SET nombre=?, email=?, password=?, rol_id=?, estado=? WHERE id=?`
    : `UPDATE usuarios SET nombre=?, email=?, rol_id=?, estado=? WHERE id=?`;

  const params = password
    ? [nombre, email, password, rol_id, estado, id]
    : [nombre, email, rol_id, estado, id];

  db.query(sql, params, (err) => {
    if (err) {
      console.error("ERROR UPDATE USUARIO:", err);
      return res.status(500).json({
        success: false,
        message: "Error al actualizar usuario",
        error: err.message,
      });
    }

    res.json({ success: true });
  });
};

const deleteUsuario = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM usuarios WHERE id = ?", [id], (err) => {
    if (err) {
      console.error("ERROR DELETE USUARIO:", err);
      return res.status(500).json({
        success: false,
        message: "Error al eliminar usuario",
        error: err.message,
      });
    }

    res.json({ success: true });
  });
};

module.exports = {
  getUsuarios,
  createUsuario,
  updateUsuario,
  deleteUsuario,
};