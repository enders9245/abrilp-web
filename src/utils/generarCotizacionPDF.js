import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../assets/logo.png";

const cargarImagen = (src) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(img);
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

const agregarPaginaSiFaltaEspacio = (doc, y, espacioNecesario) => {
  if (y + espacioNecesario > 275) {
    doc.addPage();
    return 20;
  }

  return y;
};

export const generarCotizacionPDF = async (
  cotizacion,
  empresaDB = {},
  condicionesDB = []
) => {
  const doc = new jsPDF("p", "mm", "a4");

  const empresa = {
    nombre: empresaDB?.nombre || "TRANSPORTES Y SERVICIOS ABRILP S.R.L.",
    ruc: empresaDB?.ruc || "20XXXXXXXXXX",
    direccion: empresaDB?.direccion || "Puno - Perú",
    telefono: empresaDB?.telefono || "999 999 999",
    correo: empresaDB?.correo || "abrilp.transportes@gmail.com",
    representante: empresaDB?.representante || "Juan Ronal Prieto Gutierrez",
  };

  const img = await cargarImagen(logo);

  const fecha = formatearFecha(cotizacion.fecha);

  const subtotalDia = Number(cotizacion.subtotal || 0);
  const igvDia = Number(cotizacion.igv || subtotalDia * 0.18);
  const totalDia = Number(cotizacion.total || subtotalDia + igvDia);
  const totalMensual = totalDia * 30;

  // ======================
  // ENCABEZADO
  // ======================
  doc.setFillColor(20, 20, 20);
  doc.rect(0, 0, 210, 6, "F");

  doc.setTextColor(0, 0, 0);
  doc.setFont("times", "bolditalic");
  doc.setFontSize(16);
  doc.text(empresa.nombre, 12, 20);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(`RUC: ${empresa.ruc}`, 12, 26);
  doc.text(`Dirección: ${empresa.direccion}`, 12, 31);
  doc.text(`Cel: ${empresa.telefono} | ${empresa.correo}`, 12, 36);

  doc.addImage(img, "PNG", 160, 9, 36, 27);

  doc.setDrawColor(212, 160, 23);
  doc.setLineWidth(0.8);
  doc.line(10, 43, 200, 43);

  doc.setFillColor(245, 245, 245);
  doc.roundedRect(80, 48, 50, 11, 2, 2, "F");

  doc.setFont("times", "bolditalic");
  doc.setFontSize(16);
  doc.text("Cotización", 105, 55, { align: "center" });

  doc.setDrawColor(180, 180, 180);
  doc.roundedRect(145, 62, 52, 22, 2, 2);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text(`N°: ${cotizacion.codigo || "-"}`, 149, 68);

  doc.setFont("helvetica", "normal");
  doc.text(`Fecha: ${fecha}`, 149, 74);
  doc.text("Vigencia: 30 días", 149, 80);

  let y = 65;

  // ======================
  // CLIENTE
  // ======================
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("CLIENTE:", 12, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text(cotizacion.cliente || "-", 12, y + 6);
  doc.text(`RUC: ${cotizacion.cliente_ruc || "-"}`, 12, y + 12);
  doc.text(`Dirección: ${cotizacion.cliente_direccion || "-"}`, 12, y + 18);

  y += 32;

  // ======================
  // PRESENTE
  // ======================
  doc.setFont("helvetica", "bold");
  doc.text("PRESENTE:", 12, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);

  const textoPresentacion =
    cotizacion.descripcion ||
    "De nuestra consideración: Según lo solicitado, tenemos a bien hacerle llegar la presente cotización por el alquiler de la siguiente unidad:";

  const textoLineas = doc.splitTextToSize(textoPresentacion, 180);
  doc.text(textoLineas, 12, y + 6);

  y += 12 + textoLineas.length * 4;

  // ======================
  // IMPLEMENTACIONES
  // ======================
  const implementacionesPDF =
    cotizacion.implementaciones && cotizacion.implementaciones.length > 0
      ? cotizacion.implementaciones
          .filter((i) => i.estado === "ACTIVO")
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
            vehiculo_id: cotizacion.vehiculo_id,
            descripcion: cotizacion.servicio || "Alquiler de Camión",
            unidad: `${cotizacion.placa || "-"} - ${cotizacion.marca || ""} ${
              cotizacion.modelo || ""
            }`,
            placa: cotizacion.placa,
            marca: cotizacion.marca,
            modelo: cotizacion.modelo,
            anio: cotizacion.anio,
            capacidad: cotizacion.capacidad,
            vehiculo_estado: cotizacion.vehiculo_estado,
            precio: subtotalDia,
          },
        ];

  // ======================
  // ESPECIFICACIONES POR VEHÍCULO
  // ======================
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("ESPECIFICACIONES DEL VEHÍCULO", 12, y);

  y += 5;

  const vehiculosUnicos = [];

  items.forEach((item) => {
    const key = item.vehiculo_id || item.placa || item.unidad;

    const existe = vehiculosUnicos.some((v) => v.key === key);

    if (!existe) {
      vehiculosUnicos.push({
        key,
        placa: item.placa || "-",
        marca: item.marca || "-",
        modelo: item.modelo || "-",
        anio: item.anio || "-",
        capacidad: item.capacidad || "-",
        estado: item.vehiculo_estado || "-",
        unidad: item.unidad || "-",
      });
    }
  });

  vehiculosUnicos.forEach((vehiculo, index) => {
    y = agregarPaginaSiFaltaEspacio(doc, y, 45);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text(`Unidad vehicular ${index + 1}: ${vehiculo.unidad}`, 12, y);

    autoTable(doc, {
      startY: y + 3,
      theme: "grid",
      margin: { left: 12, right: 12 },
      head: [["Características", "Implementación Incluida"]],
      body: [
        [`Marca: ${vehiculo.marca}`, implementacionesPDF[0] || ""],
        [`Modelo: ${vehiculo.modelo}`, implementacionesPDF[1] || ""],
        [`Placa: ${vehiculo.placa}`, implementacionesPDF[2] || ""],
        [`Año Modelo: ${vehiculo.anio}`, implementacionesPDF[3] || ""],
        [`Capacidad: ${vehiculo.capacidad}`, implementacionesPDF[4] || ""],
        [`Estado: ${vehiculo.estado}`, implementacionesPDF[5] || ""],
      ],
      styles: {
        fontSize: 7.2,
        cellPadding: 1.1,
        lineColor: [0, 0, 0],
        lineWidth: 0.2,
      },
      headStyles: {
        fillColor: [235, 235, 235],
        textColor: [0, 0, 0],
        halign: "center",
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: 62 },
        1: { cellWidth: 124 },
      },
    });

    y = doc.lastAutoTable.finalY + 6;
  });

  // ======================
  // CONDICIONES
  // ======================
  y = agregarPaginaSiFaltaEspacio(doc, y, 45);

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
        ];

  const condicionesBoxHeight = 12 + condiciones.length * 4.5;

  doc.setFillColor(248, 248, 248);
  doc.setDrawColor(210, 210, 210);
  doc.roundedRect(12, y, 186, condicionesBoxHeight, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("CONDICIONES DEL SERVICIO:", 16, y + 7);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);

  let cy = y + 13;

  condiciones.forEach((condicion) => {
    const lineas = doc.splitTextToSize(`• ${condicion}`, 170);
    doc.text(lineas, 18, cy);
    cy += lineas.length * 4.2;
  });

  y += condicionesBoxHeight + 8;

  // ======================
  // PROPUESTA ECONÓMICA
  // ======================
  y = agregarPaginaSiFaltaEspacio(doc, y, 55);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("PROPUESTA ECONÓMICA", 12, y);

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
      `S/ ${Number(item.precio || 0).toFixed(2)}`,
      `S/ ${(Number(item.precio || 0) * 30).toFixed(2)}`,
    ]),
    styles: {
      fontSize: 7.2,
      cellPadding: 1.4,
      halign: "center",
      lineColor: [0, 0, 0],
      lineWidth: 0.2,
    },
    headStyles: {
      fillColor: [235, 235, 235],
      textColor: [0, 0, 0],
      fontStyle: "bold",
    },
    columnStyles: {
      0: { cellWidth: 12 },
      1: { cellWidth: 45 },
      2: { cellWidth: 55 },
      3: { cellWidth: 37 },
      4: { cellWidth: 37 },
    },
  });

  y = doc.lastAutoTable.finalY + 8;

  // ======================
  // NOTA Y TOTALES
  // ======================
  y = agregarPaginaSiFaltaEspacio(doc, y, 60);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("NOTA:", 12, y);

  doc.setFont("helvetica", "normal");
  doc.text(
    "Los precios están expresados por día. Los montos totales indicados incluyen IGV.",
    25,
    y
  );

  y += 7;

  doc.setFillColor(255, 248, 220);
  doc.setDrawColor(212, 160, 23);
  doc.roundedRect(112, y, 86, 34, 2, 2, "FD");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("Subtotal por día:", 118, y + 7);
  doc.text(`S/ ${subtotalDia.toFixed(2)}`, 192, y + 7, {
    align: "right",
  });

  doc.text("IGV 18% por día:", 118, y + 13);
  doc.text(`S/ ${igvDia.toFixed(2)}`, 192, y + 13, {
    align: "right",
  });

  doc.setDrawColor(212, 160, 23);
  doc.line(118, y + 17, 192, y + 17);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("TOTAL POR DÍA:", 118, y + 24);
  doc.text(`S/ ${totalDia.toFixed(2)}`, 192, y + 24, {
    align: "right",
  });

  doc.text("TOTAL 30 DÍAS:", 118, y + 30);
  doc.text(`S/ ${totalMensual.toFixed(2)}`, 192, y + 30, {
    align: "right",
  });

  y += 45;

  // ======================
  // FORMA DE PAGO
  // ======================
  y = agregarPaginaSiFaltaEspacio(doc, y, 45);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("FORMA DE PAGO", 12, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text(
    "El pago se realizará de forma mensual según valorización y presentación de factura.",
    12,
    y + 6
  );

  doc.text("Condición: los montos totales indicados incluyen IGV.", 12, y + 12);

  doc.text("Atentamente,", 12, y + 25);

  const firmaY = y + 38;

  doc.setDrawColor(0, 0, 0);
  doc.line(125, firmaY, 190, firmaY);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text(empresa.representante.toUpperCase(), 157.5, firmaY + 5, {
    align: "center",
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("Gerente General", 157.5, firmaY + 9, {
    align: "center",
  });

  doc.text(empresa.nombre, 157.5, firmaY + 13, {
    align: "center",
  });

  // ======================
  // PIE DE PÁGINA
  // ======================
  const totalPaginas = doc.internal.getNumberOfPages();

  for (let i = 1; i <= totalPaginas; i++) {
    doc.setPage(i);

    doc.setDrawColor(212, 160, 23);
    doc.line(10, 287, 200, 287);

    doc.setFontSize(7);
    doc.setTextColor(90, 90, 90);
    doc.text(
      `${empresa.nombre} | RUC: ${empresa.ruc} | Tel: ${empresa.telefono}`,
      105,
      292,
      { align: "center" }
    );

    doc.text(`Página ${i} de ${totalPaginas}`, 195, 292, {
      align: "right",
    });
  }

  doc.save(`${cotizacion.codigo}.pdf`);
};