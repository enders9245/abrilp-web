import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  motion, AnimatePresence, useInView,
  useMotionValue, useTransform, useSpring, useScroll,
} from "framer-motion";
import {
  FaTruck, FaHardHat, FaUsers, FaPhoneAlt, FaEnvelope,
  FaMapMarkerAlt, FaWhatsapp, FaShieldAlt, FaClock,
  FaAward, FaRoute, FaBars, FaTimes, FaArrowRight,
  FaBullseye, FaEye,
  FaTruckMoving, FaTruckPickup, FaTint, FaQuoteLeft,
  FaCertificate, FaClipboardCheck, FaFileContract, FaCheckCircle,
  FaStar, FaLeaf, FaHandshake, FaLightbulb, FaMapMarked,
  FaChartLine, FaHeadset, FaTools,
  FaKey, FaCalendarAlt, FaUserTie, FaGasPump, FaWrench, FaFileAlt,
  FaChevronDown, FaCoins, FaCalendarCheck,
} from "react-icons/fa";
import logo from "../assets/logo.png";

/* ══════════════════════════════════════════════════
   PALETA
══════════════════════════════════════════════════ */
const C = {
  guinda:      "#7A2244",
  guindaDeep:  "#3D0F1E",
  guindaSoft:  "#9C3D63",
  guindaVibrant:"#B02E5A",
  morado:      "#6B5E9E",
  moradoSoft:  "#9B8EC4",
  moradoDeep:  "#3D3566",
  lavanda:     "#EFEAF7",
  lavandaDeep: "#DDD2EE",
  paper:       "#FAF8FD",
  night:       "#080511",
  nightMid:    "#0D0918",
  nightCard:   "#120E1C",
  nightCardAlt:"#170F25",
  ink:         "#1E1030",
  inkMuted:    "#5C4A6A",
  mist:        "#BEB2D2",
  mistFaint:   "#7A6B8A",
  gold:        "#C4954A",
  goldSoft:    "#E2B96A",
  goldFaint:   "#F5DFA0",
  blanco:      "#FFFFFF",
  cream:       "#FDF9F0",
  cyan:        "#4FC3DC",
  cyanFaint:   "#9DE0EE",
};

/* ══════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════ */
const ENLACES_NAV = [
  { href: "#inicio",    label: "Inicio"    },
  { href: "#nosotros",  label: "Nosotros"  },
  { href: "#alquiler",  label: "Alquiler"  },
  { href: "#servicios", label: "Servicios" },
  { href: "#proceso",   label: "Proceso"   },
  { href: "#flota",     label: "Flota"     },
  { href: "#clientes",  label: "Clientes"  },
  { href: "#contacto",  label: "Contacto"  },
];

const FLOTA = [
  { id:1, nombre:"Camión JAC", capacidad:"8 – 12 Ton", tipo:"Carga Pesada",
    descripcion:"Ideal para transporte de materiales de construcción, insumos mineros y carga general en rutas nacionales con seguimiento GPS.",
    badge:"Alta Demanda", badgeColor:C.moradoSoft, icon:<FaTruckMoving />,
    precioDia:"S/ 450", precioMes:"S/ 9,800", operador:"Con o sin operador" },
  { id:2, nombre:"Camioneta 4×4", capacidad:"1 Ton", tipo:"Todo Terreno",
    descripcion:"Operaciones en zonas mineras, carreteras de trocha y accesos a proyectos de campo en zonas de alta dificultad.",
    badge:"Disponible", badgeColor:C.guindaSoft, icon:<FaTruckPickup />,
    precioDia:"S/ 280", precioMes:"S/ 6,200", operador:"Con o sin operador" },
  { id:3, nombre:"Volquete", capacidad:"15 – 20 Ton", tipo:"Movimiento de Tierras",
    descripcion:"Transporte de agregados, desmonte, material de relleno y residuos de obra en grandes volúmenes para proyectos.",
    badge:"Disponible", badgeColor:C.guindaSoft, icon:<FaTruck />,
    precioDia:"S/ 520", precioMes:"S/ 11,500", operador:"Con operador" },
  { id:4, nombre:"Cisterna", capacidad:"10 000 L", tipo:"Líquidos / Agua",
    descripcion:"Distribución de agua potable, combustible y fluidos industriales para obras, faenas y zonas sin acceso hídrico.",
    badge:"Nuevo", badgeColor:C.gold, icon:<FaTint />,
    precioDia:"S/ 380", precioMes:"S/ 8,400", operador:"Con operador" },
];

const SERVICIOS = [
  { icon:<FaTruckMoving />, titulo:"Alquiler de Flota",      texto:"Camiones, volquetes, camionetas 4×4 y cisternas por día, semana o mes, con o sin operador, según tu proyecto.", accent:C.guinda, destacado:true },
  { icon:<FaTruck />,       titulo:"Transporte de Carga",    texto:"Movilización segura de materiales, equipos y carga pesada a nivel nacional con choferes certificados.", accent:C.morado },
  { icon:<FaHardHat />,     titulo:"Logística para Obras",   texto:"Soporte logístico integral para proyectos de construcción e infraestructura en toda la región sur.", accent:C.guindaSoft },
  { icon:<FaUsers />,       titulo:"Atención Empresarial",   texto:"Servicio profesional para empresas privadas y entidades públicas con atención personalizada 24/7.", accent:C.gold },
  { icon:<FaMapMarked />,   titulo:"Cobertura Regional",     texto:"Operaciones en Arequipa, Puno y zonas mineras de acceso restringido en el sur del Perú.", accent:C.moradoSoft },
  { icon:<FaLeaf />,        titulo:"Compromiso Ambiental",   texto:"Prácticas responsables, vehículos con mantenimiento al día y cumplimiento de normativas ambientales.", accent:C.cyan },
];

const PROCESO = [
  { n:"01", icon:<FaFileContract />,   titulo:"Cotización",    texto:"Recibimos tu solicitud, evaluamos ruta, tipo de carga, volumen y plazos para ofrecerte la mejor propuesta." },
  { n:"02", icon:<FaClipboardCheck />, titulo:"Planificación", texto:"Asignamos la unidad idónea, coordinamos itinerario, permisos y documentación requerida." },
  { n:"03", icon:<FaTruckMoving />,    titulo:"Ejecución",     texto:"Transportamos con choferes certificados y seguimiento GPS en tiempo real con comunicación constante." },
  { n:"04", icon:<FaCheckCircle />,    titulo:"Entrega",       texto:"Confirmamos recepción y entregamos reporte final con evidencia fotográfica y firma de conformidad." },
];

const TESTIMONIOS = [
  { texto:"ABRILP cumplió cada cronograma de obra sin contratiempos, incluso en temporada de lluvias en la sierra puneña.",
    autor:"Jefe de Logística", empresa:"Constructora Sur SAC", rating: 5 },
  { texto:"La coordinación para los traslados municipales fue impecable y transparente en cada etapa del proyecto.",
    autor:"Gerencia de Servicios", empresa:"Municipalidad de Puno", rating: 5 },
  { texto:"Confiamos su flota para operaciones en zonas mineras de difícil acceso. Siempre con resultados excelentes.",
    autor:"Supervisor de Operaciones", empresa:"Calixto Group", rating: 5 },
];

const CERTIFICACIONES = [
  { icon:<FaShieldAlt />,    label:"SOAT vigente" },
  { icon:<FaCertificate />,  label:"Revisión técnica" },
  { icon:<FaFileContract />, label:"Póliza de seguro" },
  { icon:<FaUsers />,        label:"Choferes certificados" },
  { icon:<FaRoute />,        label:"Rastreo GPS" },
  { icon:<FaLeaf />,         label:"Compromiso ambiental" },
];

const VALORES = [
  { icon:<FaHandshake />, titulo:"Compromiso",  texto:"Con los objetivos de nuestros clientes en cada operación.", color:C.guinda },
  { icon:<FaShieldAlt />, titulo:"Seguridad",   texto:"Consigna prioritaria en cada ruta y cada trabajador.",      color:C.morado },
  { icon:<FaStar />,      titulo:"Excelencia",  texto:"Estándares superiores de calidad en cada servicio.",        color:C.gold },
  { icon:<FaLightbulb />, titulo:"Innovación",  texto:"Renovación constante de flota y procesos operativos.",      color:C.cyan },
];

const PLANES_ALQUILER = [
  {
    icon:<FaCalendarAlt/>, nombre:"Alquiler por Día",
    ideal:"Ideal para necesidades puntuales",
    precio:"Desde S/ 280", periodo:"/ día",
    items:["Unidad inspeccionada antes de la entrega","Seguro y SOAT incluidos","Soporte telefónico 24/7","Entrega en Arequipa o Puno"],
    color:C.moradoSoft, destacado:false,
  },
  {
    icon:<FaCalendarCheck/>, nombre:"Alquiler por Semana",
    ideal:"El más elegido por constructoras",
    precio:"Desde S/ 1,650", periodo:"/ semana",
    items:["Tarifa preferencial vs. diario","Operador certificado opcional","Mantenimiento preventivo incluido","Reemplazo de unidad garantizado"],
    color:C.guinda, destacado:true,
  },
  {
    icon:<FaFileContract/>, nombre:"Alquiler Mensual / Proyecto",
    ideal:"Para obras y contratos largos",
    precio:"Cotización a medida", periodo:"",
    items:["Contrato adaptado al proyecto","Flota dedicada y GPS 24/7","Facturación corporativa","Ejecutivo de cuenta asignado"],
    color:C.gold, destacado:false,
  },
];

const BENEFICIOS_ALQUILER = [
  { icon:<FaKey/>,     titulo:"Con o sin operador",   texto:"Tú eliges: rentas solo la unidad o incluyes un chofer certificado de nuestra planilla." },
  { icon:<FaShieldAlt/>,titulo:"Seguro incluido",      texto:"Toda unidad rentada sale con SOAT, revisión técnica y póliza de seguro vigente." },
  { icon:<FaWrench/>,  titulo:"Mantenimiento cubierto",texto:"Nosotros asumimos el mantenimiento preventivo durante todo el periodo de alquiler." },
  { icon:<FaGasPump/>, titulo:"Combustible flexible",  texto:"Acordamos el esquema de combustible que mejor se ajuste a tu operación." },
  { icon:<FaFileAlt/>, titulo:"Contrato claro",        texto:"Firmamos un contrato formal con condiciones, plazos y responsabilidades definidas." },
  { icon:<FaRoute/>,   titulo:"Seguimiento GPS",       texto:"Monitoreo satelital en tiempo real durante toda la vigencia del alquiler." },
];

const FAQ_ALQUILER = [
  { q:"¿Cuál es el plazo mínimo de alquiler?", a:"El alquiler mínimo es por un día. Para proyectos de obra recomendamos planes semanales o mensuales, que tienen mejor tarifa." },
  { q:"¿Puedo alquilar sin operador?", a:"Sí. Puedes rentar la unidad sola si cuentas con chofer propio con licencia vigente, o incluir un operador certificado de nuestra planilla." },
  { q:"¿Qué documentos necesito para alquilar?", a:"Solicitamos datos de la empresa o persona natural, DNI o RUC, y para alquiler sin operador, licencia de conducir vigente del conductor designado." },
  { q:"¿El seguro y el SOAT están incluidos?", a:"Sí, todas nuestras unidades cuentan con SOAT vigente y póliza de seguro integral durante todo el periodo de alquiler." },
  { q:"¿Hacen entregas fuera de Arequipa?", a:"Sí, coordinamos entrega y recojo en Puno y zonas mineras del sur del Perú, según disponibilidad y ruta." },
];

