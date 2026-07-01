import { Navigate } from "react-router-dom";

const normalizarRol = (rol) => {
  if (!rol) return "";

  const r = String(rol).trim().toUpperCase();

  if (r === "ADMIN" || r === "ADMINISTRADOR") return "Administrador";
  if (r === "SECRETARIA" || r === "SECRETARIO") return "Secretaria";
  if (r === "OPERADOR") return "Operador";

  return rol;
};

export default function ProtectedRoute({ children, rolesPermitidos }) {
  const token = localStorage.getItem("token");

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    // ignore parse errors, user remains null
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  const rolUsuario = normalizarRol(user.rol);

  if (
    rolesPermitidos &&
    rolesPermitidos.length > 0 &&
    !rolesPermitidos.includes(rolUsuario)
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}