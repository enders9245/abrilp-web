import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import QRCode from "qrcode";
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

  if (String(fecha).includes("T")) {
    return String(fecha).split("T")[0].split("-").reverse().join("/");
  }

  if (String(fecha).includes("-")) {
    return String(fecha).split("-").reverse().join("/");
  }

  return fecha;
};

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
const igv = Number(factura.igv || 0);
const total = Number(factura.total || 0);

  const qrTexto = `${empresa.ruc}|01|${factura.codigo}|${igv.toFixed(
    2
  )}|${total.toFixed(2)}|${formatearFecha(factura.fecha)}|6|${
    factura.cliente_ruc || "-"
  }`;

  const qrData = await QRCode.toDataURL(qrTexto);

  doc.setFillColor(20, 20, 20);
  doc.rect(0, 0, 210, 6, "F");

  doc.addImage(img, "PNG", 12, 10, 35, 25);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(empresa.nombre, 52, 17);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(`RUC: ${empresa.ruc}`, 52, 23);
  doc.text(`Dirección: ${empresa.direccion}`, 52, 28);
  doc.text(`Tel: ${empresa.telefono} | ${empresa.correo}`, 52, 33);

  doc.setDrawColor(212, 160, 23);
  doc.setLineWidth(0.8);
  doc.line(10, 42, 200, 42);

  doc.setDrawColor(0, 0, 0);
  doc.roundedRect(145, 11, 52, 30, 2, 2);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("RUC: " + empresa.ruc, 171, 18, { align: "center" });
  doc.text("FACTURA ELECTRÓNICA", 171, 26, { align: "center" });
  doc.text(factura.codigo || "-", 171, 34, { align: "center" });

  let y = 55;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("DATOS DEL CLIENTE", 12, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text(`Cliente: ${factura.cliente || "-"}`, 12, y + 7);
  doc.text(`RUC: ${factura.cliente_ruc || "-"}`, 12, y + 13);
  doc.text(`Dirección: ${factura.cliente_direccion || "-"}`, 12, y + 19);
  doc.text(`Fecha de emisión: ${formatearFecha(factura.fecha)}`, 120, y + 7);
  doc.text(`Cotización: ${factura.cotizacion_codigo || "-"}`, 120, y + 13);

  y += 32;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("DETALLE DEL SERVICIO", 12, y);

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
      `S/ ${Number(item.precio || 0).toFixed(2)}`,
      `S/ ${(Number(item.precio || 0) * 30).toFixed(2)}`,
    ]),
    styles: {
      fontSize: 7.5,
      cellPadding: 1.5,
      halign: "center",
      lineColor: [0, 0, 0],
      lineWidth: 0.2,
    },
    headStyles: {
      fillColor: [235, 235, 235],
      textColor: [0, 0, 0],
      fontStyle: "bold",
    },
  });

  y = doc.lastAutoTable.finalY + 10;

  doc.addImage(qrData, "PNG", 12, y, 35, 35);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.text("Código QR de verificación", 29.5, y + 40, {
    align: "center",
  });

  doc.setFillColor(255, 248, 220);
  doc.setDrawColor(212, 160, 23);
  doc.roundedRect(120, y, 78, 35, 2, 2, "FD");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("Subtotal:", 126, y + 8);
  doc.text(`S/ ${subtotal.toFixed(2)}`, 192, y + 8, {
    align: "right",
  });

  doc.text("IGV 18%:", 126, y + 15);
  doc.text(`S/ ${igv.toFixed(2)}`, 192, y + 15, {
    align: "right",
  });

  doc.setDrawColor(212, 160, 23);
  doc.line(126, y + 20, 192, y + 20);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("TOTAL:", 126, y + 29);
  doc.text(`S/ ${total.toFixed(2)}`, 192, y + 29, {
    align: "right",
  });

  y += 55;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("OBSERVACIÓN:", 12, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(
    "Documento generado desde el sistema interno ABRILP. Para emisión oficial SUNAT se requiere XML, firma digital y envío a SUNAT/OSE.",
    12,
    y + 6
  );

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

  doc.save(`${factura.codigo}.pdf`);
};