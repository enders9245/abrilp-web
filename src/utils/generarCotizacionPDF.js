import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../assets/logo.png";

/* =========================================================
   PALETA DE COLORES — Guinda + Morado claro
   (misma identidad visual que la web "Inicio")
   ========================================================= */
const COLOR = {
  oscuro:        [74, 18, 40],    // guinda profundo: encabezados, barras, textos fuertes
  guinda:        [122, 34, 68],   // guinda marca: etiquetas y acentos secundarios
  acento:        [123, 108, 168], // morado claro: líneas decorativas, resaltados
  acentoSuave:   [239, 234, 247], // lavanda muy tenue: cajas destacadas
  dorado:        [184, 155, 94],  // dorado: detalles de elegancia (marcos, firma, sellos)
  grisTexto:     [110, 92, 120],  // texto secundario sobre fondo claro
  grisClaro:     [148, 130, 158], // texto terciario / footer
  bordeClaro:    [221, 210, 238], // lavanda pálido: bordes suaves
  fondoSeccion:  [250, 248, 253], // casi blanco violáceo: fondo de cajas neutras
  blanco:        [255, 255, 255],
  // Nuevos colores para la tabla de responsabilidades
  duenoFondo:    [239, 234, 247], // lavanda suave: columna "Dueño del vehículo"
  contratFondo:  [250, 240, 235], // durazno muy suave: columna "Empresa contratante"
  contratAcento: [184, 110, 70],  // terracota: acento para empresa contratante
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
    img.onerror = () => resolve(null);
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

// Título de sección: texto en mayúsculas + línea de acento morado debajo
const dibujarTituloSeccion = (doc, texto, x, y) => {
  doc.setFont(FUENTE, "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(...COLOR.oscuro);
  doc.text(texto.toUpperCase(), x, y);

  doc.setDrawColor(...COLOR.acento);
  doc.setLineWidth(0.7);
  doc.line(x, y + 1.6, x + 16, y + 1.6);

  doc.setTextColor(0, 0, 0);
  return y;
};

/* =========================================================
   GENERADOR PRINCIPAL
   ========================================================= */
export const generarCotizacionPDF = async (
  cotizacion,
  empresaDB = {},
  condicionesDB = [],
  responsabilidadesDB = {}
) => {
  const doc = new jsPDF("p", "mm", "a4");

  const empresa = {
    nombre:         empresaDB?.nombre         || "TRANSPORTES Y SERVICIOS ABRILP S.R.L.",
    ruc:            empresaDB?.ruc            || "20XXXXXXXXXX",
    direccion:      empresaDB?.direccion      || "Puno - Perú",
    telefono:       empresaDB?.telefono       || "999 999 999",
    correo:         empresaDB?.correo         || "abrilp.transportes@gmail.com",
    representante:  empresaDB?.representante  || "Juan Ronal Prieto Gutierrez",
  };

  const img = await cargarImagen(logo);
  const fecha = formatearFecha(cotizacion.fecha);

  const subtotalDia  = Number(cotizacion.subtotal || 0);
  const igvDia       = Number(cotizacion.igv || subtotalDia * 0.18);
  const totalDia     = Number(cotizacion.total || subtotalDia + igvDia);
  const totalMensual = totalDia * 30;

  /* ---------- ENCABEZADO ---------- */
  // Barra superior guinda
  doc.setFillColor(...COLOR.oscuro);
  doc.rect(0, 0, 210, 5, "F");
  // Línea de acento morado debajo de la barra
  doc.setFillColor(...COLOR.acento);
  doc.rect(0, 5, 210, 1, "F");

  doc.setTextColor(...COLOR.oscuro);
  doc.setFont("times", "bolditalic");
  doc.setFontSize(15.5);
  doc.text(empresa.nombre, 12, 19);

  doc.setFont(FUENTE, "normal");
  doc.setFontSize(8);
  doc.setTextColor(...COLOR.grisTexto);
  doc.text(`RUC: ${empresa.ruc}`,                              12, 25);
  doc.text(`Dirección: ${empresa.direccion}`,                  12, 30);
  doc.text(`Cel: ${empresa.telefono}  |  ${empresa.correo}`,  12, 35);
  doc.setTextColor(0, 0, 0);

  if (img) {
    // Marco dorado: detalle de elegancia alrededor del logo
    doc.setDrawColor(...COLOR.dorado);
    doc.setLineWidth(0.4);
    doc.roundedRect(159, 9, 38, 28, 1.5, 1.5);
    doc.addImage(img, "PNG", 161, 11, 34, 24);
  }

  // Separador morado
  doc.setDrawColor(...COLOR.acento);
  doc.setLineWidth(0.6);
  doc.line(10, 41, 200, 41);

  /* ---------- TÍTULO "COTIZACIÓN" + META ---------- */
  // Insignia con marco dorado: detalle de elegancia
  doc.setFillColor(...COLOR.oscuro);
  doc.setDrawColor(...COLOR.dorado);
  doc.setLineWidth(0.4);
  doc.roundedRect(12, 47, 58, 11, 1.5, 1.5, "FD");
  doc.setFont(FUENTE, "bold");
  doc.setFontSize(13);
  doc.setTextColor(...COLOR.blanco);
  doc.text("COTIZACIÓN", 41, 54.3, { align: "center" });
  doc.setTextColor(0, 0, 0);

  // Tarjeta metadatos
  const metaX = 140, metaY = 47, metaW = 58, metaH = 21;

  doc.setFillColor(...COLOR.blanco);
  // Marco dorado: tarjeta de datos con detalle de elegancia
  doc.setDrawColor(...COLOR.dorado);
  doc.setLineWidth(0.4);
  doc.roundedRect(metaX, metaY, metaW, metaH, 1.8, 1.8, "FD");

  // Franja de acento morado (parte superior de la tarjeta)
  doc.setFillColor(...COLOR.acento);
  doc.rect(metaX + 0.6, metaY + 0.6, metaW - 1.2, 1.8, "F");

  doc.setFont(FUENTE, "bold");
  doc.setFontSize(6.8);
  doc.setTextColor(...COLOR.grisTexto);
  doc.text("N° DE COTIZACIÓN", metaX + 4, metaY + 8.3);

  doc.setFont(FUENTE, "bold");
  doc.setFontSize(11.5);
  doc.setTextColor(...COLOR.oscuro);
  doc.text(cotizacion.codigo || "-", metaX + 4, metaY + 14.6);

  doc.setDrawColor(...COLOR.bordeClaro);
  doc.setLineWidth(0.25);
  doc.line(metaX + 4, metaY + 16.9, metaX + metaW - 4, metaY + 16.9);

  doc.setFont(FUENTE, "bold");
  doc.setFontSize(6.8);
  doc.setTextColor(...COLOR.grisTexto);
  doc.text("FECHA", metaX + 4, metaY + 19.8);

  doc.setFont(FUENTE, "normal");
  doc.setFontSize(7.8);
  doc.setTextColor(0, 0, 0);
  doc.text(fecha, metaX + 16, metaY + 19.8);

  doc.setFont(FUENTE, "italic");
  doc.setFontSize(6.5);
  doc.setTextColor(...COLOR.grisClaro);
  doc.text("(Vig. 30 días)", metaX + metaW - 4, metaY + 19.8, { align: "right" });
  doc.setTextColor(0, 0, 0);

  /* ---------- CLIENTE ---------- */
  let y = 67;

  dibujarTituloSeccion(doc, "Cliente", 12, y);
  doc.setFont(FUENTE, "normal");
  doc.setFontSize(8.5);
  doc.text(cotizacion.cliente || "-",                          12, y + 6);
  doc.text(`RUC: ${cotizacion.cliente_ruc || "-"}`,           12, y + 11.5);
  doc.text(`Dirección: ${cotizacion.cliente_direccion || "-"}`, 12, y + 17);

  y += 27;

  dibujarTituloSeccion(doc, "Presente", 12, y);
  doc.setFont(FUENTE, "normal");
  doc.setFontSize(8.5);

  const textoPresentacion =
    cotizacion.descripcion ||
    "De nuestra consideración: Según lo solicitado, tenemos a bien hacerle llegar la presente cotización por el alquiler de las siguientes unidades vehiculares:";

  const textoLineas = doc.splitTextToSize(textoPresentacion, 180);
  doc.text(textoLineas, 12, y + 6);

  y += 10 + textoLineas.length * 4;

  /* ---------- VEHÍCULOS ---------- */
  const implementacionesPDF =
    cotizacion.implementaciones && cotizacion.implementaciones.length > 0
      ? cotizacion.implementaciones
          .filter((i) => i.estado === "ACTIVO" && i.mostrar_pdf === "SI")
          .sort((a, b) => Number(a.orden || 1) - Number(b.orden || 1))
          .map((i) => i.descripcion)
      : [
          "Sensores de proximidad",
          "Láminas de seguridad en parabrisas y ventanas.",
          "Póliza de seguro contra todo riesgo vigente.",
          "SOAT vigente.",
          "Revisión técnica vigente",
        ];

  const items =
    cotizacion.items && cotizacion.items.length > 0
      ? cotizacion.items
      : [
          {
            vehiculo_id:     cotizacion.vehiculo_id,
            descripcion:     cotizacion.servicio || "Alquiler de Camión",
            unidad:          `${cotizacion.placa || "-"} - ${cotizacion.marca || ""} ${cotizacion.modelo || ""}`,
            placa:           cotizacion.placa,
            marca:           cotizacion.marca,
            modelo:          cotizacion.modelo,
            anio:            cotizacion.anio,
            capacidad:       cotizacion.capacidad,
            vehiculo_estado: cotizacion.vehiculo_estado,
            precio:          subtotalDia,
            foto1:           cotizacion.foto1,
            foto2:           cotizacion.foto2,
          },
        ];

  y = agregarPaginaSiFaltaEspacio(doc, y, 14);
  dibujarTituloSeccion(doc, "Especificaciones del vehículo", 12, y);
  y += 5;

  const vehiculosUnicos = [];
  items.forEach((item) => {
    const key = item.vehiculo_id || item.placa || item.unidad;
    const existe = vehiculosUnicos.some((v) => v.key === key);
    if (!existe) {
      vehiculosUnicos.push({
        key,
        placa:    item.placa    || "-",
        marca:    item.marca    || "-",
        modelo:   item.modelo   || "-",
        anio:     item.anio     || "-",
        capacidad: item.capacidad || "-",
        estado:   item.vehiculo_estado || "-",
        unidad:   item.unidad   || "-",
        foto1:    item.foto1    || item.imagen1 || item.foto_url_1 || "",
        foto2:    item.foto2    || item.imagen2 || item.foto_url_2 || "",
      });
    }
  });

  for (let index = 0; index < vehiculosUnicos.length; index++) {
    const vehiculo = vehiculosUnicos[index];

    y = agregarPaginaSiFaltaEspacio(doc, y, 75);

    // Etiqueta de unidad vehicular en guinda
    doc.setFillColor(...COLOR.guinda);
    doc.roundedRect(12, y - 4, 70, 6, 1, 1, "F");
    doc.setFont(FUENTE, "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(...COLOR.blanco);
    doc.text(`UNIDAD VEHICULAR ${index + 1}: ${vehiculo.unidad}`, 14.5, y);
    doc.setTextColor(0, 0, 0);

    autoTable(doc, {
      startY: y + 3,
      theme: "grid",
      margin: { left: 12, right: 12 },
      head: [["Características", "Implementación incluida", "Fotos"]],
      body: [
        [
          `Marca: ${vehiculo.marca}\nModelo: ${vehiculo.modelo}\nPlaca: ${vehiculo.placa}\nAño Modelo: ${vehiculo.anio}\nCapacidad: ${vehiculo.capacidad}\nEstado: ${vehiculo.estado}`,
          implementacionesPDF.map((imp) => `• ${imp}`).join("\n"),
          "",
        ],
      ],
      styles: {
        font: FUENTE,
        fontSize: 7.2,
        cellPadding: 1.4,
        lineColor: COLOR.bordeClaro,
        lineWidth: 0.2,
        textColor: [30, 30, 30],
      },
      headStyles: {
        fillColor: COLOR.oscuro,       // guinda oscuro en encabezado de tabla
        textColor: COLOR.blanco,
        halign: "center",
        fontStyle: "bold",
        fontSize: 7.6,
      },
      bodyStyles: { fillColor: COLOR.blanco },
      columnStyles: {
        0: { cellWidth: 48 },
        1: { cellWidth: 82 },
        2: { cellWidth: 56 },
      },
    });

    const tablaInicioY = y + 11;
    const fotoX = 144;
    const fotoW = 24;
    const fotoH = 20;

    const foto1 = await cargarImagen(vehiculo.foto1);
    const foto2 = await cargarImagen(vehiculo.foto2);

    doc.setFont(FUENTE, "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(...COLOR.grisTexto);
    doc.text("Foto 1", fotoX + 12, tablaInicioY + 3.5, { align: "center" });
    doc.text("Foto 2", fotoX + 40, tablaInicioY + 3.5, { align: "center" });
    doc.setTextColor(0, 0, 0);

    const dibujarFoto = (imagen, posX) => {
      if (imagen) {
        doc.setDrawColor(...COLOR.bordeClaro);
        doc.setLineWidth(0.2);
        doc.rect(posX, tablaInicioY + 5.5, fotoW, fotoH);
        doc.addImage(imagen, "JPEG", posX, tablaInicioY + 5.5, fotoW, fotoH);
      } else {
        doc.setFillColor(...COLOR.fondoSeccion);
        doc.setDrawColor(...COLOR.bordeClaro);
        doc.roundedRect(posX, tablaInicioY + 5.5, fotoW, fotoH, 1, 1, "FD");
        doc.setFont(FUENTE, "normal");
        doc.setFontSize(6);
        doc.setTextColor(...COLOR.grisClaro);
        doc.text("Sin foto", posX + fotoW / 2, tablaInicioY + 5.5 + fotoH / 2 + 1, {
          align: "center",
        });
        doc.setTextColor(0, 0, 0);
      }
    };

    dibujarFoto(foto1, fotoX);
    dibujarFoto(foto2, fotoX + 28);

    y = doc.lastAutoTable.finalY + 8;
  }

  /* ---------- CONDICIONES DEL SERVICIO ---------- */
  const condiciones =
    condicionesDB.length > 0
      ? condicionesDB
          .filter((c) => c.estado === "ACTIVO")
          .map((c) => c.descripcion)
      : [
          "El alquiler corresponde a máquina seca, sin conductor.",
          "El combustible será asumido por la entidad contratante.",
          "El operador o conductor será proporcionado por la entidad contratante.",
          "Los daños ocasionados por mala operación serán responsabilidad de la entidad contratante.",
          "Las valorizaciones se presentarán de forma mensual.",
          "La presente cotización tendrá una vigencia de 30 días calendario.",
          "Precio conversable según cantidad de días, lugar de servicio y condiciones de contratación.",
        ];

  const condicionesConLineas = condiciones.map((c) =>
    doc.splitTextToSize(`•  ${c}`, 170)
  );
  const altoCondiciones = condicionesConLineas.reduce(
    (acc, lineas) => acc + lineas.length * 4.3,
    0
  );
  const condicionesBoxHeight = 12 + altoCondiciones;

  y = agregarPaginaSiFaltaEspacio(doc, y, condicionesBoxHeight + 10);

  // Caja de condiciones con fondo lavanda suave y borde morado
  doc.setFillColor(...COLOR.fondoSeccion);
  doc.setDrawColor(...COLOR.bordeClaro);
  doc.roundedRect(12, y, 186, condicionesBoxHeight, 2, 2, "FD");

  // Franja lateral guinda (acento visual izquierdo)
  doc.setFillColor(...COLOR.acento);
  doc.rect(12, y, 2, condicionesBoxHeight, "F");

  doc.setFont(FUENTE, "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(...COLOR.oscuro);
  doc.text("CONDICIONES DEL SERVICIO", 18, y + 7);

  // Línea decorativa morado debajo del título
  doc.setDrawColor(...COLOR.acento);
  doc.setLineWidth(0.7);
  doc.line(18, y + 8.6, 34, y + 8.6);

  doc.setFont(FUENTE, "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(0, 0, 0);

  let cy = y + 14;
  condicionesConLineas.forEach((lineas) => {
    doc.text(lineas, 20, cy);
    cy += lineas.length * 4.3;
  });

  y += condicionesBoxHeight + 8;

  /* ---------- RESPONSABILIDADES DEL SERVICIO (NUEVO) ----------
     Tabla de 2 columnas: gastos que cubre el dueño del vehículo
     vs. gastos que cubre la empresa contratante.
     Personalizable vía el parámetro responsabilidadesDB.
  --------------------------------------------------------------- */
  const responsabilidadesDueno =
    responsabilidadesDB?.dueno && responsabilidadesDB.dueno.length > 0
      ? responsabilidadesDB.dueno
      : [
          "Transporte de Arequipa a Espinar.",
          "Mantenimiento preventivo del vehículo.",
          "Desgaste normal de llantas.",
          "Fallas mecánicas y eléctricas.",
        ];

  const responsabilidadesContratante =
    responsabilidadesDB?.contratante && responsabilidadesDB.contratante.length > 0
      ? responsabilidadesDB.contratante
      : [
          "Choques ocasionados durante la operación.",
          "Daños operacionales del vehículo.",
        ];

  y = agregarPaginaSiFaltaEspacio(doc, y, 55);
  dibujarTituloSeccion(doc, "Responsabilidades del servicio", 12, y);
  y += 5;

  autoTable(doc, {
    startY: y,
    theme: "grid",
    margin: { left: 12, right: 12 },
    head: [["Asume el Dueño del Vehículo", "Asume la Empresa Contratante"]],
    body: [
      [
        responsabilidadesDueno.map((r) => `• ${r}`).join("\n"),
        responsabilidadesContratante.map((r) => `• ${r}`).join("\n"),
      ],
    ],
    styles: {
      font: FUENTE,
      fontSize: 7.6,
      cellPadding: 3,
      lineColor: COLOR.bordeClaro,
      lineWidth: 0.2,
      textColor: [30, 30, 30],
      valign: "top",
    },
    headStyles: {
      fontStyle: "bold",
      fontSize: 7.8,
      halign: "center",
    },
    columnStyles: {
      0: { cellWidth: 93, fillColor: COLOR.duenoFondo },
      1: { cellWidth: 93, fillColor: COLOR.contratFondo },
    },
    didParseCell: (data) => {
      // Encabezado con color distinto por columna: guinda (dueño) y terracota (contratante)
      if (data.section === "head") {
        if (data.column.index === 0) {
          data.cell.styles.fillColor = COLOR.oscuro;
          data.cell.styles.textColor = COLOR.blanco;
        } else {
          data.cell.styles.fillColor = COLOR.contratAcento;
          data.cell.styles.textColor = COLOR.blanco;
        }
      }
    },
  });

  y = doc.lastAutoTable.finalY + 3;

  // Nota aclaratoria debajo de la tabla
  doc.setFont(FUENTE, "italic");
  doc.setFontSize(6.8);
  doc.setTextColor(...COLOR.grisClaro);
  doc.text(
    "Nota: cualquier gasto no contemplado en esta tabla será definido de mutuo acuerdo entre ambas partes antes del inicio del servicio.",
    12,
    y + 4
  );
  doc.setTextColor(0, 0, 0);

  y += 12;

  /* ---------- PROPUESTA ECONÓMICA ---------- */
  y = agregarPaginaSiFaltaEspacio(doc, y, 55);
  dibujarTituloSeccion(doc, "Propuesta económica", 12, y);

  autoTable(doc, {
    startY: y + 5,
    theme: "grid",
    margin: { left: 12, right: 12 },
    head: [
      ["N°", "DESCRIPCIÓN", "UNIDAD VEHICULAR", "PRECIO POR DÍA", "TOTAL 30 DÍAS"],
    ],
    body: items.map((item, index) => [
      String(index + 1).padStart(2, "0"),
      item.descripcion || "-",
      item.unidad || "-",
      formatearMoneda(item.precio),
      formatearMoneda(Number(item.precio || 0) * 30),
    ]),
    styles: {
      font: FUENTE,
      fontSize: 7.2,
      cellPadding: 1.6,
      halign: "center",
      lineColor: COLOR.bordeClaro,
      lineWidth: 0.2,
      textColor: [30, 30, 30],
    },
    headStyles: {
      fillColor: COLOR.oscuro,       // guinda oscuro
      textColor: COLOR.blanco,
      fontStyle: "bold",
      fontSize: 7.6,
    },
    alternateRowStyles: { fillColor: COLOR.fondoSeccion },  // lavanda muy suave
    columnStyles: {
      0: { cellWidth: 12 },
      1: { cellWidth: 45 },
      2: { cellWidth: 55 },
      3: { cellWidth: 37 },
      4: { cellWidth: 37, fontStyle: "bold" },
    },
  });

  y = doc.lastAutoTable.finalY + 8;
  y = agregarPaginaSiFaltaEspacio(doc, y, 70);

  /* ---------- NOTA / PRECIO CONVERSABLE ---------- */
  // Caja izquierda: fondo lavanda suave con borde morado
  doc.setFillColor(...COLOR.acentoSuave);
  doc.setDrawColor(...COLOR.acento);
  doc.setLineWidth(0.4);
  doc.roundedRect(12, y, 86, 34, 2, 2, "FD");

  doc.setFont(FUENTE, "bold");
  doc.setFontSize(9);
  doc.setTextColor(...COLOR.oscuro);
  doc.text("PRECIO CONVERSABLE", 18, y + 8);

  doc.setFont(FUENTE, "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR.grisTexto);
  doc.text(
    doc.splitTextToSize(
      "El precio puede ser negociable según el plazo del servicio, cantidad de unidades y lugar de operación.",
      74
    ),
    18,
    y + 14
  );

  doc.setFont(FUENTE, "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR.oscuro);
  doc.text("NOTA:", 18, y + 27);
  doc.setFont(FUENTE, "normal");
  doc.setTextColor(...COLOR.grisTexto);
  doc.text(
    doc.splitTextToSize(
      "Los precios están expresados por día. Los montos totales indicados incluyen IGV.",
      62
    ),
    30,
    y + 27
  );

  /* ---------- TOTALES ---------- */
  doc.setFillColor(...COLOR.blanco);
  doc.setDrawColor(...COLOR.bordeClaro);
  doc.setLineWidth(0.3);
  doc.roundedRect(112, y, 86, 34, 2, 2, "FD");

  doc.setFont(FUENTE, "normal");
  doc.setFontSize(8);
  doc.setTextColor(...COLOR.grisTexto);
  doc.text("Subtotal por día:", 118, y + 7);
  doc.text(formatearMoneda(subtotalDia), 192, y + 7, { align: "right" });

  doc.text("IGV 18% por día:", 118, y + 13);
  doc.text(formatearMoneda(igvDia), 192, y + 13, { align: "right" });

  // Separador dorado antes del total (detalle de elegancia)
  doc.setDrawColor(...COLOR.dorado);
  doc.setLineWidth(0.5);
  doc.line(118, y + 17, 192, y + 17);

  // Barra de total en guinda oscuro
  doc.setFillColor(...COLOR.oscuro);
  doc.roundedRect(112, y + 19, 86, 15, 0, 0, "F");

  doc.setFont(FUENTE, "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(...COLOR.blanco);
  doc.text("TOTAL POR DÍA:", 118, y + 25.5);
  doc.text(formatearMoneda(totalDia), 192, y + 25.5, { align: "right" });

  doc.setFontSize(8);
  doc.setFont(FUENTE, "normal");
  doc.text("TOTAL 30 DÍAS:", 118, y + 31.5);
  doc.setFont(FUENTE, "bold");
  doc.text(formatearMoneda(totalMensual), 192, y + 31.5, { align: "right" });

  doc.setTextColor(0, 0, 0);
  y += 45;

  /* ---------- FORMA DE PAGO Y FIRMA ---------- */
  y = agregarPaginaSiFaltaEspacio(doc, y, 45);

  dibujarTituloSeccion(doc, "Forma de pago", 12, y);

  doc.setFont(FUENTE, "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(0, 0, 0);
  doc.text(
    "El pago se realizará de forma mensual según valorización y presentación de factura.",
    12,
    y + 7
  );
  doc.text("Condición: los montos totales indicados incluyen IGV.", 12, y + 12.5);
  doc.text("Atentamente,", 12, y + 25);

  const firmaY = y + 38;

  // Línea de firma en dorado (detalle de elegancia)
  doc.setDrawColor(...COLOR.dorado);
  doc.setLineWidth(0.4);
  doc.line(125, firmaY, 190, firmaY);

  doc.setFont(FUENTE, "bold");
  doc.setFontSize(8);
  doc.setTextColor(...COLOR.oscuro);
  doc.text(empresa.representante.toUpperCase(), 157.5, firmaY + 5, { align: "center" });

  doc.setFont(FUENTE, "normal");
  doc.setTextColor(...COLOR.grisTexto);
  doc.text("Gerente General",  157.5, firmaY + 9,  { align: "center" });
  doc.text(empresa.nombre,     157.5, firmaY + 13, { align: "center" });
  doc.setTextColor(0, 0, 0);

  /* ---------- PIE DE PÁGINA (todas las páginas) ---------- */
  const totalPaginas = doc.internal.getNumberOfPages();

  for (let i = 1; i <= totalPaginas; i++) {
    doc.setPage(i);

    // Línea morado claro en el pie
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

  doc.save(`${cotizacion.codigo}.pdf`);
};