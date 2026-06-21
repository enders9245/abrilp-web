const db = require("../config/db");

const getEmpresa = (req, res) => {
  db.query(
    "SELECT * FROM empresa_config LIMIT 1",
    (err, results) => {
      if (err) return res.status(500).json(err);

      res.json(results[0]);
    }
  );
};

const updateEmpresa = (req, res) => {
  const {
    nombre,
    ruc,
    direccion,
    telefono,
    correo,
    representante,
    logo,
  } = req.body;

  db.query(
    `UPDATE empresa_config
     SET nombre = ?, ruc = ?, direccion = ?, telefono = ?, correo = ?, representante = ?, logo = ?
     WHERE id = 1`,
    [
      nombre,
      ruc,
      direccion,
      telefono,
      correo,
      representante,
      logo,
    ],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({
        success: true,
        message: "Empresa actualizada correctamente",
      });
    }
  );
};

module.exports = {
  getEmpresa,
  updateEmpresa,
};