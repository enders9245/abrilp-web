export default function Navbar() {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  return (
    <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <div>
        <h2 className="font-bold text-lg">
          Bienvenido
        </h2>

        <p className="text-gray-500">
          {user?.nombre || "Administrador"}
        </p>
      </div>

      <button
        onClick={logout}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Cerrar Sesión
      </button>
    </div>
  );
}