import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f7eaf0_0%,_#fff_60%)] px-6 py-20 text-center text-[#2d1420]">
      <div className="mx-auto max-w-xl rounded-[28px] border border-[#e7d4dc] bg-white/90 p-10 shadow-[0_20px_60px_rgba(95,28,54,0.12)]">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-[#a43f63]">
          Error 404
        </p>
        <h1 className="mb-4 text-4xl font-black text-[#6f193c]">
          Página no encontrada
        </h1>
        <p className="mb-8 text-base leading-7 text-[#6b4b56]">
          La ruta que intentas abrir no existe o fue movida. Vuelve al inicio para continuar navegando en ABRILP.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-full bg-[#7a1f3d] px-6 py-3 font-semibold text-white transition hover:bg-[#61152f]"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
