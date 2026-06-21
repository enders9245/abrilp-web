const db = require("../config/db");

const getClientes = (req, res) => {
  db.query("SELECT * FROM clientes ORDER BY id DESC", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

const createCliente = (req, res) => {
  const { razon_social, ruc, telefono, direccion } = req.body;

  db.query(
    `INSERT INTO clientes 
    (razon_social, ruc, telefono, direccion, estado)
    VALUES (?, ?, ?, ?, 'ACTIVO')`,
    [razon_social, ruc, telefono, direccion],
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.json({
        success: true,
        id: result.insertId,
      });
    }
  );
};

const updateEstadoCliente = (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  db.query(
    "UPDATE clientes SET estado = ? WHERE id = ?",
    [estado, id],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({
        success: true,
        message: "Estado actualizado correctamente",
      });
    }
  );
};

const deleteCliente = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM clientes WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json(err);

    res.json({
      success: true,
      message: "Cliente eliminado correctamente",
    });
  });
};

module.exports = {
  getClientes,
  createCliente,
  updateEstadoCliente,
  deleteCliente,
};