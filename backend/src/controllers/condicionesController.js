const db = require("../config/db");

const getCondiciones = (req, res) => {
  db.query(
    "SELECT * FROM condiciones_servicio ORDER BY id ASC",
    (err, results) => {
      if (err) return res.status(500).json(err);

      res.json(results);
    }
  );
};

const createCondicion = (req, res) => {
  const { descripcion } = req.body;

  db.query(
    "INSERT INTO condiciones_servicio (descripcion) VALUES (?)",
    [descripcion],
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.json({
        success: true,
        id: result.insertId,
      });
    }
  );
};

const updateCondicion = (req, res) => {
  const { id } = req.params;
  const { descripcion, estado } = req.body;

  db.query(
    "UPDATE condiciones_servicio SET descripcion = ?, estado = ? WHERE id = ?",
    [descripcion, estado, id],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({
        success: true,
      });
    }
  );
};

const deleteCondicion = (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM condiciones_servicio WHERE id = ?",
    [id],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({
        success: true,
      });
    }
  );
};

module.exports = {
  getCondiciones,
  createCondicion,
  updateCondicion,
  deleteCondicion,
};