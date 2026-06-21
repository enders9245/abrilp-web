const db = require("../config/db");

const getResumen = (req, res) => {
  const sql = `
    SELECT
      (SELECT COUNT(*) FROM clientes) AS clientes,
      (SELECT COUNT(*) FROM vehiculos) AS vehiculos,
      (SELECT COUNT(*) FROM cotizaciones) AS cotizaciones,
      (SELECT COUNT(*) FROM facturas) AS facturas,
      (SELECT IFNULL(SUM(total), 0) FROM facturas WHERE estado = 'EMITIDA') AS ingresos
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results[0]);
  });
};

const getIngresosMensuales = (req, res) => {
  const sql = `
    SELECT 
      MONTH(fecha) AS mes,
      SUM(total) AS total
    FROM facturas
    WHERE estado = 'EMITIDA'
    GROUP BY MONTH(fecha)
    ORDER BY MONTH(fecha)
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);

    const meses = [
      "Ene", "Feb", "Mar", "Abr", "May", "Jun",
      "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
    ];

    const data = meses.map((nombre, index) => {
      const encontrado = results.find((r) => Number(r.mes) === index + 1);

      return {
        mes: nombre,
        ingresos: encontrado ? Number(encontrado.total) : 0,
      };
    });

    res.json(data);
  });
};

module.exports = {
  getResumen,
  getIngresosMensuales,
};