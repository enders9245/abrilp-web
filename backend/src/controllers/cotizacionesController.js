const db = require("../config/db");

const normalizarFecha = (fecha) => {
  if (!fecha) return null;

  if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return fecha;

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(fecha)) {
    const [dia, mes, anio] = fecha.split("/");
    return `${anio}-${mes}-${dia}`;
  }

  return fecha;
};

const getCotizaciones = (req, res) => {
  const sql = `
    SELECT 
      c.id, c.codigo, c.cliente_id, c.vehiculo_id, c.fecha,
      c.servicio, c.descripcion, c.subtotal, c.igv, c.total, c.estado,

      cl.razon_social AS cliente,
      cl.ruc AS cliente_ruc,
      cl.telefono AS cliente_telefono,
      cl.direccion AS cliente_direccion,

      v.placa, v.marca, v.modelo, v.capacidad, v.anio,
      v.estado AS vehiculo_estado

    FROM cotizaciones c
    INNER JOIN clientes cl ON c.cliente_id = cl.id
    INNER JOIN vehiculos v ON c.vehiculo_id = v.id
    ORDER BY c.id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("ERROR GET COTIZACIONES:", err);
      return res.status(500).json({
        message: "Error al obtener cotizaciones",
        error: err.message,
      });
    }

    res.json(results);
  });
};

const createCotizacion = (req, res) => {
  const { cliente_id, fecha, servicio, descripcion, items } = req.body;

  if (!cliente_id) {
    return res.status(400).json({ message: "Debe seleccionar un cliente" });
  }

  if (!fecha) {
    return res.status(400).json({ message: "Debe seleccionar una fecha" });
  }

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "Debe agregar al menos un ítem" });
  }

  const fechaBD = normalizarFecha(fecha);
  const vehiculo_id = Number(items[0].vehiculo_id);

  if (!vehiculo_id) {
    return res.status(400).json({
      message: "Debe seleccionar un vehículo en el primer ítem",
    });
  }

  const subtotal = items.reduce((acc, item) => {
    return acc + Number(item.precio || 0);
  }, 0);

  const igv = subtotal * 0.18;
  const total = subtotal + igv;

  db.beginTransaction((err) => {
    if (err) {
      console.error("ERROR BEGIN TRANSACTION:", err);
      return res.status(500).json({
        message: "Error al iniciar transacción",
        error: err.message,
      });
    }

   db.query(
  "SELECT IFNULL(MAX(id), 0) AS ultimo FROM cotizaciones",
  (err, countResult) => {
    if (err) {
      return db.rollback(() => {
        console.error("ERROR COUNT COTIZACIONES:", err);
        res.status(500).json({
          message: "Error al generar código",
          error: err.message,
        });
      });
    }

    const numero = countResult[0].ultimo + 1;
    const codigo = `COT-2026-${String(numero).padStart(4, "0")}`;

 

      db.query(
        `INSERT INTO cotizaciones
        (codigo, cliente_id, vehiculo_id, fecha, servicio, descripcion, subtotal, igv, total, estado)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDIENTE')`,
        [
          codigo,
          Number(cliente_id),
          vehiculo_id,
          fechaBD,
          servicio || items[0].descripcion || "Servicio de transporte",
          descripcion || "",
          subtotal,
          igv,
          total,
        ],
        (err, result) => {
          if (err) {
            return db.rollback(() => {
              console.error("ERROR INSERT COTIZACION:", err);
              res.status(500).json({
                message: "Error al guardar cotización",
                error: err.message,
              });
            });
          }

          const cotizacionId = result.insertId;

          const values = items.map((item) => [
            cotizacionId,
            Number(item.vehiculo_id),
            item.descripcion || "",
            item.unidad || "",
            Number(item.cantidad || 1),
            Number(item.precio || 0),
            Number(item.precio || 0),
          ]);

          db.query(
            `INSERT INTO cotizacion_items
            (cotizacion_id, vehiculo_id, descripcion, unidad, cantidad, precio, total)
            VALUES ?`,
            [values],
            (err) => {
              if (err) {
                return db.rollback(() => {
                  console.error("ERROR INSERT ITEMS:", err);
                  res.status(500).json({
                    message: "Error al guardar ítems de cotización",
                    error: err.message,
                  });
                });
              }

              db.commit((err) => {
                if (err) {
                  return db.rollback(() => {
                    console.error("ERROR COMMIT:", err);
                    res.status(500).json({
                      message: "Error al finalizar cotización",
                      error: err.message,
                    });
                  });
                }

                res.json({
                  success: true,
                  message: "Cotización creada correctamente",
                  codigo,
                  id: cotizacionId,
                });
              });
            }
          );
        }
      );
    });
  });
};

