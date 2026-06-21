const db = require("../config/db");
const jwt = require("jsonwebtoken");

const login = (req, res) => {
  const { email, password } = req.body;

  db.query(
    `SELECT 
      u.id,
      u.nombre,
      u.email,
      u.password,
      u.rol_id,
      IFNULL(u.estado, 'ACTIVO') AS estado,
      r.nombre AS rol
    FROM usuarios u
    LEFT JOIN roles r ON u.rol_id = r.id
    WHERE u.email = ?`,
    [email],
    (err, results) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Error de base de datos",
          error: err,
        });
      }

      if (results.length === 0) {
        return res.status(401).json({
          success: false,
          message: "Usuario no encontrado",
        });
      }

      const user = results[0];

      if (user.estado === "INACTIVO") {
        return res.status(401).json({
          success: false,
          message: "Usuario inactivo",
        });
      }

      if (user.password !== password) {
        return res.status(401).json({
          success: false,
          message: "Contraseña incorrecta",
        });
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          rol_id: user.rol_id,
          rol: user.rol,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "8h",
        }
      );

      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          nombre: user.nombre,
          email: user.email,
          rol_id: user.rol_id,
          rol: user.rol,
        },
      });
    }
  );
};

module.exports = {
  login,
};