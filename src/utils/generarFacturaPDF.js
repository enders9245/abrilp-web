import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import QRCode from "qrcode";
import logo from "../assets/logo.png";

/* =========================================================
   PALETA DE COLORES — Guinda + Morado claro
   (misma identidad visual que la cotización y la web "Inicio")
   ========================================================= */
const COLOR = {
  oscuro:        [74, 18, 40],    // guinda profundo: encabezados, barras, textos fuertes
  guinda:        [122, 34, 68],   // guinda marca: etiquetas y acentos secundarios
  acento:        [123, 108, 168], // morado claro: líneas decorativas, resaltados
  acentoSuave:   [239, 234, 247], // lavanda muy tenue: cajas destacadas
  dorado:        [184, 155, 94],  // dorado: detalles de elegancia (marcos, QR, totales)
  grisTexto:     [110, 92, 120],  // texto secundario sobre fondo claro
  grisClaro:     [148, 130, 158], // texto terciario / footer
  bordeClaro:    [221, 210, 238], // lavanda pálido: bordes suaves
  fondoSeccion:  [250, 248, 253], // casi blanco violáceo: fondo de cajas neutras
  blanco:        [255, 255, 255],
};

const FUENTE = "helvetica";

/* =========================================================
   HELPERS
   ========================================================= */
const cargarImagen = (src) => {
  return new Promise((resolve) => {
    if (!src) return resolve(null);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null); // antes no existía: si el logo fallaba, la promesa nunca se resolvía
  });
};

const formatearFecha = (fecha) => {
  if (!fecha) return "-";
  try {
    if (String(fecha).includes("T")) {
      return String(fecha).split("T")[0].split("-").reverse().join("/");
    }
    if (String(fecha).includes("-")) {
      return String(fecha).split("-").reverse().join("/");
    }
    return fecha;
  } catch {
    return "-";
  }
};

const formatearMoneda = (valor) => `S/ ${Number(valor || 0).toFixed(2)}`;

const agregarPaginaSiFaltaEspacio = (doc, y, espacioNecesario, margenSuperior = 20) => {
  if (y + espacioNecesario > 275) {
    doc.addPage();
    return margenSuperior;
  }
  return y;
};

// Reduce el tamaño de fuente hasta que el texto entre en el ancho disponible,
// para evitar que el nombre de la empresa se monte sobre la tarjeta de la derecha.
const ajustarFuenteParaAncho = (doc, texto, maxAncho, fontFamily, fontStyle, tamInicial, tamMinimo = 10.5) => {
  let tam = tamInicial;
  doc.setFont(fontFamily, fontStyle);
  doc.setFontSize(tam);
  while (doc.getTextWidth(texto) > maxAncho && tam > tamMinimo) {
    tam -= 0.5;
    doc.setFontSize(tam);
  }
  return tam;
};

