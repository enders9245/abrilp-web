import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import logo from "../assets/logo.png";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      login(response.data.user);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Correo o contraseña incorrectos");
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#f4e5ee,_#efe9f5_60%,_#f7f0f4)] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/70 bg-white/85 shadow-[0_24px_80px_rgba(90,20,48,0.16)] backdrop-blur-xl grid lg:grid-cols-[1.05fr_0.95fr]">
        <div className="hidden lg:flex flex-col justify-between bg-[linear-gradient(135deg,_#7a1f3d_0%,_#5d1630_100%)] p-10 text-white">
          <div>
            <div className="inline-flex rounded-full border border-white/20 bg-white/15 px-3 py-1 text-sm font-medium backdrop-blur">
              Transportes y servicios
            </div>
            <h1 className="mt-6 text-4xl font-bold leading-tight">Gestiona tu operación con claridad y control.</h1>
            <p className="mt-4 text-sm text-white/80">
              ABRILP centraliza clientes, cotizaciones, facturas y seguimiento operativo en una sola plataforma.
            </p>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
            <p className="text-sm font-semibold">Acceso seguro</p>
            <p className="mt-2 text-sm text-white/80">Tus datos y documentos siempre organizados para tu equipo.</p>
          </div>
        </div>

        <div className="p-8 sm:p-10 lg:p-12">
          <div className="flex justify-center mb-6">
            <img src={logo} alt="Logo ABRILP" className="h-20 w-20 object-contain" />
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#28131d]">Iniciar sesión</h2>
            <p className="mt-2 text-sm text-[#6f5b69]">Ingresa tus credenciales para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#4a3340]">Correo electrónico</label>
              <input
                type="email"
                placeholder="correo@empresa.com"
                className="w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#4a3340]">Contraseña</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button className="btn-primary w-full py-3 font-semibold">
              Iniciar sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}