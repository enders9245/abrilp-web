const db = require("../config/db");

const getFacturas = (req, res) => {
  const sql = `
    SELECT 
      f.id,
      f.cotizacion_id,
      f.codigo,
      f.fecha,
      f.subtotal,
      f.igv,
      f.total,
      f.estado,

      c.codigo AS cotizacion_codigo,
      c.servicio,

      cl.razon_social AS cliente,
      cl.ruc AS cliente_ruc,
      cl.direccion AS cliente_direccion,

      v.placa,
      v.marca,
      v.modelo

    FROM facturas f
    INNER JOIN cotizaciones c ON f.cotizacion_id = c.id
    INNER JOIN clientes cl ON c.cliente_id = cl.id
    INNER JOIN vehiculos v ON c.vehiculo_id = v.id
    ORDER BY f.id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("ERROR GET FACTURAS:", err);
      return res.status(500).json({
        success: false,
        message: "Error al obtener facturas",
        error: err.message,
      });
    }

    res.json(results);
  });
};

const createFacturaDesdeCotizacion = (req, res) => {
  const { cotizacion_id } = req.body;

  if (!cotizacion_id) {
    return res.status(400).json({
      success: false,
      message: "Falta cotizacion_id",
    });
  }

  db.query(
    "SELECT * FROM cotizaciones WHERE id = ?",
    [cotizacion_id],
    (err, results) => {
      if (err) return res.status(500).json(err);

      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Cotización no encontrada",
        });
      }

      const cotizacion = results[0];

      if (cotizacion.estado !== "APROBADA") {
        return res.status(400).json({
          success: false,
          message: "Solo se puede facturar una cotización aprobada",
        });
      }

      db.query(
        "SELECT id FROM facturas WHERE cotizacion_id = ?",
        [cotizacion_id],
        (err, existe) => {
          if (err) return res.status(500).json(err);

          if (existe.length > 0) {
            return res.status(400).json({
              success: false,
              message: "Esta cotización ya tiene factura",
            });
          }

          db.query(
            "SELECT IFNULL(MAX(id), 0) AS ultimo FROM facturas",
            (err, countResult) => {
              if (err) return res.status(500).json(err);

              const numero = Number(countResult[0].ultimo) + 1;
              const codigo = `F001-${String(numero).padStart(6, "0")}`;
              const fecha = new Date().toISOString().split("T")[0];

              const subtotal30 = Number(cotizacion.subtotal || 0) * 30;
              const igv30 = subtotal30 * 0.18;
              const total30 = subtotal30 + igv30;

              db.query(
                `INSERT INTO facturas
                (cotizacion_id, codigo, fecha, subtotal, igv, total, estado)
                VALUES (?, ?, ?, ?, ?, ?, 'EMITIDA')`,
                [
                  cotizacion_id,
                  codigo,
                  fecha,
                  subtotal30,
                  igv30,
                  total30,
                ],
                (err, result) => {
                  if (err) {
                    return res.status(500).json({
                      success: false,
                      message: "Error al crear factura",
                      error: err.message,
                    });
                  }

                  res.json({
                    success: true,
                    message: "Factura generada correctamente",
                    id: result.insertId,
                    codigo,
                  });
                }
              );
            }
          );
        }
      );
    }
  );
};

const anularFactura = (req, res) => {
  const { id } = req.params;

  db.query( 
    "UPDATE facturas SET estado = 'ANULADA' WHERE id = ?",
    [id],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({
        success: true,
        message: "Factura anulada correctamente",
      });
    }
  );
};

module.exports = {
  getFacturas,
  createFacturaDesdeCotizacion,
  anularFactura,
};