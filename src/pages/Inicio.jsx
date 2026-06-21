import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { motion } from "framer-motion";
import {
  FaTruck,
  FaHardHat,
  FaUsers,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaWhatsapp,
  FaShieldAlt,
  FaClock,
  FaAward,
  FaRoute,
} from "react-icons/fa";

export default function Inicio() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="fixed top-0 left-0 w-full bg-black/85 backdrop-blur-md text-white z-50 shadow">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="ABRILP"
              className="w-14 h-14 object-contain bg-white p-1 rounded-xl"
            />
            <div>
              <h1 className="text-2xl font-bold text-yellow-500">ABRILP</h1>
              <p className="text-xs text-gray-300">Transportes y Servicios</p>
            </div>
          </div>

          <nav className="hidden md:flex gap-6 text-sm font-semibold">
            <a href="#inicio" className="hover:text-yellow-500">Inicio</a>
            <a href="#nosotros" className="hover:text-yellow-500">Nosotros</a>
            <a href="#servicios" className="hover:text-yellow-500">Servicios</a>
            <a href="#flota" className="hover:text-yellow-500">Flota</a>
            <a href="#clientes" className="hover:text-yellow-500">Clientes</a>
            <a href="#contacto" className="hover:text-yellow-500">Contacto</a>
          </nav>

          <Link
            to="/login"
            className="bg-yellow-500 text-black px-5 py-2 rounded-lg font-bold hover:bg-yellow-600"
          >
            Iniciar sesión
          </Link>
        </div>
      </header>

      <section
        id="inicio"
        className="pt-32 text-white"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,.78), rgba(0,0,0,.78)), url('/camion-portada.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-28 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-yellow-500 font-bold mb-3">
              Transporte seguro, puntual y profesional
            </p>

            <h2 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
              Transportes y Servicios{" "}
              <span className="text-yellow-500">ABRILP S.R.L.</span>
            </h2>

            <p className="text-lg text-gray-300 mb-8 leading-8">
              Soluciones profesionales en transporte, alquiler de vehículos y
              servicios logísticos para construcción, minería y entidades públicas.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="#contacto"
                className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-600"
              >
                Solicitar cotización
              </a>

              <a
                href="#servicios"
                className="border border-yellow-500 text-yellow-500 px-6 py-3 rounded-lg font-bold hover:bg-yellow-500 hover:text-black"
              >
                Ver servicios
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-white/10 rounded-3xl p-8 border border-yellow-500/40 shadow-2xl"
          >
            <img
              src={logo}
              alt="ABRILP"
              className="w-72 mx-auto bg-white rounded-2xl p-6"
            />

            <div className="grid grid-cols-2 gap-4 mt-8 text-center">
              <div className="bg-black/60 p-4 rounded-xl border border-yellow-500/30">
                <h3 className="text-3xl font-bold text-yellow-500">24/7</h3>
                <p className="text-sm text-gray-300">Disponibilidad</p>
              </div>

              <div className="bg-black/60 p-4 rounded-xl border border-yellow-500/30">
                <h3 className="text-3xl font-bold text-yellow-500">+150</h3>
                <p className="text-sm text-gray-300">Servicios</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="nosotros" className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="md:col-span-1"
          >
            <h2 className="text-4xl font-bold mb-4">¿Quiénes somos?</h2>
            <div className="w-20 h-1 bg-yellow-500"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="md:col-span-2 text-gray-700 text-lg leading-8"
          >
            <p>
              ABRILP Transportes y Servicios S.R.L. es una empresa peruana dedicada
              al transporte, alquiler de vehículos y servicios logísticos para
              empresas privadas, obras de construcción, minería y entidades públicas.
            </p>

            <p className="mt-4">
              Nuestro compromiso es brindar un servicio seguro, puntual y eficiente,
              trabajando con responsabilidad y profesionalismo en cada proyecto.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 45 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="bg-black text-white p-8 rounded-2xl shadow"
          >
            <h3 className="text-2xl font-bold text-yellow-500 mb-4">Misión</h3>
            <p>
              Brindar servicios de transporte y logística de alta calidad,
              garantizando seguridad, eficiencia y satisfacción para nuestros clientes.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 45 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="bg-yellow-500 text-black p-8 rounded-2xl shadow"
          >
            <h3 className="text-2xl font-bold mb-4">Visión</h3>
            <p>
              Ser una empresa líder en transporte y servicios logísticos, reconocida
              por su excelencia, puntualidad e innovación.
            </p>
          </motion.div>
        </div>
      </section>

      <section id="servicios" className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 45 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl font-bold text-center mb-12"
          >
            Nuestros Servicios
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                icon: <FaTruck />,
                titulo: "Transporte de carga",
                texto: "Movilización segura de materiales, equipos y carga pesada.",
              },
              {
                icon: <FaHardHat />,
                titulo: "Servicios para obras",
                texto: "Soporte logístico para construcción y proyectos empresariales.",
              },
              {
                icon: <FaTruck />,
                titulo: "Alquiler de vehículos",
                texto: "Camiones, camionetas y unidades para diferentes necesidades.",
              },
              {
                icon: <FaUsers />,
                titulo: "Atención empresarial",
                texto: "Servicio dirigido a empresas privadas y entidades públicas.",
              },
            ].map((servicio, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 45 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow text-center hover:-translate-y-2 transition"
              >
                <div className="text-5xl text-yellow-500 mx-auto mb-4 flex justify-center">
                  {servicio.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{servicio.titulo}</h3>
                <p className="text-gray-600">{servicio.texto}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="flota" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 45 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl font-bold text-center mb-12"
          >
            Nuestra Flota
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                nombre: "Camión JAC",
                descripcion: "Transporte de materiales y carga pesada.",
              },
              {
                nombre: "Camioneta 4x4",
                descripcion: "Operaciones mineras y proyectos de campo.",
              },
              {
                nombre: "Volquete",
                descripcion: "Movimiento de agregados y materiales.",
              },
            ].map((unidad, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 45 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: index * 0.1 }}
                className="bg-gray-100 rounded-2xl shadow overflow-hidden hover:shadow-xl transition"
              >
                <div className="h-56 bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center">
                  <FaTruck className="text-7xl text-gray-700" />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-2">{unidad.nombre}</h3>
                  <p className="text-gray-600">{unidad.descripcion}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="clientes" className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 45 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl font-bold text-center mb-12"
          >
            Nuestros Clientes
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            {[
              "Municipalidad de Puno",
              "Constructora Sur SAC",
              "Calixto Group",
              "Empresas privadas",
            ].map((cliente, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 45 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow font-bold border-t-4 border-yellow-500"
              >
                {cliente}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-black text-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          {[
            ["+150", "Servicios realizados"],
            ["+50", "Clientes atendidos"],
            ["+10", "Años de experiencia"],
            ["24/7", "Disponibilidad operativa"],
          ].map((dato, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <h3 className="text-4xl font-bold text-yellow-500">{dato[0]}</h3>
              <p>{dato[1]}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-20 bg-yellow-500">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">
            ¿Por qué elegir ABRIL'P?
          </h2>

          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              {
                icon: <FaShieldAlt />,
                titulo: "Seguridad",
                texto: "Vehículos operativos y servicios responsables.",
              },
              {
                icon: <FaClock />,
                titulo: "Puntualidad",
                texto: "Cumplimiento de cronogramas y plazos acordados.",
              },
              {
                icon: <FaAward />,
                titulo: "Experiencia",
                texto: "Trayectoria brindando soluciones de transporte.",
              },
              {
                icon: <FaRoute />,
                titulo: "Cobertura",
                texto: "Atención para proyectos en distintas zonas del país.",
              },
            ].map((item, index) => (
              <div key={index} className="bg-black text-white p-6 rounded-2xl shadow">
                <div className="text-4xl text-yellow-500 mx-auto mb-4 flex justify-center">
                  {item.icon}
                </div>
                <h3 className="font-bold text-2xl mb-2">{item.titulo}</h3>
                <p className="text-gray-300">{item.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contacto" className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-4xl font-bold mb-6">Contáctanos</h2>

            <p className="flex items-center gap-3 mb-4">
              <FaMapMarkerAlt className="text-yellow-500" />
              Arequipa - Perú
            </p>

            <p className="flex items-center gap-3 mb-4">
              <FaPhoneAlt className="text-yellow-500" />
              940 192 062
            </p>

            <p className="flex items-center gap-3 mb-4">
              <FaEnvelope className="text-yellow-500" />
              administracion@abrilp.com
            </p>
          </div>

          <form className="bg-white p-8 rounded-2xl shadow">
            <input className="w-full border p-3 rounded mb-4" placeholder="Nombre completo" />
            <input className="w-full border p-3 rounded mb-4" placeholder="Correo electrónico" />
            <input className="w-full border p-3 rounded mb-4" placeholder="Teléfono" />
            <textarea className="w-full border p-3 rounded mb-4" rows="4" placeholder="Mensaje"></textarea>

            <button
              type="button"
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold p-3 rounded-lg"
            >
              Enviar consulta
            </button>
          </form>
        </div>
      </section>

      <a
        href="https://wa.me/51940192062"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white px-5 py-4 rounded-full shadow-xl flex items-center gap-3 z-50"
      >
        <FaWhatsapp />
        Cotizar Ahora
      </a>

      <footer className="bg-black text-white py-8 text-center">
        <p className="font-bold text-yellow-500">
          ABRILP Transportes y Servicios S.R.L.
        </p>
        <p className="text-sm text-gray-400">
          © 2026 Todos los derechos reservados.
          
        </p>
         <p className="text-sm text-gray-400">
          desing by Enders
          
        </p>
      </footer>
    </div>
  );
}