/* ══════════════════════════════════════════════════
   ESTILOS GLOBALES
══════════════════════════════════════════════════ */
function EstilosGlobales() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,300;1,9..144,400;1,9..144,500;1,9..144,600&family=Inter:wght@300;400;500;600;700;800;900&family=IBM+Plex+Mono:wght@300;400;500;600&display=swap');

      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

      html { scroll-behavior: smooth; scrollbar-width: thin; scrollbar-color: ${C.guinda}55 transparent; }
      ::-webkit-scrollbar { width: 4px; }
      ::-webkit-scrollbar-track { background: ${C.night}; }
      ::-webkit-scrollbar-thumb { background: ${C.guinda}66; border-radius: 2px; }

      body {
        font-family: 'Inter', system-ui, sans-serif;
        background: ${C.night};
        color: ${C.blanco};
        overflow-x: hidden;
        -webkit-font-smoothing: antialiased;
      }

      .serif       { font-family: 'Fraunces', Georgia, serif; font-weight: 600; letter-spacing: -0.025em; }
      .serif-light { font-family: 'Fraunces', Georgia, serif; font-weight: 300; }
      .serif-it    { font-family: 'Fraunces', Georgia, serif; font-weight: 500; font-style: italic; }
      .mono        { font-family: 'IBM Plex Mono', ui-monospace, monospace; }

      /* ── VENAS ANIMADAS ── */
      @keyframes vein-draw {
        0%   { stroke-dashoffset: 1200; opacity: 0; }
        8%   { opacity: 0.8; }
        88%  { opacity: 0.6; }
        100% { stroke-dashoffset: 0; opacity: 0; }
      }
      @keyframes vein-pulse {
        0%, 100% { opacity: 0.3; stroke-width: 1; }
        50%       { opacity: 0.7; stroke-width: 1.5; }
      }
      @keyframes route-flow {
        to { stroke-dashoffset: -280; }
      }
      .v-draw  { stroke-dasharray: 1200; animation: vein-draw 7s ease-in-out infinite; }
      .v-draw.d1 { animation-delay: 0s; }
      .v-draw.d2 { animation-delay: 2.4s; }
      .v-draw.d3 { animation-delay: 4.8s; }
      .v-draw.d4 { animation-delay: 1.2s; }
      .v-pulse { animation: vein-pulse 4s ease-in-out infinite; }
      .route-flow { stroke-dasharray: 10 18; animation: route-flow 12s linear infinite; }

      /* ── PARTÍCULAS ── */
      @keyframes float-particle {
        0%   { transform: translateY(0) translateX(0) scale(1);    opacity: 0; }
        12%  { opacity: 0.7; }
        80%  { opacity: 0.3; }
        100% { transform: translateY(-160px) translateX(var(--dx,0px)) scale(0.3); opacity: 0; }
      }
      .particle { animation: float-particle linear infinite; }

      /* ── GLOW ORBS ── */
      @keyframes orb-drift {
        0%   { transform: translate(0px, 0px) scale(1); }
        33%  { transform: translate(30px, -40px) scale(1.08); }
        66%  { transform: translate(-20px, 20px) scale(0.95); }
        100% { transform: translate(0px, 0px) scale(1); }
      }
      @keyframes orb-drift2 {
        0%   { transform: translate(0px, 0px) scale(1); }
        33%  { transform: translate(-35px, 25px) scale(1.06); }
        66%  { transform: translate(20px, -30px) scale(0.97); }
        100% { transform: translate(0px, 0px) scale(1); }
      }
      .orb  { animation: orb-drift  14s ease-in-out infinite; }
      .orb2 { animation: orb-drift2 18s ease-in-out infinite; }
      .orb3 { animation: orb-drift  11s ease-in-out infinite reverse; }

      /* ── SCAN LINE ── */
      @keyframes scan { 0% { transform:translateY(-100%); } 100% { transform:translateY(2000%); } }
      .scan { animation: scan 10s linear infinite; pointer-events:none; }

      /* ── SHIMMER ── */
      @keyframes shimmer {
        0%   { background-position: -200% center; }
        100% { background-position:  200% center; }
      }
      .shimmer-text {
        background: linear-gradient(90deg,
          ${C.moradoSoft} 0%, ${C.goldSoft} 30%, ${C.moradoSoft} 60%, ${C.goldFaint} 80%, ${C.moradoSoft} 100%
        );
        background-size: 200% auto;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        animation: shimmer 6s linear infinite;
      }

      /* ── COUNTER GLOW ── */
      @keyframes num-glow {
        0%,100% { filter: drop-shadow(0 0 0 transparent); }
        50%      { filter: drop-shadow(0 0 12px ${C.moradoSoft}88); }
      }
      .num-glow { animation: num-glow 3s ease-in-out infinite; }

      /* ── WA PULSE ── */
      @keyframes wa-ring {
        0%   { box-shadow: 0 0 0 0 rgba(34,197,94,.55); }
        70%  { box-shadow: 0 0 0 16px rgba(34,197,94,0); }
        100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); }
      }
      .wa-btn { animation: wa-ring 3.2s ease-out infinite; }

      /* ── BORDER FLOW ── */
      @keyframes border-rotate {
        to { --angle: 360deg; }
      }
      @property --angle { syntax: '<angle>'; inherits: false; initial-value: 0deg; }

      /* ── CARD STYLES ── */
      .glass-card {
        background: linear-gradient(145deg, rgba(18,14,28,.88), rgba(8,5,17,.92));
        backdrop-filter: blur(28px) saturate(1.8);
        -webkit-backdrop-filter: blur(28px) saturate(1.8);
        border: 1px solid rgba(155,142,196,.14);
        border-radius: 20px;
        position: relative;
        overflow: hidden;
      }
      .glass-card::before {
        content:'';
        position:absolute; inset:0;
        background: radial-gradient(circle at var(--mx,50%) var(--my,50%), rgba(107,94,158,.12), transparent 60%);
        opacity: 0; transition: opacity .35s;
        border-radius: 20px; pointer-events:none;
      }
      .glass-card:hover::before { opacity:1; }

      .light-card {
        background: #fff;
        border: 1px solid ${C.lavandaDeep};
        border-radius: 18px;
        position: relative;
        overflow: hidden;
        transition: transform .35s cubic-bezier(.22,1,.36,1), box-shadow .35s;
      }
      .light-card:hover {
        transform: translateY(-7px);
        box-shadow: 0 22px 52px rgba(61,15,30,.12);
      }

      /* ── DIVIDER ── */
      .hr-glow { height:1px; background: linear-gradient(90deg,transparent,${C.morado}44,transparent); }

      /* ── SERVICE CARD BOTTOM LINE ── */
      .svc-card::after {
        content:''; position:absolute; bottom:0; left:0; right:0; height:2px;
        background: linear-gradient(90deg,var(--acc,${C.guinda}),transparent);
        transform:scaleX(0); transform-origin:left; transition:transform .35s ease;
      }
      .svc-card:hover::after { transform:scaleX(1); }

      /* ── BUTTON ── */
      .btn-prime {
        display:inline-flex; align-items:center; gap:9px;
        padding:14px 30px; border-radius:10px; border:none;
        font-weight:700; font-size:14px; cursor:pointer; letter-spacing:.02em;
        background:linear-gradient(135deg,${C.guinda},${C.guindaVibrant});
        color:#fff; text-decoration:none;
        box-shadow:0 4px 22px ${C.guinda}44;
        transition:all .28s cubic-bezier(.22,1,.36,1);
        position:relative; overflow:hidden;
      }
      .btn-prime::after {
        content:''; position:absolute; inset:0;
        background:linear-gradient(135deg,rgba(255,255,255,.12),transparent);
        opacity:0; transition:opacity .25s;
      }
      .btn-prime:hover { transform:translateY(-3px); box-shadow:0 10px 32px ${C.guinda}60; }
      .btn-prime:hover::after { opacity:1; }

      .btn-ghost {
        display:inline-flex; align-items:center; gap:9px;
        padding:14px 30px; border-radius:10px;
        font-weight:600; font-size:14px; cursor:pointer; letter-spacing:.02em;
        background:rgba(107,94,158,.09);
        color:${C.moradoSoft};
        border:1.5px solid rgba(107,94,158,.35);
        backdrop-filter:blur(10px); text-decoration:none;
        transition:all .28s;
      }
      .btn-ghost:hover { background:rgba(107,94,158,.18); border-color:${C.morado}; transform:translateY(-2px); }

      /* ── RESPONSIVE ── */
      @media (max-width:900px) {
        .hide-mob { display:none !important; }
        .col2 { grid-template-columns:1fr !important; }
        .col3 { grid-template-columns:1fr !important; }
        .col4 { grid-template-columns:1fr 1fr !important; }
      }
      @media (max-width:540px) {
        .col4 { grid-template-columns:1fr !important; }
      }
      @media (prefers-reduced-motion:reduce) {
        *,*::before,*::after { animation-duration:.001ms !important; transition-duration:.001ms !important; }
      }
    `}</style>
  );
}

/* ══════════════════════════════════════════════════
   VENAS SVG — múltiples capas, más densa
══════════════════════════════════════════════════ */
function VeinLayer({ dark = true }) {
  const stroke1 = dark ? C.morado    : C.lavandaDeep;
  const stroke2 = dark ? C.guindaSoft: C.lavandaDeep;
  const stroke3 = dark ? C.gold      : C.lavandaDeep;
  const stroke4 = dark ? C.cyan      : C.moradoSoft;
  const alpha   = dark ? 0.55 : 0.7;

  return (
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice"
      style={{ position:"absolute", inset:0, width:"100%", height:"100%",
        opacity: alpha, pointerEvents:"none", overflow:"visible" }}
      aria-hidden="true">
      <defs>
        <filter id="gv1" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="gv2" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="gv3" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* ── VENAS PRINCIPALES — draw animado ── */}
      <path className="v-draw d1" fill="none" stroke={stroke1} strokeWidth="1.6" filter="url(#gv1)"
        d="M -80 720 C 100 700, 180 560, 340 480 S 560 310, 760 200 S 980 90, 1200 20 S 1380 -10, 1520 -40" />
      <path className="v-draw d2" fill="none" stroke={stroke2} strokeWidth="1.1" filter="url(#gv2)"
        d="M -80 860 C 80 820, 160 660, 300 580 S 520 420, 700 320 S 940 200, 1160 110 S 1380 50, 1520 20" />
      <path className="v-draw d3" fill="none" stroke={stroke3} strokeWidth="0.9" filter="url(#gv1)"
        d="M -80 580 C 160 560, 240 420, 420 340 S 660 210, 860 140 S 1080 80, 1280 30 S 1420 10, 1520 0" />
      <path className="v-draw d4" fill="none" stroke={stroke4} strokeWidth="0.7" filter="url(#gv2)"
        d="M -80 440 C 140 420, 260 330, 440 260 S 700 150, 900 90 S 1140 40, 1380 10" />

      {/* ── RAMAS SECUNDARIAS ── */}
      <path className="v-draw d2" fill="none" stroke={stroke1} strokeWidth="0.7" opacity="0.5"
        d="M 340 480 C 360 420, 400 340, 380 220" />
      <path className="v-draw d3" fill="none" stroke={stroke2} strokeWidth="0.6" opacity="0.45"
        d="M 560 310 C 590 260, 640 200, 610 90" />
      <path className="v-draw d1" fill="none" stroke={stroke3} strokeWidth="0.6" opacity="0.45"
        d="M 760 200 C 800 160, 860 110, 820 20" />
      <path className="v-draw d4" fill="none" stroke={stroke4} strokeWidth="0.5" opacity="0.4"
        d="M 980 90 C 1010 60, 1060 30, 1040 -40" />
      <path className="v-draw d2" fill="none" stroke={stroke1} strokeWidth="0.5" opacity="0.35"
        d="M 300 580 C 280 520, 260 440, 310 360" />
      <path className="v-draw d3" fill="none" stroke={stroke2} strokeWidth="0.5" opacity="0.35"
        d="M 700 320 C 720 260, 760 200, 730 110" />

      {/* ── VENAS HORIZONTALES DE FONDO (pulso) ── */}
      <path className="v-pulse" fill="none" stroke={stroke1} strokeWidth="0.5" opacity="0.2"
        d="M 0 350 C 200 330, 400 380, 600 350 S 900 300, 1100 340 S 1350 360, 1520 340" />
      <path className="v-pulse" fill="none" stroke={stroke2} strokeWidth="0.4" opacity="0.15"
        d="M 0 550 C 240 530, 480 570, 700 545 S 1000 510, 1200 535 S 1400 555, 1520 540" />

      {/* ── NODOS / PUNTOS DE INTERSECCIÓN ── */}
      {[
        [340,480,C.gold,3.5],[560,310,C.moradoSoft,3],[760,200,C.gold,3.5],
        [980,90,C.moradoSoft,2.5],[300,580,C.guindaSoft,2.5],[700,320,C.gold,3],
        [440,260,C.cyan,2],[900,90,C.guindaSoft,2.5],
      ].map(([cx,cy,col,r],i) => (
        <g key={i} filter="url(#gv3)">
          <circle cx={cx} cy={cy} r={r*2.2} fill={col} opacity="0.12" />
          <circle cx={cx} cy={cy} r={r}     fill={col} opacity="0.75" />
        </g>
      ))}

      {/* ── RUTA DECORATIVA (moving dash) ── */}
      <path className="route-flow" fill="none" stroke={stroke1} strokeWidth="1.2" opacity="0.35"
        d="M -20 880 C 200 840, 360 700, 520 620 C 680 540, 840 460, 1000 360 C 1160 260, 1300 160, 1460 60" />
    </svg>
  );
}

/* ══════════════════════════════════════════════════
   PARTÍCULAS
══════════════════════════════════════════════════ */
function Particles({ count = 22 }) {
  const dots = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: (i * 13) % 100,
    dx: ((i % 5) - 2) * 8,
    size: 0.8 + (i % 4) * 0.6,
    dur: 8 + (i % 4),
    del: i * 0.35,
    col: [C.gold, C.moradoSoft, C.guindaSoft, C.cyan, C.goldSoft][i % 5],
  }));

  return (
    <div style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none" }}>
      {dots.map(d => (
        <div key={d.id} className="particle" style={{
          position:"absolute", bottom:-8, left:`${d.x}%`,
          width:d.size, height:d.size, borderRadius:"50%",
          background:d.col,
          "--dx": `${d.dx}px`,
          animationDuration:`${d.dur}s`,
          animationDelay:`${d.del}s`,
          boxShadow:`0 0 ${d.size*3}px ${d.col}`,
        }} />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   3D MAGNETIC CARD
══════════════════════════════════════════════════ */
function MagneticCard({ children, style, intensity = 10, className }) {
  const ref = useRef(null);
  const mx = useMotionValue(0), my = useMotionValue(0);
  const rx = useSpring(useTransform(my,[-1,1],[intensity,-intensity]),{stiffness:240,damping:28});
  const ry = useSpring(useTransform(mx,[-1,1],[-intensity,intensity]),{stiffness:240,damping:28});

  const move = e => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set(((e.clientX-r.left)/r.width  - 0.5) * 2);
    my.set(((e.clientY-r.top) /r.height - 0.5) * 2);
  };
  const leave = () => { mx.set(0); my.set(0); };

  return (
    <motion.div ref={ref} style={{ ...style, rotateX:rx, rotateY:ry,
      transformStyle:"preserve-3d", transformPerspective:900 }}
      className={className} onMouseMove={move} onMouseLeave={leave}>
      {children}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════
   ANIMATED COUNTER
══════════════════════════════════════════════════ */
function Counter({ value }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:"-80px" });
  const isNum  = /^\+?\d+$/.test(value);
  const target = isNum ? parseInt(value.replace("+",""),10) : 0;
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView || !isNum) return;
    let raf;
    const t0 = performance.now(), dur = 1800;
    const tick = t => {
      const p = Math.min((t-t0)/dur, 1);
      setN(Math.round((1-Math.pow(1-p,4))*target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, isNum, target]);

  return <span ref={ref} className="num-glow">
    {isNum ? `${value.startsWith("+") ? "+" : ""}${n}` : value}
  </span>;
}

/* ══════════════════════════════════════════════════
   EYEBROW
══════════════════════════════════════════════════ */
function Eyebrow({ children, center, dark, color }) {
  const col = color || (dark ? C.guindaSoft : C.moradoSoft);
  return (
    <p className="mono" style={{
      fontSize:9, letterSpacing:"0.28em", textTransform:"uppercase",
      color: col, display:"flex", alignItems:"center", gap:10,
      marginBottom:16, justifyContent: center ? "center" : "flex-start",
    }}>
      <span style={{ flex: center ? undefined : 0, width:20, height:1.5,
        background:`linear-gradient(90deg,transparent,currentColor)`, opacity:.7 }} />
      {children}
      <span style={{ width:20, height:1.5,
        background:`linear-gradient(90deg,currentColor,transparent)`, opacity:.7 }} />
    </p>
  );
}

/* ══════════════════════════════════════════════════
   FLEET CAROUSEL
══════════════════════════════════════════════════ */
function FleetCarousel() {
  const [active, setActive] = useState(0);
  const [dir,    setDir]    = useState(1);
  const timer = useRef(null);

  const go = useCallback(next => {
    setDir(next > active ? 1 : -1);
    setActive((next + FLOTA.length) % FLOTA.length);
  }, [active]);

  useEffect(() => {
    timer.current = setInterval(() => { setDir(1); setActive(a => (a+1)%FLOTA.length); }, 5000);
    return () => clearInterval(timer.current);
  }, []);

  const variants = {
    enter:  d => ({ opacity:0, x:d>0?80:-80, filter:"blur(10px)", scale:.96 }),
    center: { opacity:1, x:0, filter:"blur(0px)", scale:1 },
    exit:   d => ({ opacity:0, x:d>0?-80:80, filter:"blur(10px)", scale:.96 }),
  };
  const v = FLOTA[active];

  return (
    <div style={{ position:"relative" }}>
      <MagneticCard intensity={5} style={{
        background:`linear-gradient(145deg,${C.nightCardAlt}F5,${C.nightCard}F0)`,
        border:`1px solid rgba(155,142,196,.18)`,
        borderRadius:24, overflow:"hidden", minHeight:420,
        position:"relative",
        boxShadow:`0 30px 80px ${C.guindaDeep}70, inset 0 1px 0 rgba(255,255,255,.04)`,
      }}>
        {/* Background glows */}
        <div style={{ position:"absolute", inset:0, pointerEvents:"none",
          background:`radial-gradient(ellipse at 75% 35%, ${C.guinda}22 0%, transparent 60%),
                      radial-gradient(ellipse at 15% 80%, ${C.morado}18 0%, transparent 55%)` }} />

        {/* Mini vein inside card */}
        <svg viewBox="0 0 520 380" style={{ position:"absolute", inset:0, width:"100%", height:"100%",
          opacity:.5, pointerEvents:"none" }} aria-hidden>
          <path className="route-flow" fill="none" stroke={C.moradoSoft} strokeWidth="1.4"
            d="M-10 310 C 80 310, 100 190, 200 185 C 300 180, 310 80, 400 70 C 450 65, 470 48, 530 38" />
          <circle cx="200" cy="185" r="4.5" fill={C.gold} opacity=".8" filter="url(#gv3)" />
          <circle cx="400" cy="70"  r="4.5" fill={C.gold} opacity=".8" filter="url(#gv3)" />
          <circle cx="-10" cy="310" r="3"   fill={C.mist} opacity=".5" />
        </svg>

        {/* Scan line */}
        <div className="scan" style={{
          position:"absolute", left:0, right:0, height:"2px", zIndex:0,
          background:`linear-gradient(90deg,transparent,${C.morado}60,transparent)`,
        }} />

        <AnimatePresence custom={dir} mode="wait">
          <motion.div key={v.id} custom={dir} variants={variants}
            initial="enter" animate="center" exit="exit"
            transition={{ duration:.55, ease:[.22,1,.36,1] }}
            style={{ padding:"46px 52px", position:"relative", zIndex:1 }}>

            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24, flexWrap:"wrap" }}>
              <span style={{
                display:"inline-flex", alignItems:"center", gap:6,
                padding:"4px 14px", borderRadius:20, fontSize:9, fontWeight:700,
                letterSpacing:"0.2em", textTransform:"uppercase",
                background:`${v.badgeColor}22`, color:v.badgeColor,
                border:`1px solid ${v.badgeColor}50`,
              }}>{v.badge}</span>
              <span className="mono" style={{ fontSize:9, color:C.mistFaint, letterSpacing:"0.15em" }}>
                {v.tipo.toUpperCase()}
              </span>
              <span className="mono" style={{
                fontSize:9, color:C.goldSoft, letterSpacing:"0.15em",
                border:`1px solid ${C.gold}40`, borderRadius:20, padding:"3px 10px",
              }}>{v.operador.toUpperCase()}</span>
            </div>

            <div style={{ display:"flex", alignItems:"flex-start", gap:36, flexWrap:"wrap" }}>
              <motion.div initial={{scale:.7,opacity:0}} animate={{scale:1,opacity:1}}
                transition={{delay:.12,type:"spring",stiffness:200}}
                style={{
                  fontSize:72, lineHeight:1, color:C.moradoSoft,
                  filter:`drop-shadow(0 0 24px ${C.morado}77) drop-shadow(0 6px 14px ${C.guinda}55)`,
                  transformStyle:"preserve-3d", transform:"translateZ(30px)",
                }}>{v.icon}</motion.div>

              <div style={{ flex:1, minWidth:220 }}>
                <h3 className="serif" style={{ fontSize:44, color:C.blanco, lineHeight:1.02, marginBottom:12 }}>
                  {v.nombre}
                </h3>
                <p style={{ color:C.mist, fontSize:14.5, lineHeight:1.85, marginBottom:22 }}>
                  {v.descripcion}
                </p>
                <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                  <div style={{
                    display:"inline-flex", alignItems:"center", gap:12,
                    background:`linear-gradient(135deg,${C.guinda}28,${C.morado}18)`,
                    border:`1px solid ${C.guinda}55`, borderRadius:10, padding:"9px 18px",
                    backdropFilter:"blur(12px)",
                  }}>
                    <span className="mono" style={{ color:C.moradoSoft, fontSize:9, fontWeight:600, letterSpacing:"0.18em" }}>CAPACIDAD</span>
                    <span className="mono" style={{ color:C.blanco, fontSize:16, fontWeight:600 }}>{v.capacidad}</span>
                  </div>
                  <div style={{
                    display:"inline-flex", alignItems:"center", gap:12,
                    background:`linear-gradient(135deg,${C.gold}22,${C.gold}0e)`,
                    border:`1px solid ${C.gold}45`, borderRadius:10, padding:"9px 18px",
                    backdropFilter:"blur(12px)",
                  }}>
                    <span className="mono" style={{ color:C.goldSoft, fontSize:9, fontWeight:600, letterSpacing:"0.18em" }}>DESDE</span>
                    <span className="mono" style={{ color:C.blanco, fontSize:16, fontWeight:600 }}>{v.precioDia} / día</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Arrows */}
        <div style={{ position:"absolute", bottom:22, right:22, display:"flex", gap:8, zIndex:2 }}>
          {[["‹",active-1],["›",active+1]].map(([lbl,next],i) => (
            <button key={i} onClick={()=>go(next)} style={{
              width:40, height:40, borderRadius:"50%",
              border:`1px solid ${C.moradoSoft}40`,
              background:`rgba(18,14,28,.8)`, backdropFilter:"blur(8px)",
              color:C.moradoSoft, cursor:"pointer", fontSize:18,
              display:"flex", alignItems:"center", justifyContent:"center",
              transition:"all .22s",
            }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=C.morado;e.currentTarget.style.color=C.blanco;e.currentTarget.style.background=`${C.guinda}55`;}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=`${C.moradoSoft}40`;e.currentTarget.style.color=C.moradoSoft;e.currentTarget.style.background=`rgba(18,14,28,.8)`;}}
            >{lbl}</button>
          ))}
        </div>

        {/* Progress bar */}
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:3,
          background:`rgba(155,142,196,.12)` }}>
          <motion.div key={active}
            initial={{width:"0%"}} animate={{width:"100%"}}
            transition={{duration:5, ease:"linear"}}
            style={{ height:"100%", background:`linear-gradient(90deg,${C.guinda},${C.morado})` }} />
        </div>
      </MagneticCard>

      {/* Tab buttons */}
      <div style={{ display:"flex", gap:10, marginTop:18, justifyContent:"center", flexWrap:"wrap" }}>
        {FLOTA.map((f,i) => (
          <button key={f.id} onClick={()=>go(i)} style={{
            padding:"9px 18px", borderRadius:10, border:"none", cursor:"pointer",
            fontSize:11.5, fontWeight:600, letterSpacing:"0.07em",
            transition:"all .26s cubic-bezier(.22,1,.36,1)",
            background: i===active ? `linear-gradient(135deg,${C.guinda},${C.guindaVibrant})` : C.nightCard,
            color: i===active ? C.blanco : C.mistFaint,
            borderWidth:1, borderStyle:"solid",
            borderColor: i===active ? `${C.morado}66` : `${C.moradoSoft}18`,
            boxShadow: i===active ? `0 6px 20px ${C.guinda}44` : "none",
            transform: i===active ? "translateY(-2px)" : "none",
          }}>{f.nombre}</button>
        ))}
      </div>

      {/* Solicitar unidad CTA */}
      <div style={{ display:"flex", justifyContent:"center", marginTop:26 }}>
        <a href={`https://wa.me/51940192062?text=${encodeURIComponent(`Hola ABRILP, quisiera cotizar el alquiler de: ${v.nombre}`)}`}
          target="_blank" rel="noreferrer" className="btn-prime">
          Cotizar {v.nombre} <FaArrowRight style={{fontSize:12}}/>
        </a>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   FAQ ACCORDION
