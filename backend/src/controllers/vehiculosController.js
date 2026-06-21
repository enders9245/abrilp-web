const db = require("../config/db");

const getVehiculos = (req, res) => {
  db.query("SELECT * FROM vehiculos ORDER BY id DESC", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

const createVehiculo = (req, res) => {
  const { placa, marca, modelo, capacidad, anio, estado } = req.body;

  db.query(
    "INSERT INTO vehiculos (placa, marca, modelo, capacidad, anio, estado) VALUES (?, ?, ?, ?, ?, ?)",
    [placa, marca, modelo, capacidad, anio, estado],
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.json({
        success: true,
        message: "Vehículo registrado correctamente",
        id: result.insertId,
      });
    }
  );
};

const updateVehiculo = (req, res) => {
  const { id } = req.params;
  const { placa, marca, modelo, capacidad, anio, estado } = req.body;

  db.query(
    `UPDATE vehiculos
     SET placa = ?, marca = ?, modelo = ?, capacidad = ?, anio = ?, estado = ?
     WHERE id = ?`,
    [placa, marca, modelo, capacidad, anio, estado, id],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({
        success: true,
        message: "Vehículo actualizado correctamente",
      });
    }
  );
};

const deleteVehiculo = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM vehiculos WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json(err);

    res.json({
      success: true,
      message: "Vehículo eliminado correctamente",
    });
  });
};

module.exports = {
  getVehiculos,
  createVehiculo,
  updateVehiculo,
  deleteVehiculo,
};