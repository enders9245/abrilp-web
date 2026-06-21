const db = require("../config/db");

const getImplementaciones = (req, res) => {
  db.query(
    "SELECT * FROM implementaciones_incluidas ORDER BY id ASC",
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
};

const createImplementacion = (req, res) => {
  const { descripcion } = req.body;

  db.query(
    "INSERT INTO implementaciones_incluidas (descripcion) VALUES (?)",
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

const updateImplementacion = (req, res) => {
  const { id } = req.params;
  const { descripcion, estado } = req.body;

  db.query(
    "UPDATE implementaciones_incluidas SET descripcion = ?, estado = ? WHERE id = ?",
    [descripcion, estado, id],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({
        success: true,
      });
    }
  );
};

const deleteImplementacion = (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM implementaciones_incluidas WHERE id = ?",
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
  getImplementaciones,
  createImplementacion,
  updateImplementacion,
  deleteImplementacion,
};