══════════════════════════════════════════════════ */
function FaqItem({ item, isOpen, onClick }) {
  return (
    <div className="glass-card" style={{ marginBottom:14, overflow:"hidden" }}>
      <button onClick={onClick} style={{
        width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between",
        gap:16, padding:"22px 26px", background:"transparent", border:"none",
        cursor:"pointer", textAlign:"left",
      }}>
        <span style={{ fontWeight:700, fontSize:15, color:C.blanco }}>{item.q}</span>
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{duration:.25}}
          style={{ color:C.moradoSoft, flexShrink:0, fontSize:13 }}>
          <FaChevronDown/>
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div initial={{ height:0, opacity:0 }} animate={{ height:"auto", opacity:1 }}
            exit={{ height:0, opacity:0 }} transition={{ duration:.28 }} style={{ overflow:"hidden" }}>
            <p style={{ padding:"0 26px 24px", color:C.mist, fontSize:13.5, lineHeight:1.8 }}>
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════ */
export default function Inicio() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [form, setForm] = useState({ nombre:"", correo:"", telefono:"", mensaje:"" });
  const [faqOpen, setFaqOpen] = useState(0);

  const { scrollY: sy } = useScroll();
  useEffect(() => sy.on("change", v => { setScrolled(v > 50); }), [sy]);

  const field = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const send  = e => {
    e.preventDefault();
    const msg = ["Hola ABRILP, quisiera una cotización.",
      form.nombre   && `Nombre: ${form.nombre}`,
      form.correo   && `Correo: ${form.correo}`,
      form.telefono && `Teléfono: ${form.telefono}`,
      form.mensaje  && `Mensaje: ${form.mensaje}`,
    ].filter(Boolean).join("\n");
    window.open(`https://wa.me/51940192062?text=${encodeURIComponent(msg)}`,"_blank","noopener");
  };

  return (
    <div style={{ background:C.night, color:C.blanco, overflowX:"hidden" }}>
      <EstilosGlobales />

      {/* ══════ HEADER ══════ */}
      <header style={{
        position:"fixed", top:0, left:0, right:0, zIndex:200,
        transition:"all .4s cubic-bezier(.22,1,.36,1)",
        background: scrolled ? `rgba(8,5,17,.96)` : "rgba(8,5,17,.2)",
        backdropFilter: scrolled ? "blur(24px) saturate(2)" : "blur(6px)",
        borderBottom: `1px solid ${scrolled ? "rgba(107,94,158,.2)" : "transparent"}`,
      }}>
        {/* Top gradient accent */}
        <div style={{ height:2.5, opacity:scrolled?1:0, transition:"opacity .4s",
          background:`linear-gradient(90deg,transparent,${C.guinda},${C.morado},${C.guinda},transparent)` }} />

        <div style={{ maxWidth:1280, margin:"0 auto", padding:"13px 36px",
          display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          {/* Brand */}
          <a href="#inicio" style={{ display:"flex", alignItems:"center", gap:13, textDecoration:"none" }}>
            <div style={{
              width:46, height:46, borderRadius:12, overflow:"hidden",
              background:`linear-gradient(135deg,${C.guinda},${C.morado})`,
              border:`1px solid rgba(155,142,196,.25)`,
              boxShadow:`0 4px 16px ${C.guinda}44`, flexShrink:0,
              display:"flex", alignItems:"center", justifyContent:"center",
            }}>
              <img src={logo} alt="ABRILP" style={{ width:"100%", height:"100%", objectFit:"contain" }} />
            </div>
            <div>
              <div className="serif" style={{ fontSize:22, color:C.blanco, lineHeight:1, letterSpacing:"-0.03em" }}>ABRILP</div>
              <div className="mono" style={{ fontSize:7.5, color:C.mistFaint, letterSpacing:"0.24em", marginTop:1 }}>TRANSPORTES Y SERVICIOS</div>
            </div>
          </a>

          {/* Nav */}
          <nav className="hide-mob" style={{ display:"flex", gap:26, alignItems:"center" }}>
            {ENLACES_NAV.map(l => (
              <a key={l.href} href={l.href} style={{
                color:C.mistFaint, fontSize:13, fontWeight:500,
                textDecoration:"none", transition:"color .2s",
              }}
              onMouseEnter={e=>e.currentTarget.style.color=C.blanco}
              onMouseLeave={e=>e.currentTarget.style.color=C.mistFaint}
              >{l.label}</a>
            ))}
          </nav>

          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
            <Link to="/login" className="btn-prime hide-mob"
              onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
              onMouseLeave={e=>e.currentTarget.style.transform="none"}
            >Iniciar sesión</Link>
            <button onClick={()=>setMenuOpen(v=>!v)} style={{
              background:"rgba(155,142,196,.09)", border:`1px solid rgba(155,142,196,.22)`,
              color:C.blanco, fontSize:17, cursor:"pointer", padding:"9px 12px", borderRadius:9,
              backdropFilter:"blur(10px)", transition:"all .22s",
            }}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(155,142,196,.18)"}
            onMouseLeave={e=>e.currentTarget.style.background="rgba(155,142,196,.09)"}
            >{menuOpen ? <FaTimes/> : <FaBars/>}</button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}}
              exit={{height:0,opacity:0}} transition={{duration:.26}}
              style={{ overflow:"hidden", background:"rgba(8,5,17,.99)",
                borderTop:`1px solid rgba(107,94,158,.12)` }}>
              <div style={{ padding:"20px 36px 28px", display:"flex", flexDirection:"column", gap:18 }}>
                {ENLACES_NAV.map(l => (
                  <a key={l.href} href={l.href} onClick={()=>setMenuOpen(false)} style={{
                    color:C.mist, fontWeight:500, textDecoration:"none",
                    fontSize:15, padding:"4px 0",
                  }}>{l.label}</a>
                ))}
                <Link to="/login" onClick={()=>setMenuOpen(false)} className="btn-prime"
                  style={{ justifyContent:"center" }}>Iniciar sesión</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ══════ HERO ══════ */}
      <section id="inicio" style={{
        minHeight:"100vh", display:"flex", flexDirection:"column",
        justifyContent:"center", position:"relative", paddingTop:110, overflow:"hidden",
        background:`radial-gradient(ellipse at 12% 58%,${C.guinda}38 0%,transparent 48%),
                    radial-gradient(ellipse at 88% 22%,${C.morado}1e 0%,transparent 44%),
                    radial-gradient(ellipse at 55% 85%,${C.moradoDeep}28 0%,transparent 50%),
                    ${C.night}`,
      }}>
        {/* Grid pattern */}
        <div style={{ position:"absolute", inset:0, pointerEvents:"none",
          backgroundImage:`linear-gradient(rgba(155,142,196,.05) 1px,transparent 1px),
                           linear-gradient(90deg,rgba(155,142,196,.05) 1px,transparent 1px)`,
          backgroundSize:"68px 68px" }} />

        {/* Floating orbs */}
        <div className="orb" style={{
          position:"absolute", width:500, height:500, borderRadius:"50%", top:"-5%", left:"-10%",
          background:`radial-gradient(circle at 32% 32%,${C.guinda}30,${C.morado}14,transparent 70%)`,
          filter:"blur(50px)", pointerEvents:"none",
        }} />
        <div className="orb2" style={{
          position:"absolute", width:380, height:380, borderRadius:"50%", bottom:"8%", right:"-6%",
          background:`radial-gradient(circle at 60% 42%,${C.morado}22,${C.gold}12,transparent 70%)`,
          filter:"blur(44px)", pointerEvents:"none",
        }} />
        <div className="orb3" style={{
          position:"absolute", width:260, height:260, borderRadius:"50%", top:"30%", right:"20%",
          background:`radial-gradient(circle at 50% 50%,${C.cyan}18,transparent 70%)`,
          filter:"blur(40px)", pointerEvents:"none",
        }} />

        <VeinLayer dark />
        <Particles count={26} />

        <div style={{ maxWidth:1280, margin:"0 auto", padding:"56px 36px",
          display:"grid", gridTemplateColumns:"1fr 1fr", gap:72, alignItems:"center",
          position:"relative", zIndex:1 }} className="col2">

          {/* LEFT — Text */}
          <motion.div initial={{opacity:0,y:70}} animate={{opacity:1,y:0}}
            transition={{duration:1.1,ease:[.22,1,.36,1]}}>
            <Eyebrow>ALQUILER DE FLOTA · PERÚ · DESDE 2013</Eyebrow>

            <h1 className="serif" style={{
              fontSize:"clamp(42px,5.6vw,76px)", lineHeight:1.02,
              marginBottom:26, letterSpacing:"-0.03em",
            }}>
              Alquila la unidad{" "}
              <span className="serif-it shimmer-text">exacta</span>{" "}
              <br className="hide-mob"/>que tu obra necesita
            </h1>

            <p style={{ color:C.mist, fontSize:16.5, lineHeight:1.9, maxWidth:460,
              marginBottom:12, fontWeight:300 }}>
              Camiones, volquetes, camionetas 4×4 y cisternas en alquiler por día, semana o mes,
              con o sin operador. Flota propia, asegurada y con GPS para construcción, minería
              y sector público en el sur del Perú.
            </p>

            {/* Trust pills */}
            <div style={{ display:"flex", gap:9, flexWrap:"wrap", marginBottom:36, marginTop:18 }}>
              {["+10 Años","Con/Sin Operador","SOAT Vigente","GPS 24/7"].map(b => (
                <span key={b} className="mono" style={{
                  fontSize:9, padding:"5px 13px", borderRadius:20,
                  background:`${C.guinda}1a`, border:`1px solid ${C.guinda}38`,
                  color:C.moradoSoft, letterSpacing:"0.14em",
                }}>{b}</span>
              ))}
            </div>

            <div style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
              <a href="#alquiler" className="btn-prime">
                Ver planes de alquiler <FaArrowRight style={{fontSize:12}}/>
              </a>
              <a href="#flota" className="btn-ghost">Ver nuestra flota</a>
            </div>

            {/* Stats */}
            <div style={{ display:"flex", gap:40, marginTop:54, paddingTop:32,
              borderTop:`1px solid rgba(155,142,196,.15)` }}>
              {[["+150","Unidades rentadas"],["+50","Clientes"],["24/7","Disponibilidad"],["+10","Años"]].map(([v,l]) => (
                <div key={l} style={{ textAlign:"left" }}>
                  <div className="mono" style={{ fontSize:28, fontWeight:600, color:C.moradoSoft, lineHeight:1 }}>
                    <Counter value={v}/>
                  </div>
                  <div style={{ fontSize:10.5, color:C.mistFaint, marginTop:4, letterSpacing:"0.05em" }}>{l}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT — 3D card */}
          <motion.div initial={{opacity:0,scale:.86,y:30}} animate={{opacity:1,scale:1,y:0}}
            transition={{duration:1.1,delay:.2,ease:[.22,1,.36,1]}}>
            <MagneticCard intensity={9} style={{
              background:`linear-gradient(148deg,${C.nightCardAlt}EE,${C.nightCard}F5)`,
              border:`1px solid rgba(155,142,196,.18)`,
              borderRadius:28, padding:40,
              boxShadow:`0 40px 100px ${C.guindaDeep}80, 0 0 0 1px rgba(155,142,196,.08), inset 0 1px 0 rgba(255,255,255,.04)`,
              backdropFilter:"blur(28px)",
              position:"relative",
            }}>
              {/* Inner glow top border */}
              <div style={{ position:"absolute", top:0, left:-1, right:-1, height:3, borderRadius:"28px 28px 0 0",
                background:`linear-gradient(90deg,transparent,${C.morado}70,${C.guinda}70,transparent)` }} />

              {/* Animated corner accent */}
              <div style={{ position:"absolute", top:-1, right:-1, width:80, height:80, overflow:"hidden", borderRadius:"0 28px 0 0", pointerEvents:"none" }}>
                <div style={{
                  position:"absolute", top:0, right:0, width:0, height:0,
                  borderStyle:"solid", borderWidth:"0 80px 80px 0",
                  borderColor:`transparent ${C.guinda}40 transparent transparent`,
                }} />
              </div>

              {/* 24H badge */}
              <div style={{
                position:"absolute", top:-22, right:32,
                background:`linear-gradient(135deg,${C.guindaDeep},${C.guinda})`,
                borderRadius:"50%", width:72, height:72,
                display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                border:`2px solid ${C.gold}45`,
                boxShadow:`0 10px 28px ${C.guindaDeep}77, 0 0 0 4px rgba(196,149,74,.1)`,
              }}>
                <div className="serif" style={{ fontSize:7.5, color:C.blanco, letterSpacing:2 }}>OPER.</div>
                <div className="mono" style={{ fontSize:12, color:C.goldSoft, fontWeight:600 }}>24H</div>
              </div>

              {/* Logo */}
              <div style={{
                width:"100%", aspectRatio:"1", maxWidth:180, margin:"0 auto 28px",
                background:"#fff", borderRadius:18, display:"flex",
                alignItems:"center", justifyContent:"center", padding:22,
                boxShadow:`0 10px 36px ${C.guindaDeep}45`,
                position:"relative", transformStyle:"preserve-3d",
                transform:"translateZ(20px)",
              }}>
                <img src={logo} alt="ABRILP" style={{ width:"100%", height:"100%", objectFit:"contain" }} />
              </div>

              {/* Feature grid */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, transform:"translateZ(10px)" }}>
                {[
                  { icon:<FaKey/>,       label:"Con/Sin Op.",  desc:"Tú decides" },
                  { icon:<FaRoute/>,     label:"GPS Activo",  desc:"Tiempo real" },
                  { icon:<FaShieldAlt/>, label:"Asegurado",   desc:"Cobertura integral" },
                  { icon:<FaAward/>,     label:"+10 Años",    desc:"De experiencia" },
                ].map(item => (
                  <div key={item.label} style={{
                    background:`linear-gradient(135deg,rgba(13,9,24,.8),rgba(18,14,28,.9))`,
                    borderRadius:12, padding:"14px 16px",
                    border:`1px solid rgba(155,142,196,.15)`,
                    backdropFilter:"blur(10px)", display:"flex", flexDirection:"column", gap:4,
                    transition:"all .25s",
                  }}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=`${C.morado}50`;e.currentTarget.style.transform="translateY(-2px)";}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(155,142,196,.15)";e.currentTarget.style.transform="none";}}
                  >
                    <span style={{ color:C.moradoSoft, fontSize:16 }}>{item.icon}</span>
                    <span style={{ fontSize:13, fontWeight:600, color:C.blanco }}>{item.label}</span>
                    <span style={{ fontSize:9.5, color:C.mistFaint }}>{item.desc}</span>
                  </div>
                ))}
              </div>
            </MagneticCard>
          </motion.div>
        </div>

        {/* Bottom gradient line */}
        <div style={{ height:2, width:"100%", position:"relative", zIndex:1,
          background:`linear-gradient(90deg,transparent,${C.guinda},${C.morado},${C.cyan}44,${C.morado},${C.guinda},transparent)` }} />
      </section>

      {/* ══════ NOSOTROS ══════ */}
      <section id="nosotros" style={{
        padding:"120px 36px", position:"relative", overflow:"hidden",
        background:`linear-gradient(180deg,${C.paper} 0%,#EEE8F8 100%)`,
      }}>
        <div style={{ position:"absolute", top:-120, right:-80, width:480, height:480,
          borderRadius:"50%", background:`${C.guinda}06`, filter:"blur(70px)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:-80, left:-60, width:360, height:360,
          borderRadius:"50%", background:`${C.morado}07`, filter:"blur(60px)", pointerEvents:"none" }} />
        <VeinLayer dark={false} />

        <div style={{ maxWidth:1280, margin:"0 auto", display:"grid",
          gridTemplateColumns:"1fr 1fr", gap:80, alignItems:"center", position:"relative", zIndex:1 }} className="col2">

          <motion.div initial={{opacity:0,x:-60}} whileInView={{opacity:1,x:0}}
            viewport={{once:true}} transition={{duration:.9}}>
            <Eyebrow dark>QUIÉNES SOMOS</Eyebrow>
            <h2 className="serif" style={{ fontSize:44, color:C.guindaDeep, marginBottom:20, lineHeight:1.08 }}>
              Empresa peruana con<br/>
              <span className="serif-it" style={{ color:C.guinda }}>más de una década</span> en ruta
            </h2>
            <div style={{ width:52, height:3, borderRadius:2, marginBottom:28,
              background:`linear-gradient(90deg,${C.guinda},${C.morado})` }} />
            <p style={{ color:C.inkMuted, lineHeight:1.9, fontSize:15.5, marginBottom:18 }}>
              ABRILP Transportes y Servicios S.R.L. es una empresa peruana especializada en
              alquiler de flota, transporte de carga y logística integral para empresas privadas,
              obras de construcción, minería y entidades del sector público.
            </p>
            <p style={{ color:C.inkMuted, lineHeight:1.9, fontSize:15.5, marginBottom:32 }}>
              Contamos con flota propia equipada con GPS, choferes certificados y pólizas de seguro
              vigentes que garantizan seguridad y puntualidad en cada unidad rentada en el sur del Perú.
            </p>
            <div style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
              <a href="#alquiler" className="btn-prime"
                onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
                onMouseLeave={e=>e.currentTarget.style.transform="none"}
              >Ver planes de alquiler <FaArrowRight style={{fontSize:12}}/></a>
              <a href="#servicios" className="btn-ghost">Ver servicios</a>
            </div>
          </motion.div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18 }}>
            {[
              { icon:<FaBullseye/>, titulo:"Misión",      texto:"Brindar servicios de alquiler y transporte de alta calidad garantizando seguridad y satisfacción en cada proyecto.", color:C.guinda },
              { icon:<FaEye/>,      titulo:"Visión",       texto:"Consolidarnos como empresa líder en alquiler de flota y logística en el sur del Perú, reconocida por excelencia.", color:C.morado },
              { icon:<FaShieldAlt/>,titulo:"Seguridad",    texto:"Toda la flota en alquiler cuenta con SOAT, revisión técnica actualizada y póliza de seguro integral vigente.", color:C.guindaSoft },
              { icon:<FaAward/>,    titulo:"Experiencia",  texto:"Más de 10 años de trayectoria en alquiler de unidades y transporte para construcción, minería y sector público.", color:C.gold },
            ].map((item,i) => (
              <motion.div key={i} initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}}
                viewport={{once:true}} transition={{duration:.6,delay:i*.1}}
                className="light-card" style={{ padding:"26px 22px" }}>
                <div style={{ position:"absolute", top:0, left:0, right:0, height:3,
                  background:`linear-gradient(90deg,${item.color},transparent)` }} />
                <div style={{
                  width:48, height:48, borderRadius:13, marginBottom:14,
                  background:`${item.color}14`, border:`1px solid ${item.color}28`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:20, color:item.color,
                  boxShadow:`0 4px 16px ${item.color}18`,
                }}>{item.icon}</div>
                <div style={{ fontWeight:700, fontSize:15, color:C.guindaDeep, marginBottom:8 }}>{item.titulo}</div>
                <div style={{ fontSize:12.5, color:C.inkMuted, lineHeight:1.72 }}>{item.texto}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ VALORES ══════ */}
      <section style={{
        padding:"72px 36px",
        background:`linear-gradient(135deg,${C.guindaDeep},#1E0F32,${C.moradoDeep})`,
        position:"relative", overflow:"hidden",
      }}>
        <div style={{ position:"absolute", inset:0, pointerEvents:"none",
          backgroundImage:`linear-gradient(rgba(155,142,196,.06) 1px,transparent 1px),
                           linear-gradient(90deg,rgba(155,142,196,.06) 1px,transparent 1px)`,
          backgroundSize:"44px 44px" }} />
        <VeinLayer dark />

        <div style={{ maxWidth:1280, margin:"0 auto", display:"grid",
          gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:22, position:"relative", zIndex:1 }}>
          {VALORES.map((v,i) => (
            <motion.div key={i} initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}}
              viewport={{once:true}} transition={{duration:.55,delay:i*.1}}
              style={{
                background:"rgba(18,14,28,.6)", borderRadius:18, padding:"28px 24px",
                border:`1px solid rgba(155,142,196,.15)`,
                backdropFilter:"blur(16px)", textAlign:"center",
                transition:"all .3s",
              }}
              whileHover={{ y:-5, borderColor:`${v.color}55`, boxShadow:`0 18px 40px ${C.guindaDeep}66` }}>
              <div style={{
                width:54, height:54, borderRadius:16, margin:"0 auto 16px",
                background:`${v.color}20`, border:`1px solid ${v.color}35`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:22, color:v.color,
              }}>{v.icon}</div>
              <div style={{ fontWeight:700, fontSize:15, color:C.blanco, marginBottom:8 }}>{v.titulo}</div>
              <div style={{ fontSize:12.5, color:C.mist, lineHeight:1.7 }}>{v.texto}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════ PLANES DE ALQUILER ══════ */}
      <section id="alquiler" style={{
        padding:"120px 36px", position:"relative", overflow:"hidden",
        background:`linear-gradient(180deg,${C.nightMid} 0%,${C.night} 100%)`,
      }}>
        <VeinLayer dark />
        <Particles count={18}/>

        <div style={{ maxWidth:1280, margin:"0 auto", position:"relative", zIndex:1 }}>
          <motion.div initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}}
            viewport={{once:true}} transition={{duration:.7}}
            style={{ textAlign:"center", marginBottom:60 }}>
            <Eyebrow center>PLANES DE ALQUILER</Eyebrow>
            <h2 className="serif" style={{ fontSize:48, letterSpacing:"-0.025em" }}>Renta tu unidad, sin complicaciones</h2>
            <p style={{ color:C.mistFaint, marginTop:14, fontSize:14.5, maxWidth:560, margin:"14px auto 0" }}>
              Elige el plazo que mejor se ajuste a tu operación. Todas las tarifas incluyen
              seguro, SOAT y soporte durante la vigencia del contrato.
            </p>
          </motion.div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:24, marginBottom:64 }}>
            {PLANES_ALQUILER.map((p,i) => (
              <motion.div key={i} initial={{opacity:0,y:50}} whileInView={{opacity:1,y:0}}
                viewport={{once:true}} transition={{duration:.6,delay:i*.1}}
                className="glass-card" style={{
                  padding: p.destacado ? "42px 32px" : "36px 30px",
                  border: p.destacado ? `1.5px solid ${p.color}80` : undefined,
                  transform: p.destacado ? "translateY(-14px)" : "none",
                  boxShadow: p.destacado ? `0 30px 70px ${C.guindaDeep}80` : undefined,
                }}>
                {p.destacado && (
                  <span className="mono" style={{
                    position:"absolute", top:18, right:18, fontSize:8.5, fontWeight:700,
                    letterSpacing:"0.16em", padding:"5px 12px", borderRadius:20,
                    background:`${C.gold}25`, color:C.goldSoft, border:`1px solid ${C.gold}50`,
                  }}>MÁS ELEGIDO</span>
                )}
                <div style={{
                  width:52, height:52, borderRadius:15, marginBottom:20,
                  background:`linear-gradient(135deg,${p.color}28,${p.color}0e)`,
                  border:`1px solid ${p.color}40`, fontSize:20, color:p.color,
                  display:"flex", alignItems:"center", justifyContent:"center",
                }}>{p.icon}</div>
                <h3 style={{ fontWeight:700, fontSize:19, color:C.blanco, marginBottom:6 }}>{p.nombre}</h3>
                <p style={{ fontSize:12, color:C.mistFaint, marginBottom:20 }}>{p.ideal}</p>
                <div style={{ display:"flex", alignItems:"baseline", gap:6, marginBottom:24 }}>
                  <span className="serif" style={{ fontSize:28, color:C.blanco }}>{p.precio}</span>
                  {p.periodo && <span className="mono" style={{ fontSize:11, color:C.mistFaint }}>{p.periodo}</span>}
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:28 }}>
                  {p.items.map(it => (
                    <div key={it} style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
                      <FaCheckCircle style={{ color:p.color, fontSize:13, marginTop:2, flexShrink:0 }}/>
                      <span style={{ fontSize:13, color:C.mist, lineHeight:1.6 }}>{it}</span>
                    </div>
                  ))}
                </div>
                <a href={`https://wa.me/51940192062?text=${encodeURIComponent(`Hola ABRILP, quisiera cotizar el plan: ${p.nombre}`)}`}
                  target="_blank" rel="noreferrer"
                  className={p.destacado ? "btn-prime" : "btn-ghost"}
                  style={{ width:"100%", justifyContent:"center" }}>
                  Solicitar este plan <FaArrowRight style={{fontSize:11}}/>
                </a>
              </motion.div>
            ))}
          </div>

          {/* Beneficios del alquiler */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:20 }}>
            {BENEFICIOS_ALQUILER.map((b,i) => (
              <motion.div key={i} initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}}
                viewport={{once:true}} transition={{duration:.5,delay:i*.07}}
                style={{ display:"flex", gap:16, padding:"20px 4px" }}>
                <div style={{
                  width:44, height:44, borderRadius:12, flexShrink:0,
                  background:`${C.moradoSoft}18`, border:`1px solid ${C.moradoSoft}35`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:17, color:C.moradoSoft,
                }}>{b.icon}</div>
                <div>
                  <div style={{ fontWeight:700, fontSize:14, color:C.blanco, marginBottom:6 }}>{b.titulo}</div>
                  <div style={{ fontSize:12.5, color:C.mist, lineHeight:1.7 }}>{b.texto}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ SERVICIOS ══════ */}
      <section id="servicios" style={{
        padding:"120px 36px", position:"relative", overflow:"hidden",
        background:`linear-gradient(180deg,${C.night} 0%,${C.nightMid} 100%)`,
      }}>
        <VeinLayer dark />
        <Particles count={20}/>

        <div style={{ maxWidth:1280, margin:"0 auto", position:"relative", zIndex:1 }}>
          <motion.div initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}}
            viewport={{once:true}} transition={{duration:.7}}
            style={{ textAlign:"center", marginBottom:64 }}>
            <Eyebrow center>SERVICIOS</Eyebrow>
            <h2 className="serif" style={{ fontSize:48, letterSpacing:"-0.025em" }}>Nuestros servicios</h2>
            <p style={{ color:C.mistFaint, marginTop:14, fontSize:14.5, maxWidth:500, margin:"14px auto 0" }}>
              Soluciones completas de alquiler, transporte y logística para cada necesidad
            </p>
          </motion.div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:22 }}>
            {SERVICIOS.map((s,i) => (
              <motion.div key={i} initial={{opacity:0,y:50}} whileInView={{opacity:1,y:0}}
                viewport={{once:true}} transition={{duration:.6,delay:i*.1}}
                className="glass-card svc-card" style={{
                  padding:"36px 30px", "--acc":s.accent,
                  border: s.destacado ? `1.5px solid ${s.accent}60` : undefined,
                }}
                onMouseMove={e=>{
                  const r=e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty("--mx",`${((e.clientX-r.left)/r.width)*100}%`);
                  e.currentTarget.style.setProperty("--my",`${((e.clientY-r.top)/r.height)*100}%`);
                }}>
                {s.destacado && (
                  <span className="mono" style={{
                    position:"absolute", top:18, right:18, fontSize:8, fontWeight:700,
                    letterSpacing:"0.14em", padding:"4px 10px", borderRadius:20,
                    background:`${s.accent}25`, color:C.goldSoft, border:`1px solid ${s.accent}50`,
                  }}>ESTRELLA</span>
                )}
                <div style={{
                  width:56, height:56, borderRadius:15, marginBottom:22,
                  background:`linear-gradient(135deg,${s.accent}28,${s.accent}0e)`,
                  border:`1px solid ${s.accent}40`, fontSize:22, color:s.accent,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  boxShadow:`0 4px 18px ${s.accent}22`,
                  transition:"all .3s",
                }}
                onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.12) rotate(5deg)";e.currentTarget.style.boxShadow=`0 8px 28px ${s.accent}44`;}}
                onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow=`0 4px 18px ${s.accent}22`;}}
                >{s.icon}</div>
                <h3 style={{ fontWeight:700, fontSize:17.5, marginBottom:12, color:C.blanco }}>{s.titulo}</h3>
                <p style={{ color:C.mist, fontSize:13.5, lineHeight:1.8 }}>{s.texto}</p>
                <div style={{ marginTop:22, display:"flex", alignItems:"center", gap:6,
                  color:s.accent, fontSize:12, fontWeight:600, opacity:.75 }}>
                  Saber más <FaArrowRight style={{fontSize:10}}/>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ PROCESO ══════ */}
      <section id="proceso" style={{
        padding:"120px 36px", position:"relative", overflow:"hidden",
        background:`linear-gradient(180deg,#F5F0FC 0%,${C.paper} 100%)`,
      }}>
        <div style={{ position:"absolute", inset:0, pointerEvents:"none",
          backgroundImage:`linear-gradient(rgba(107,94,158,.04) 1px,transparent 1px),
                           linear-gradient(90deg,rgba(107,94,158,.04) 1px,transparent 1px)`,
          backgroundSize:"52px 52px" }} />
        <VeinLayer dark={false}/>

        <div style={{ maxWidth:1280, margin:"0 auto", position:"relative", zIndex:1 }}>
          <motion.div initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}}
            viewport={{once:true}} transition={{duration:.7}}
            style={{ textAlign:"center", marginBottom:70 }}>
            <Eyebrow center dark>CÓMO TRABAJAMOS</Eyebrow>
            <h2 className="serif" style={{ fontSize:46, color:C.guindaDeep, lineHeight:1.08 }}>
              Un proceso claro,<br/>
              <span className="serif-it">de la solicitud a la entrega</span>
            </h2>
          </motion.div>

          {/* Steps */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",
            gap:0, position:"relative" }}>
            {/* Connector line */}
            <div className="hide-mob" style={{
              position:"absolute", top:38, left:"12.5%", right:"12.5%", height:2, zIndex:0,
              background:`linear-gradient(90deg,${C.guinda}40,${C.morado}40,${C.guinda}40)`,
            }} />

            {PROCESO.map((p,i) => (
              <motion.div key={p.n} initial={{opacity:0,y:50}} whileInView={{opacity:1,y:0}}
                viewport={{once:true}} transition={{duration:.65,delay:i*.15}}
                style={{ padding:"0 24px", position:"relative", textAlign:"left" }}>
                <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:22 }}>
                  <div style={{
                    width:64, height:64, borderRadius:18, flexShrink:0, zIndex:1,
                    background:`linear-gradient(135deg,${C.guinda},${C.morado})`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:24, color:C.blanco,
                    boxShadow:`0 10px 30px ${C.guinda}44`,
                  }}>{p.icon}</div>
                  <span className="mono" style={{ fontSize:32, fontWeight:600,
                    color:C.lavandaDeep, lineHeight:1 }}>{p.n}</span>
                </div>
                <div style={{ width:44, height:3, borderRadius:2, marginBottom:16,
                  background:`linear-gradient(90deg,${C.guinda},${C.morado})` }} />
                <h3 style={{ fontWeight:700, fontSize:18, color:C.guindaDeep, marginBottom:10 }}>{p.titulo}</h3>
                <p style={{ fontSize:13.5, color:C.inkMuted, lineHeight:1.8 }}>{p.texto}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ FLOTA ══════ */}
      <section id="flota" style={{
        padding:"120px 36px", background:C.night, position:"relative", overflow:"hidden",
      }}>
        <VeinLayer dark/>
        <Particles count={24}/>

        <div style={{ maxWidth:1280, margin:"0 auto", position:"relative", zIndex:1 }}>
          <motion.div initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}}
            viewport={{once:true}} transition={{duration:.7}}
            style={{ textAlign:"center", marginBottom:52 }}>
            <Eyebrow center>FLOTA EN ALQUILER</Eyebrow>
            <h2 className="serif" style={{ fontSize:46 }}>Nuestra flota</h2>
            <p style={{ color:C.mistFaint, marginTop:12, fontSize:14 }}>
              Tarifas referenciales por unidad — las unidades rotan automáticamente, o explóralas con los controles
            </p>
          </motion.div>
          <FleetCarousel/>
        </div>
      </section>

      {/* ══════ ESTADÍSTICAS ══════ */}
      <section style={{
        padding:"100px 36px", position:"relative", overflow:"hidden",
        background:`linear-gradient(135deg,${C.guindaDeep},#1E0A2E,${C.nightCard})`,
        borderTop:`1px solid rgba(107,94,158,.2)`, borderBottom:`1px solid rgba(107,94,158,.2)`,
      }}>
        <div style={{ position:"absolute", inset:0, pointerEvents:"none",
          background:`radial-gradient(ellipse at 28% 50%,${C.morado}18,transparent 58%),
                      radial-gradient(ellipse at 74% 50%,${C.guinda}14,transparent 56%)` }} />
        <VeinLayer dark/>

        <div style={{ maxWidth:1280, margin:"0 auto", display:"grid",
          gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:40,
          textAlign:"center", position:"relative", zIndex:1 }}>
          {[["+150","Unidades rentadas"],["+50","Clientes atendidos"],
            ["+10","Años de experiencia"],["24/7","Disponibilidad"]].map(([v,l],i) => (
            <motion.div key={i} initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}}
              viewport={{once:true}} transition={{duration:.6,delay:i*.1}}>
              <div className="mono" style={{ fontSize:48, fontWeight:600, color:C.moradoSoft,
                lineHeight:1, letterSpacing:"-0.025em", marginBottom:10 }}>
                <Counter value={v}/>
              </div>
              <div style={{ fontSize:12, color:C.mist, letterSpacing:"0.06em" }}>{l}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════ CLIENTES ══════ */}
      <section id="clientes" style={{
        padding:"120px 36px", position:"relative", overflow:"hidden",
        background:`linear-gradient(180deg,#0D0918 0%,${C.nightCard} 100%)`,
      }}>
        <VeinLayer dark/>

        <div style={{ maxWidth:1280, margin:"0 auto", position:"relative", zIndex:1 }}>
          <motion.div initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}}
            viewport={{once:true}} transition={{duration:.7}}
            style={{ textAlign:"center", marginBottom:56 }}>
            <Eyebrow center>CLIENTES</Eyebrow>
            <h2 className="serif" style={{ fontSize:46 }}>Empresas que confían en nosotros</h2>
          </motion.div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:20 }}>
            {[
              { name:"Municipalidad de Puno", icon:<FaUsers/> },
              { name:"Constructora Sur SAC",  icon:<FaHardHat/> },
              { name:"Calixto Group",         icon:<FaChartLine/> },
              { name:"Empresas privadas",     icon:<FaHandshake/> },
            ].map((cl,i) => (
              <motion.div key={i} initial={{opacity:0,scale:.88}} whileInView={{opacity:1,scale:1}}
                viewport={{once:true}} transition={{duration:.5,delay:i*.09}}
                className="glass-card"
                style={{ padding:"32px 24px", textAlign:"center" }}
                whileHover={{ y:-6, boxShadow:`0 22px 50px ${C.guindaDeep}66` }}
                onMouseMove={e=>{
                  const r=e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty("--mx",`${((e.clientX-r.left)/r.width)*100}%`);
                  e.currentTarget.style.setProperty("--my",`${((e.clientY-r.top)/r.height)*100}%`);
                }}>
                <div style={{ position:"absolute", top:0, left:0, right:0, height:3,
                  background:`linear-gradient(90deg,${C.guinda},${C.morado})` }} />
                <div style={{
                  width:48, height:48, borderRadius:13, background:`${C.guinda}22`,
                  border:`1px solid ${C.guinda}38`, display:"flex", alignItems:"center",
                  justifyContent:"center", margin:"0 auto 16px", fontSize:20, color:C.guindaSoft,
                }}>{cl.icon}</div>
                <div style={{ fontWeight:700, fontSize:14.5, color:C.lavanda }}>{cl.name}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ TESTIMONIOS ══════ */}
      <section style={{
        padding:"120px 36px", background:C.nightMid, position:"relative", overflow:"hidden",
      }}>
        <VeinLayer dark/>
        <Particles count={16}/>

        <div style={{ maxWidth:1280, margin:"0 auto", position:"relative", zIndex:1 }}>
          <motion.div initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}}
            viewport={{once:true}} transition={{duration:.7}}
            style={{ textAlign:"center", marginBottom:56 }}>
            <Eyebrow center>TESTIMONIOS</Eyebrow>
            <h2 className="serif" style={{ fontSize:46 }}>
              La voz de quienes<br/>
              <span className="serif-it" style={{ color:C.moradoSoft }}>ya trabajan con nosotros</span>
            </h2>
          </motion.div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:24 }}>
            {TESTIMONIOS.map((t,i) => (
              <motion.div key={i} initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}}
                viewport={{once:true}} transition={{duration:.65,delay:i*.12}}
                className="glass-card"
                style={{ padding:"36px 30px", display:"flex", flexDirection:"column" }}
                onMouseMove={e=>{
                  const r=e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty("--mx",`${((e.clientX-r.left)/r.width)*100}%`);
                  e.currentTarget.style.setProperty("--my",`${((e.clientY-r.top)/r.height)*100}%`);
                }}>
                {/* Quote icon */}
                <FaQuoteLeft style={{ color:C.moradoSoft, opacity:.45, fontSize:24, marginBottom:20 }}/>

                {/* Stars */}
                <div style={{ display:"flex", gap:4, marginBottom:16 }}>
                  {Array(t.rating).fill(0).map((_,j) => (
                    <FaStar key={j} style={{ color:C.gold, fontSize:12 }}/>
                  ))}
                </div>

                <p style={{ color:C.mist, fontSize:14.5, lineHeight:1.85, marginBottom:26,
                  flex:1, fontStyle:"italic" }}>
                  "{t.texto}"
                </p>

                <div style={{ borderTop:`1px solid rgba(155,142,196,.2)`, paddingTop:18,
                  display:"flex", alignItems:"center", gap:14 }}>
                  <div style={{
                    width:42, height:42, borderRadius:"50%", flexShrink:0,
                    background:`linear-gradient(135deg,${C.guinda},${C.morado})`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:15, color:C.blanco, fontWeight:700,
                    boxShadow:`0 4px 14px ${C.guinda}44`,
                  }}>{t.autor.charAt(0)}</div>
                  <div>
                    <div style={{ fontWeight:700, fontSize:13.5, color:C.blanco }}>{t.autor}</div>
                    <div className="mono" style={{ fontSize:9, color:C.mistFaint,
                      letterSpacing:"0.12em", marginTop:3 }}>{t.empresa.toUpperCase()}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ POR QUÉ ELEGIRNOS ══════ */}
      <section style={{
        padding:"120px 36px", position:"relative", overflow:"hidden",
        background:`linear-gradient(180deg,#F5F0FC 0%,${C.paper} 100%)`,
      }}>
        <VeinLayer dark={false}/>
        <div style={{ position:"absolute", top:-80, right:-80, width:440, height:440,
          borderRadius:"50%", background:`${C.guinda}05`, filter:"blur(70px)", pointerEvents:"none" }} />

        <div style={{ maxWidth:1280, margin:"0 auto", position:"relative", zIndex:1 }}>
          <motion.div initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}}
            viewport={{once:true}} transition={{duration:.7}}
            style={{ textAlign:"center", marginBottom:60 }}>
            <Eyebrow center dark>DIFERENCIAL</Eyebrow>
            <h2 className="serif" style={{ fontSize:46, color:C.guindaDeep }}>¿Por qué elegirnos?</h2>
          </motion.div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:22 }}>
            {[
              { icon:<FaKey/>,       titulo:"Con o sin operador",     texto:"Alquila la unidad sola o con chofer certificado de nuestra planilla, según lo que necesite tu operación.", color:C.guinda },
              { icon:<FaShieldAlt/>, titulo:"Seguridad integral",    texto:"Toda la flota opera con SOAT, revisión técnica al día y póliza de seguro integral vigente.", color:C.morado },
              { icon:<FaClock/>,     titulo:"Puntualidad garantizada",texto:"Cumplimos cronogramas y plazos acordados. Comunicación constante durante todo el trayecto.", color:C.guindaSoft },
              { icon:<FaAward/>,     titulo:"+10 años de trayectoria",texto:"Década de experiencia en alquiler de unidades para construcción, minería y entidades públicas.", color:C.gold },
              { icon:<FaRoute/>,     titulo:"Cobertura y GPS 24/7",   texto:"Rastreo satelital en tiempo real y cobertura en zonas mineras de difícil acceso del sur.", color:C.cyan },
              { icon:<FaTools/>,     titulo:"Flota propia y moderna", texto:"Vehículos propios en óptimo estado operativo, con mantenimiento cubierto durante el alquiler.", color:C.moradoSoft },
            ].map((item,i) => (
              <motion.div key={i} initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}}
                viewport={{once:true}} transition={{duration:.6,delay:i*.08}}
                className="light-card" style={{ padding:"36px 26px", textAlign:"center" }}>
                <div style={{ position:"absolute", top:0, left:"18%", right:"18%", height:2.5,
                  background:`linear-gradient(90deg,transparent,${item.color},transparent)` }} />
                <div style={{
                  width:60, height:60, borderRadius:17, margin:"0 auto 20px",
                  background:`linear-gradient(135deg,${item.color}18,${item.color}08)`,
                  border:`1px solid ${item.color}28`, fontSize:24, color:item.color,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  boxShadow:`0 4px 20px ${item.color}20`,
                  transition:"all .3s",
                }}
                onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.1) rotate(5deg)";e.currentTarget.style.boxShadow=`0 8px 28px ${item.color}38`;}}
                onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow=`0 4px 20px ${item.color}20`;}}
                >{item.icon}</div>
                <h3 style={{ fontWeight:700, fontSize:15.5, color:C.guindaDeep, marginBottom:10 }}>{item.titulo}</h3>
                <p style={{ fontSize:13, color:C.inkMuted, lineHeight:1.78 }}>{item.texto}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ CERTIFICACIONES ══════ */}
      <section style={{
        padding:"52px 36px",
        background:`linear-gradient(135deg,${C.guindaDeep},#24103C)`,
        position:"relative", overflow:"hidden",
      }}>
        <div style={{ position:"absolute", inset:0, pointerEvents:"none",
          backgroundImage:`linear-gradient(rgba(155,142,196,.07) 1px,transparent 1px),
                           linear-gradient(90deg,rgba(155,142,196,.07) 1px,transparent 1px)`,
          backgroundSize:"38px 38px" }} />
        <VeinLayer dark/>

        <div style={{ maxWidth:1280, margin:"0 auto",
          display:"flex", flexWrap:"wrap", justifyContent:"center", gap:"26px 48px",
          position:"relative", zIndex:1 }}>
          {CERTIFICACIONES.map((cert,i) => (
            <motion.div key={i} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}}
              viewport={{once:true}} transition={{duration:.4,delay:i*.07}}
              style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{
                width:38, height:38, borderRadius:11,
                background:`${C.gold}22`, border:`1px solid ${C.gold}38`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:15, color:C.goldSoft,
              }}>{cert.icon}</div>
              <span style={{ fontSize:13.5, fontWeight:600, color:C.lavanda, letterSpacing:".01em" }}>
                {cert.label}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════ FAQ ALQUILER ══════ */}
      <section style={{
        padding:"120px 36px", position:"relative", overflow:"hidden",
        background:`linear-gradient(180deg,${C.night} 0%,${C.nightMid} 100%)`,
      }}>
        <VeinLayer dark/>

        <div style={{ maxWidth:820, margin:"0 auto", position:"relative", zIndex:1 }}>
          <motion.div initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}}
            viewport={{once:true}} transition={{duration:.7}}
            style={{ textAlign:"center", marginBottom:52 }}>
            <Eyebrow center>PREGUNTAS FRECUENTES</Eyebrow>
            <h2 className="serif" style={{ fontSize:42 }}>Sobre el alquiler de unidades</h2>
          </motion.div>

          {FAQ_ALQUILER.map((item,i) => (
            <FaqItem key={i} item={item} isOpen={faqOpen===i} onClick={()=>setFaqOpen(faqOpen===i?-1:i)} />
          ))}
        </div>
      </section>

      {/* ══════ CONTACTO ══════ */}
      <section id="contacto" style={{
        padding:"120px 36px", position:"relative", overflow:"hidden",
        background:`linear-gradient(180deg,#060410 0%,${C.nightMid} 100%)`,
      }}>
        <VeinLayer dark/>
        <Particles count={22}/>

        <div style={{ maxWidth:1280, margin:"0 auto", display:"grid",
          gridTemplateColumns:"1fr 1fr", gap:72, alignItems:"start",
          position:"relative", zIndex:1 }} className="col2">

          {/* Left */}
          <motion.div initial={{opacity:0,x:-40}} whileInView={{opacity:1,x:0}}
            viewport={{once:true}} transition={{duration:.9}}>
            <Eyebrow>CONTACTO</Eyebrow>
            <h2 className="serif" style={{ fontSize:46, marginBottom:14, lineHeight:1.08 }}>
              Conversemos sobre<br/>
              <span className="serif-it" style={{ color:C.moradoSoft }}>tu próximo alquiler</span>
            </h2>
            <p style={{ color:C.mist, fontSize:15.5, lineHeight:1.85, marginBottom:40, maxWidth:400 }}>
              Estamos listos para atenderte sin compromiso. Completa el formulario o contáctanos
              directamente por WhatsApp para una respuesta inmediata.
            </p>

            {[
              { icon:<FaMapMarkerAlt/>, text:"Arequipa, Perú", acc:C.guinda },
              { icon:<FaPhoneAlt/>,     text:"940 192 062",    acc:C.morado },
              { icon:<FaEnvelope/>,     text:"administracion@abrilp.com", acc:C.gold },
            ].map((item,i) => (
              <motion.div key={i} initial={{opacity:0,x:-28}} whileInView={{opacity:1,x:0}}
                viewport={{once:true}} transition={{duration:.5,delay:i*.1+.3}}
                style={{ display:"flex", alignItems:"center", gap:18, marginBottom:24 }}>
                <div style={{
                  width:46, height:46, borderRadius:13, flexShrink:0,
                  background:`${item.acc}20`, border:`1px solid ${item.acc}38`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:17, color:item.acc,
                  boxShadow:`0 4px 18px ${item.acc}22`,
                }}>{item.icon}</div>
                <span style={{ color:C.mist, fontSize:15.5 }}>{item.text}</span>
              </motion.div>
            ))}

            {/* WhatsApp direct */}
            <motion.a href="https://wa.me/51940192062" target="_blank" rel="noreferrer"
              initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}}
              viewport={{once:true}} transition={{duration:.6,delay:.65}}
              style={{
                display:"flex", alignItems:"center", gap:18, marginTop:36,
                background:"linear-gradient(135deg,rgba(34,197,94,.14),rgba(34,197,94,.06))",
                border:"1px solid rgba(34,197,94,.32)", borderRadius:18, padding:"20px 26px",
                textDecoration:"none", backdropFilter:"blur(14px)", transition:"all .3s",
              }}
              onMouseEnter={e=>{e.currentTarget.style.background="linear-gradient(135deg,rgba(34,197,94,.22),rgba(34,197,94,.12))";e.currentTarget.style.transform="translateY(-2px)";}}
              onMouseLeave={e=>{e.currentTarget.style.background="linear-gradient(135deg,rgba(34,197,94,.14),rgba(34,197,94,.06))";e.currentTarget.style.transform="none";}}
            >
              <FaWhatsapp style={{ fontSize:30, color:"#22C55E", flexShrink:0 }}/>
              <div>
                <div style={{ fontWeight:700, fontSize:15, color:C.blanco }}>Escríbenos por WhatsApp</div>
                <div style={{ fontSize:12.5, color:"rgba(34,197,94,.75)", marginTop:2 }}>+51 940 192 062 — Respuesta inmediata</div>
              </div>
            </motion.a>
          </motion.div>

          {/* Right — Form */}
          <motion.div initial={{opacity:0,x:40}} whileInView={{opacity:1,x:0}}
            viewport={{once:true}} transition={{duration:.9}}>
            <MagneticCard intensity={4} style={{
              background:`linear-gradient(148deg,${C.nightCardAlt}EE,${C.nightCard}F5)`,
              borderRadius:26, padding:42,
              border:`1px solid rgba(155,142,196,.18)`,
              boxShadow:`0 28px 72px ${C.guindaDeep}60, inset 0 1px 0 rgba(255,255,255,.04)`,
              backdropFilter:"blur(24px)", position:"relative",
            }}>
              <div style={{ position:"absolute", top:0, left:0, right:0, height:2.5, borderRadius:"26px 26px 0 0",
                background:`linear-gradient(90deg,transparent,${C.morado}65,${C.guinda}65,transparent)` }} />

              <h3 className="serif" style={{ fontSize:24, marginBottom:8, color:C.blanco }}>
                Solicitar cotización de alquiler
              </h3>
              <p style={{ color:C.mistFaint, fontSize:13, marginBottom:28 }}>
                Te respondemos en menos de 2 horas en horario hábil.
              </p>

              <form onSubmit={send}>
                {[
                  { k:"nombre",   lbl:"Nombre completo",    ph:"Ej. Juan Pérez",    t:"text"  },
                  { k:"correo",   lbl:"Correo electrónico", ph:"ejemplo@correo.com", t:"email" },
                  { k:"telefono", lbl:"Teléfono / WhatsApp",ph:"999 999 999",        t:"text"  },
                ].map(f => (
                  <div key={f.k} style={{ marginBottom:20 }}>
                    <label className="mono" style={{
                      fontSize:8.5, letterSpacing:"0.24em", color:C.mistFaint,
                      textTransform:"uppercase", display:"block", marginBottom:8,
                    }}>{f.lbl}</label>
                    <input type={f.t} value={form[f.k]} onChange={field(f.k)} placeholder={f.ph}
                      style={{
                        width:"100%", padding:"13px 16px", borderRadius:10,
                        background:"rgba(8,5,17,.75)", border:`1px solid rgba(155,142,196,.2)`,
                        color:C.blanco, fontSize:14, outline:"none",
                        transition:"border-color .22s, box-shadow .22s",
                        backdropFilter:"blur(10px)",
                      }}
                      onFocus={e=>{e.target.style.borderColor=C.morado;e.target.style.boxShadow=`0 0 0 3.5px ${C.morado}20`;}}
                      onBlur={e=>{e.target.style.borderColor="rgba(155,142,196,.2)";e.target.style.boxShadow="none";}}
                    />
                  </div>
                ))}

                <div style={{ marginBottom:28 }}>
                  <label className="mono" style={{
                    fontSize:8.5, letterSpacing:"0.24em", color:C.mistFaint,
                    textTransform:"uppercase", display:"block", marginBottom:8,
                  }}>Mensaje</label>
                  <textarea rows={4} value={form.mensaje} onChange={field("mensaje")}
                    placeholder="Cuéntanos qué unidad necesitas alquilar, el plazo y la fecha."
                    style={{
                      width:"100%", padding:"13px 16px", borderRadius:10,
                      background:"rgba(8,5,17,.75)", border:`1px solid rgba(155,142,196,.2)`,
                      color:C.blanco, fontSize:14, outline:"none", resize:"vertical",
                      transition:"border-color .22s, box-shadow .22s",
                      backdropFilter:"blur(10px)",
                    }}
                    onFocus={e=>{e.target.style.borderColor=C.morado;e.target.style.boxShadow=`0 0 0 3.5px ${C.morado}20`;}}
                    onBlur={e=>{e.target.style.borderColor="rgba(155,142,196,.2)";e.target.style.boxShadow="none";}}
                  />
                </div>

                <button type="submit" className="btn-prime"
                  style={{ width:"100%", justifyContent:"center", fontSize:15.5, padding:"16px" }}>
                  <FaWhatsapp style={{fontSize:18}}/> Enviar por WhatsApp
                </button>
                <p className="mono" style={{ fontSize:9, color:C.mistFaint, textAlign:"center", marginTop:12, letterSpacing:"0.1em" }}>
                  Se abrirá WhatsApp con tu mensaje listo para enviar
                </p>
              </form>
            </MagneticCard>
          </motion.div>
        </div>
      </section>

      {/* ══════ FOOTER ══════ */}
      <footer style={{
        background:`linear-gradient(180deg,${C.nightCard} 0%,#050310 100%)`,
        borderTop:`1px solid rgba(107,94,158,.15)`,
        padding:"80px 36px 32px", position:"relative", overflow:"hidden",
      }}>
        <div style={{ position:"absolute", top:0, left:0, right:0, height:2,
          background:`linear-gradient(90deg,transparent,${C.guinda}55,${C.morado}55,${C.cyan}33,transparent)` }} />
        <VeinLayer dark/>

        <div style={{ maxWidth:1280, margin:"0 auto", display:"grid",
          gridTemplateColumns:"2.2fr 1fr 1fr", gap:60, marginBottom:60,
          position:"relative", zIndex:1 }} className="col3">
          <div>
            <div className="serif" style={{ fontSize:32, color:C.blanco, marginBottom:14, letterSpacing:"-0.03em" }}>
              ABRILP
            </div>
            <p style={{ color:C.mistFaint, fontSize:13.5, lineHeight:1.88, maxWidth:310, marginBottom:24 }}>
              Transportes y Servicios S.R.L. — alquiler de flota, transporte y logística para
              construcción, minería y entidades públicas en el sur del Perú.
            </p>
            {/* Social icons */}
            <div style={{ display:"flex", gap:10 }}>
              {[FaWhatsapp, FaEnvelope, FaPhoneAlt].map((Icon,i) => (
                <div key={i} style={{
                  width:38, height:38, borderRadius:10, display:"flex",
                  alignItems:"center", justifyContent:"center",
                  background:"rgba(107,94,158,.14)", border:`1px solid rgba(107,94,158,.24)`,
                  fontSize:15, color:C.moradoSoft, cursor:"pointer", transition:"all .22s",
                }}
                onMouseEnter={e=>{e.currentTarget.style.background=`${C.morado}30`;e.currentTarget.style.color=C.blanco;e.currentTarget.style.transform="translateY(-2px)";}}
                onMouseLeave={e=>{e.currentTarget.style.background="rgba(107,94,158,.14)";e.currentTarget.style.color=C.moradoSoft;e.currentTarget.style.transform="none";}}
                ><Icon/></div>
              ))}
            </div>
          </div>

          <div>
            <div className="mono" style={{ fontSize:8.5, letterSpacing:"0.24em", color:C.moradoSoft,
              textTransform:"uppercase", marginBottom:20 }}>Navegación</div>
            {ENLACES_NAV.map(l => (
              <a key={l.href} href={l.href} style={{
                display:"block", color:C.mistFaint, fontSize:13.5,
                textDecoration:"none", marginBottom:12, transition:"all .22s",
              }}
              onMouseEnter={e=>{e.currentTarget.style.color=C.moradoSoft;e.currentTarget.style.paddingLeft="7px";}}
              onMouseLeave={e=>{e.currentTarget.style.color=C.mistFaint;e.currentTarget.style.paddingLeft="0";}}
              >{l.label}</a>
            ))}
          </div>

          <div>
            <div className="mono" style={{ fontSize:8.5, letterSpacing:"0.24em", color:C.moradoSoft,
              textTransform:"uppercase", marginBottom:20 }}>Contacto</div>
            {[
              "Arequipa, Perú",
              "940 192 062",
              "administracion@abrilp.com",
              "Lun – Sáb: 7:00 – 20:00",
            ].map(t => (
              <p key={t} style={{ color:C.mistFaint, fontSize:13.5, marginBottom:12 }}>{t}</p>
            ))}
          </div>
        </div>

        <div className="hr-glow" style={{ marginBottom:24, position:"relative", zIndex:1 }} />
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
          flexWrap:"wrap", gap:10, fontSize:11.5, color:C.mistFaint, position:"relative", zIndex:1 }}>
          <p>© 2026 ABRILP Transportes y Servicios S.R.L. — Todos los derechos reservados.</p>
          <p style={{ color:C.moradoSoft, fontWeight:600 }}>Design by Enders</p>
        </div>
      </footer>

      {/* ══════ WHATSAPP FLOTANTE ══════ */}
      <a href="https://wa.me/51940192062" target="_blank" rel="noreferrer"
        aria-label="Cotizar por WhatsApp" className="wa-btn"
        style={{
          position:"fixed", bottom:28, right:28, zIndex:300,
          background:"linear-gradient(135deg,#16A34A,#22C55E)",
          color:C.blanco, display:"flex", alignItems:"center", gap:11,
          padding:"15px 26px", borderRadius:50,
          fontWeight:700, fontSize:14.5, textDecoration:"none",
          boxShadow:"0 8px 28px rgba(34,197,94,.45)",
          backdropFilter:"blur(10px)",
          transition:"all .28s cubic-bezier(.22,1,.36,1)",
        }}
        onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px) scale(1.04)";e.currentTarget.style.boxShadow="0 14px 40px rgba(34,197,94,.55)";}}
        onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="0 8px 28px rgba(34,197,94,.45)";}}
      >
        <FaWhatsapp style={{ fontSize:22 }}/>
        <span>Cotizar Ahora</span>
      </a>
    </div>
  );
}
