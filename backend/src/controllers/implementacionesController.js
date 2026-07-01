const db = require("../config/db");

const getImplementaciones = (req, res) => {
  db.query(
    `SELECT 
      id,
      descripcion,
      estado,
      categoria,
      mostrar_pdf,
      orden
    FROM implementaciones_incluidas
    ORDER BY orden ASC, id ASC`,
    (err, results) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Error al obtener implementaciones",
          error: err.message,
        });
      }

      res.json(results);
    }
  );
};

const createImplementacion = (req, res) => {
  const {
    descripcion,
    estado = "ACTIVO",
    categoria = "General",
    mostrar_pdf = "SI",
    orden = 1,
  } = req.body;

  if (!descripcion) {
    return res.status(400).json({
      success: false,
      message: "La descripción es obligatoria",
    });
  }

  db.query(
    `INSERT INTO implementaciones_incluidas
    (descripcion, estado, categoria, mostrar_pdf, orden)
    VALUES (?, ?, ?, ?, ?)`,
    [descripcion, estado, categoria, mostrar_pdf, Number(orden) || 1],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Error al crear implementación",
          error: err.message,
        });
      }

      res.json({
        success: true,
        message: "Implementación creada correctamente",
        id: result.insertId,
      });
    }
  );
};

const updateImplementacion = (req, res) => {
  const { id } = req.params;

  const {
    descripcion,
    estado = "ACTIVO",
    categoria = "General",
    mostrar_pdf = "SI",
    orden = 1,
  } = req.body;

  if (!descripcion) {
    return res.status(400).json({
      success: false,
      message: "La descripción es obligatoria",
    });
  }

  db.query(
    `UPDATE implementaciones_incluidas
     SET descripcion = ?, estado = ?, categoria = ?, mostrar_pdf = ?, orden = ?
     WHERE id = ?`,
    [
      descripcion,
      estado,
      categoria,
      mostrar_pdf,
      Number(orden) || 1,
      id,
    ],
    (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Error al actualizar implementación",
          error: err.message,
        });
      }

      res.json({
        success: true,
        message: "Implementación actualizada correctamente",
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
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Error al eliminar implementación",
          error: err.message,
        });
      }

      res.json({
        success: true,
        message: "Implementación eliminada correctamente",
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