const dibujarTituloSeccion = (doc, texto, x, y) => {
  doc.setFont(FUENTE, "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(...COLOR.oscuro);
  doc.text(texto.toUpperCase(), x, y);

  doc.setDrawColor(...COLOR.acento);
  doc.setLineWidth(0.7);
  doc.line(x, y + 1.6, x + 16, y + 1.6);

  doc.setTextColor(0, 0, 0);
};

/* =========================================================
   GENERADOR PRINCIPAL
   ========================================================= */
export const generarFacturaPDF = async (factura, empresaDB = {}, items = []) => {
  const doc = new jsPDF("p", "mm", "a4");

  const empresa = {
    nombre: empresaDB?.nombre || "TRANSPORTES Y SERVICIOS ABRILP S.R.L.",
    ruc: empresaDB?.ruc || "20XXXXXXXXXX",
    direccion: empresaDB?.direccion || "Puno - Perú",
    telefono: empresaDB?.telefono || "999 999 999",
    correo: empresaDB?.correo || "abrilp.transportes@gmail.com",
  };

  const img = await cargarImagen(logo);

  const subtotal = Number(factura.subtotal || 0);
  const igv = Number(factura.igv || subtotal * 0.18);
  const total = Number(factura.total || subtotal + igv);

  const qrTexto = `${empresa.ruc}|01|${factura.codigo}|${igv.toFixed(
    2
  )}|${total.toFixed(2)}|${formatearFecha(factura.fecha)}|6|${
    factura.cliente_ruc || "-"
  }`;

  let qrData = null;
  try {
    qrData = await QRCode.toDataURL(qrTexto);
  } catch {
    // si falla la generación del QR, se omite en vez de romper el PDF
  }

  /* ---------- ENCABEZADO ---------- */
  doc.setFillColor(...COLOR.oscuro);
  doc.rect(0, 0, 210, 5, "F");
  doc.setFillColor(...COLOR.acento);
  doc.rect(0, 5, 210, 1, "F");

  if (img) {
    // Marco dorado: detalle de elegancia alrededor del logo
    doc.setDrawColor(...COLOR.dorado);
    doc.setLineWidth(0.4);
    doc.roundedRect(11, 9, 37, 27, 1.5, 1.5);
    doc.addImage(img, "PNG", 12.5, 10.5, 34, 24);
  }

  // Ancho disponible entre el final del logo (x=54) y el inicio de la tarjeta
  // "FACTURA ELECTRÓNICA" (cardX=145), con un pequeño margen de seguridad.
  ajustarFuenteParaAncho(doc, empresa.nombre, 87, "times", "bolditalic", 14.5);
  doc.setTextColor(...COLOR.oscuro);
  doc.text(empresa.nombre, 54, 18);

  doc.setFont(FUENTE, "normal");
  doc.setFontSize(8);
  doc.setTextColor(...COLOR.grisTexto);
  doc.text(`RUC: ${empresa.ruc}`, 54, 23);
  doc.text(`Dirección: ${empresa.direccion}`, 54, 28);
  doc.text(`Tel: ${empresa.telefono}  |  ${empresa.correo}`, 54, 33);
  doc.setTextColor(0, 0, 0);

  doc.setDrawColor(...COLOR.acento);
  doc.setLineWidth(0.6);
  doc.line(10, 41, 200, 41);

  /* ---------- TARJETA "FACTURA ELECTRÓNICA" ---------- */
  const cardX = 145;
  const cardY = 10;
  const cardW = 53;
  const cardH = 30;

  doc.setFillColor(...COLOR.blanco);
  // Marco dorado: tarjeta de datos con detalle de elegancia
  doc.setDrawColor(...COLOR.dorado);
  doc.setLineWidth(0.4);
  doc.roundedRect(cardX, cardY, cardW, cardH, 1.8, 1.8, "FD");

  doc.setFillColor(...COLOR.oscuro);
  doc.rect(cardX + 0.6, cardY + 0.6, cardW - 1.2, 7, "F");

  doc.setFont(FUENTE, "bold");
  doc.setFontSize(8);
  doc.setTextColor(...COLOR.blanco);
  doc.text("FACTURA ELECTRÓNICA", cardX + cardW / 2, cardY + 4.9, {
    align: "center",
  });

  doc.setFont(FUENTE, "bold");
  doc.setFontSize(12.5);
  doc.setTextColor(...COLOR.oscuro);
  doc.text(factura.codigo || "-", cardX + cardW / 2, cardY + 15.3, {
    align: "center",
  });

  doc.setDrawColor(...COLOR.bordeClaro);
  doc.setLineWidth(0.25);
  doc.line(cardX + 4, cardY + 18.3, cardX + cardW - 4, cardY + 18.3);

  doc.setFont(FUENTE, "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR.grisTexto);
  doc.text(`RUC: ${empresa.ruc}`, cardX + cardW / 2, cardY + 23.5, {
    align: "center",
  });
  doc.setTextColor(0, 0, 0);

  /* ---------- DATOS DEL CLIENTE ---------- */
  let y = 55;

  dibujarTituloSeccion(doc, "Datos del cliente", 12, y);

  doc.setFont(FUENTE, "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR.grisTexto);
  doc.text("CLIENTE", 12, y + 7);
  doc.text("RUC", 12, y + 13);
  doc.text("DIRECCIÓN", 12, y + 19);
  doc.text("FECHA DE EMISIÓN", 120, y + 7);
  doc.text("COTIZACIÓN", 120, y + 13);

  doc.setFont(FUENTE, "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(0, 0, 0);
  doc.text(factura.cliente || "-", 35, y + 7);
  doc.text(factura.cliente_ruc || "-", 35, y + 13);
  doc.text(factura.cliente_direccion || "-", 35, y + 19);
  doc.text(formatearFecha(factura.fecha), 150, y + 7);
  doc.text(factura.cotizacion_codigo || "-", 150, y + 13);

  y += 30;

  /* ---------- DETALLE DEL SERVICIO ---------- */
  y = agregarPaginaSiFaltaEspacio(doc, y, 20);
  dibujarTituloSeccion(doc, "Detalle del servicio", 12, y);

  const detalle =
    items && items.length > 0
      ? items
      : [
          {
            descripcion: factura.servicio || "Servicio de transporte",
            unidad: `${factura.placa || "-"} - ${factura.marca || ""} ${
              factura.modelo || ""
            }`,
            precio: subtotal,
          },
        ];

  autoTable(doc, {
    startY: y + 5,
    theme: "grid",
    margin: { left: 12, right: 12 },
    head: [["N°", "DESCRIPCIÓN", "UNIDAD VEHICULAR", "PRECIO DÍA", "TOTAL 30 DÍAS"]],
    body: detalle.map((item, index) => [
      String(index + 1).padStart(2, "0"),
      item.descripcion || "-",
      item.unidad || "-",
      formatearMoneda(item.precio),
      formatearMoneda(Number(item.precio || 0) * 30),
    ]),
    styles: {
      font: FUENTE,
      fontSize: 7.5,
      cellPadding: 1.6,
      halign: "center",
      lineColor: COLOR.bordeClaro,
      lineWidth: 0.2,
      textColor: [30, 30, 30],
    },
    headStyles: {
      fillColor: COLOR.oscuro,
      textColor: COLOR.blanco,
      fontStyle: "bold",
      fontSize: 7.8,
    },
    alternateRowStyles: { fillColor: COLOR.fondoSeccion },
  });

  y = doc.lastAutoTable.finalY + 10;

  /* ---------- QR + TOTALES ---------- */
  y = agregarPaginaSiFaltaEspacio(doc, y, 50);

  // QR de verificación con marco dorado: detalle de elegancia
  doc.setFillColor(...COLOR.blanco);
  doc.setDrawColor(...COLOR.dorado);
  doc.setLineWidth(0.4);
  doc.roundedRect(12, y, 35, 35, 1.5, 1.5, "FD");

  if (qrData) {
    doc.addImage(qrData, "PNG", 13.5, y + 1.5, 32, 32);
  } else {
    doc.setFont(FUENTE, "normal");
    doc.setFontSize(7);
    doc.setTextColor(...COLOR.grisClaro);
    doc.text("QR no disponible", 29.5, y + 18, { align: "center" });
    doc.setTextColor(0, 0, 0);
  }

  doc.setFont(FUENTE, "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(...COLOR.grisTexto);
  doc.text("CÓDIGO QR DE VERIFICACIÓN", 29.5, y + 40, { align: "center" });
  doc.setTextColor(0, 0, 0);

  // Tarjeta de totales (mismo lenguaje visual que la cotización)
  const totX = 120;
  const totW = 78;
  const totH = 35;

  doc.setFillColor(...COLOR.blanco);
  doc.setDrawColor(...COLOR.bordeClaro);
  doc.setLineWidth(0.3);
  doc.roundedRect(totX, y, totW, totH, 2, 2, "FD");

  doc.setFont(FUENTE, "normal");
  doc.setFontSize(8);
  doc.setTextColor(...COLOR.grisTexto);
  doc.text("Subtotal:", totX + 6, y + 8);
  doc.setTextColor(0, 0, 0);
  doc.text(formatearMoneda(subtotal), totX + totW - 6, y + 8, { align: "right" });

  doc.setTextColor(...COLOR.grisTexto);
  doc.text("IGV 18%:", totX + 6, y + 15);
  doc.setTextColor(0, 0, 0);
  doc.text(formatearMoneda(igv), totX + totW - 6, y + 15, { align: "right" });

  // Separador dorado antes del total (detalle de elegancia)
  doc.setDrawColor(...COLOR.dorado);
  doc.setLineWidth(0.5);
  doc.line(totX + 6, y + 19.5, totX + totW - 6, y + 19.5);

  doc.setFillColor(...COLOR.oscuro);
  doc.roundedRect(totX, y + 22, totW, 13, 2, 2, "F");
  doc.rect(totX, y + 22, totW, 6.5, "F"); // cuadra las esquinas superiores de la franja

  doc.setFont(FUENTE, "bold");
  doc.setFontSize(11);
  doc.setTextColor(...COLOR.blanco);
  doc.text("TOTAL:", totX + 6, y + 30.3);
  doc.text(formatearMoneda(total), totX + totW - 6, y + 30.3, { align: "right" });
  doc.setTextColor(0, 0, 0);

  y += totH + 10;

  /* ---------- OBSERVACIÓN ---------- */
  y = agregarPaginaSiFaltaEspacio(doc, y, 26);

  const textoObs = doc.splitTextToSize(
    "Documento generado desde el sistema interno ABRILP. Para emisión oficial SUNAT se requiere XML, firma digital y envío a SUNAT/OSE.",
    174
  );
  const obsBoxHeight = 10 + textoObs.length * 4.3;

  doc.setFillColor(...COLOR.fondoSeccion);
  doc.setDrawColor(...COLOR.bordeClaro);
  doc.roundedRect(12, y, 186, obsBoxHeight, 2, 2, "FD");

  doc.setFont(FUENTE, "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(...COLOR.oscuro);
  doc.text("OBSERVACIÓN", 16, y + 6.5);
  doc.setDrawColor(...COLOR.acento);
  doc.setLineWidth(0.7);
  doc.line(16, y + 8.1, 32, y + 8.1);

  doc.setFont(FUENTE, "normal");
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.text(textoObs, 16, y + 13.5);

  /* ---------- PIE DE PÁGINA (todas las páginas) ---------- */
  const totalPaginas = doc.internal.getNumberOfPages();

  for (let i = 1; i <= totalPaginas; i++) {
    doc.setPage(i);

    doc.setDrawColor(...COLOR.acento);
    doc.setLineWidth(0.5);
    doc.line(10, 287, 200, 287);

    doc.setFont(FUENTE, "normal");
    doc.setFontSize(7);
    doc.setTextColor(...COLOR.grisClaro);
    doc.text(
      `${empresa.nombre} | RUC: ${empresa.ruc} | Tel: ${empresa.telefono}`,
      105,
      292,
      { align: "center" }
    );
    doc.text(`Página ${i} de ${totalPaginas}`, 195, 292, { align: "right" });
  }

  doc.save(`${factura.codigo}.pdf`);
};