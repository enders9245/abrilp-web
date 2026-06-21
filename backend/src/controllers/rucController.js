const consultarRuc = async (req, res) => {
  try {
    const { ruc } = req.params;

    if (!ruc || ruc.length !== 11) {
      return res.status(400).json({
        success: false,
        message: "El RUC debe tener 11 dígitos",
      });
    }

    const token = process.env.DECOLECTA_TOKEN;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Falta configurar DECOLECTA_TOKEN en .env",
      });
    }

    const response = await fetch(
      `https://api.decolecta.com/v1/sunat/ruc?numero=${ruc}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: data.message || data.error || "No se pudo consultar RUC",
        data,
      });
    }

    res.json({
      success: true,
      ruc: data.numeroDocumento || data.ruc || ruc,
      razon_social: data.razonSocial || data.razon_social || data.nombre || "",
      direccion: data.direccion || "",
      estado: data.estado || "",
      condicion: data.condicion || "",
    });
  } catch (error) {
    console.error("ERROR CONSULTAR RUC:", error);

    res.status(500).json({
      success: false,
      message: "Error al consultar RUC",
      error: error.message,
    });
  }
};

module.exports = {
  consultarRuc,
};