const updateCotizacion = (req, res) => {
  const { id } = req.params;
  const { cliente_id, fecha, servicio, descripcion, items } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "Debe agregar al menos un ítem" });
  }

  const fechaBD = normalizarFecha(fecha);
  const vehiculo_id = Number(items[0].vehiculo_id);

  const subtotal = items.reduce((acc, item) => {
    return acc + Number(item.precio || 0);
  }, 0);

  const igv = subtotal * 0.18;
  const total = subtotal + igv;

  db.beginTransaction((err) => {
    if (err) {
      return res.status(500).json({
        message: "Error al iniciar transacción",
        error: err.message,
      });
    }

    db.query(
      `UPDATE cotizaciones
       SET cliente_id = ?, vehiculo_id = ?, fecha = ?, servicio = ?, descripcion = ?, subtotal = ?, igv = ?, total = ?
       WHERE id = ?`,
      [
        Number(cliente_id),
        vehiculo_id,
        fechaBD,
        servicio || items[0].descripcion || "Servicio de transporte",
        descripcion || "",
        subtotal,
        igv,
        total,
        id,
      ],
      (err) => {
        if (err) {
          return db.rollback(() => {
            console.error("ERROR UPDATE COTIZACION:", err);
            res.status(500).json({
              message: "Error al actualizar cotización",
              error: err.message,
            });
          });
        }

        db.query(
          "DELETE FROM cotizacion_items WHERE cotizacion_id = ?",
          [id],
          (err) => {
            if (err) {
              return db.rollback(() => {
                console.error("ERROR DELETE ITEMS:", err);
                res.status(500).json({
                  message: "Error al limpiar ítems",
                  error: err.message,
                });
              });
            }

            const values = items.map((item) => [
              id,
              Number(item.vehiculo_id),
              item.descripcion || "",
              item.unidad || "",
              Number(item.cantidad || 1),
              Number(item.precio || 0),
              Number(item.precio || 0),
            ]);

            db.query(
              `INSERT INTO cotizacion_items
              (cotizacion_id, vehiculo_id, descripcion, unidad, cantidad, precio, total)
              VALUES ?`,
              [values],
              (err) => {
                if (err) {
                  return db.rollback(() => {
                    console.error("ERROR INSERT UPDATE ITEMS:", err);
                    res.status(500).json({
                      message: "Error al guardar nuevos ítems",
                      error: err.message,
                    });
                  });
                }

                db.commit((err) => {
                  if (err) {
                    return db.rollback(() => {
                      res.status(500).json({
                        message: "Error al finalizar actualización",
                        error: err.message,
                      });
                    });
                  }

                  res.json({
                    success: true,
                    message: "Cotización actualizada correctamente",
                  });
                });
              }
            );
          }
        );
      }
    );
  });
};

const deleteCotizacion = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM cotizacion_items WHERE cotizacion_id = ?", [id], (err) => {
    if (err) {
      return res.status(500).json({
        message: "Error al eliminar ítems",
        error: err.message,
      });
    }

    db.query("DELETE FROM cotizaciones WHERE id = ?", [id], (err) => {
      if (err) {
        return res.status(500).json({
          message: "Error al eliminar cotización",
          error: err.message,
        });
      }

      res.json({ success: true, message: "Cotización eliminada correctamente" });
    });
  });
};

const updateEstadoCotizacion = (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  db.query("UPDATE cotizaciones SET estado = ? WHERE id = ?", [estado, id], (err) => {
    if (err) {
      return res.status(500).json({
        message: "Error al actualizar estado",
        error: err.message,
      });
    }

    res.json({ success: true, message: "Estado actualizado correctamente" });
  });
};

const getCotizacionItems = (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT 
      ci.id, ci.cotizacion_id, ci.vehiculo_id,
      ci.descripcion, ci.unidad, ci.cantidad, ci.precio, ci.total,
      v.placa, v.marca, v.modelo, v.anio, v.capacidad,
      v.estado AS vehiculo_estado
    FROM cotizacion_items ci
    LEFT JOIN vehiculos v ON ci.vehiculo_id = v.id
    WHERE ci.cotizacion_id = ?
    ORDER BY ci.id ASC
  `;

  db.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Error al obtener ítems",
        error: err.message,
      });
    }

    res.json(results);
  });
};

module.exports = {
  getCotizaciones,
  createCotizacion,
  updateCotizacion,
  deleteCotizacion,
  updateEstadoCotizacion,
  getCotizacionItems,
};