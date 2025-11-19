import axios from "axios";
import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

// Configuración de API Key e ID de la empresa
const API_KEY = process.env.FACTURADIRECTA_API_KEY;
const COMPANY_ID = process.env.FACTURADIRECTA_COMPANY_ID;
const BASE_URL = "https://app.facturadirecta.com/api";

const app = express();
app.use(express.json());

//#region ENDPOINTS CONTACTOS

// Listar contactos

app.get("/facturadirecta/contactos", async (req, res) => {
  try {
    const url = `${BASE_URL}/${COMPANY_ID}/contacts`;
    const result = await axios.get(url, {
      headers: {
        "Facturadirecta-Api-Key": API_KEY,
        "Accept-Version": "1.0.8",
        "Content-Type": "application/json",
      },
    });
    res.json(result.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear Contacto

app.post("/facturadirecta/contactos", async (req, res) => {
  try {
    const url = `${BASE_URL}/${COMPANY_ID}/contacts`;
    const nuevoContacto = req.body;
    const result = await axios.post(url, nuevoContacto, {
      headers: {
        "Facturadirecta-Api-Key": API_KEY,
        "Accept-Version": "1.0.8",
        "Content-Type": "application/json",
      },
    });
    res.json(result.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//#endregion

async function ListarFacturas() {
  try {
    const response = await axios.get(`${BASE_URL}/${COMPANY_ID}/invoices`, {
      headers: {
        "Facturadirecta-Api-Key": API_KEY,
        "Accept-version": "1.0.8",
        "Content-Type": "application/json",
      },
    });
    console.log("✅ Facturas encontradas:");
    // console.log(response.data);

    // Iterar sobre las facturas para retornar los Id's
    const listaFacturas = response.data.items;

    if (listaFacturas && listaFacturas.length > 0) {
      console.log("UUIDs de las facturas: ");

      listaFacturas.forEach((facturaItem) => {
        // Del campo Items recuperamos el subcampo content con lo que necesitamos
        const facturaContent = facturaItem.content;

        // el uuid se encuentra dentro de content
        const uuidFactura = facturaContent.uuid;

        //console.log(`UUID: ${uuidFactura}`);
        //console.log(response.data);

        console.log(facturaContent);
      });
    }
  } catch (err) {
    console.error("❌ Error:", err.response ? err.response.data : err.message);
  }
}

//#region LISTAR CONTACTOS
async function ListarContactos() {
  const url = `${BASE_URL}/${COMPANY_ID}/contacts`;

  try {
    const response = await axios.get(url, {
      headers: {
        "Facturadirecta-Api-Key": API_KEY,
        "Accept-Version": "1.0.8",
        "Content-Type": "aplication/json",
      },
    });

    console.log("✅ Contactos encontrados...");

    // La lista de contactos está en response.data.items [1]
    const listaDeContactos = response.data.items;

    if (listaDeContactos && listaDeContactos.length > 0) {
      console.log("UUIDs de los contactos:");

      // Iteramos sobre la lista de elementos (ContactResponse)
      listaDeContactos.forEach((contactoItem) => {
        // El contenido del contacto se encuentra en la propiedad 'content' [1]
        const contactoContent = contactoItem.content;

        // El UUID se encuentra dentro del objeto content [1]
        const uuidContacto = contactoContent.uuid;
        // El nombre de cada contacto
        const nombre = contactoContent.main.name;

        //console.log(`Nombre: ${nombre}`);
        //console.log(`UUID: ${uuidContacto}`);
        console.log(contactoContent);

        // Opcionalmente, puedes acceder a otros datos principales, como el nombre fiscal:
        // const nombreFiscal = contactoContent.main.name; // 'main' contiene datos como 'name*' [3, 4]
        // console.log(`Nombre: ${nombreFiscal}, UUID: ${uuidContacto}`);
      });
    } else {
      console.log("No se encontraron contactos en la respuesta.");
    }
  } catch (err) {
    console.log(
      "❌ Error al listar los contactos",
      err.response?.data || err.message
    );
  }
}

//#region LISTAR IMPUESTOS DE VENTA
async function ListarImpuestos() {
  const url = `${BASE_URL}/${COMPANY_ID}/settings/taxes/sales`;

  try {
    const response = await axios.get(url, {
      headers: {
        "Facturadirecta-Api-Key": API_KEY,
        "Accept-Version": "1.0.8",
        "Content-Type": "aplication/json",
      },
    });

    const ListaImpuestos = response.data.items;

    if (ListaImpuestos && ListaImpuestos.length > 0) {
      console.log("Taxes: ");
      ListaImpuestos.forEach((taxItem) => {
        const taxId = taxItem.id;
        const taxTitle = taxItem.title;

        console.log(`Titulo: ${taxTitle}`);
        console.log(`Id: ${taxId}`);
      });
    }
  } catch (err) {
    console.error(
      "❌ Error al listar taxes:",
      err.response?.data || err.message
    );
  }
}

//#region CREAR FACTURA
async function CrearFactura() {
  // 1. La URL debe incluir el COMPANY_ID, siguiendo el patrón de listarFacturas .
  const urlFacturacion = `${BASE_URL}/${COMPANY_ID}/invoices`;

  try {
    // 2. Definición del payload de la factura, ajustándose a la estructura de la API:
    // CreateInvoiceRequest requiere el objeto principal bajo 'content' .
    const nuevaFacturaPayload = {
      content: {
        // 'type' es un campo requerido en InvoiceWrite .
        type: "invoice", // Se asume el valor 'invoice' para el tipo de documento.

        // Los datos principales de la factura se anidan bajo 'main' .
        main: {
          // Usamos 'contact' para el ID del cliente, en lugar de 'client_id' .
          contact: "con_f05432f0-2c42-43e9-b464-3afb40e20bbe",

          // docNumber es obligatorio y requiere la serie ('series')  7].
          docNumber: {
            series: "A", // Debe ser una serie válida configurada en tu empresa .
          },

          // Usamos 'date' en lugar de 'issue_date' .
          date: "2025-10-27",

          // 'dueDate' .
          dueDate: "2025-11-27",

          // Notas o comentarios opcionales ('notes') .
          notes: "Factura generada automáticamente con la API DE PRUEBA.",

          // Conceptos de la factura ('lines').
          lines: [
            {
              // Usamos 'text' en lugar de 'description' para la línea de factura.
              quantity: 1, // Requerido.

              // Los impuestos se indican en un array 'tax', usando el 'id' interno del impuesto ('TaxId').
              tax: ["S_IVA_21"],
              text: "Prueba de la API",
              // Usamos 'unitPrice' en lugar de 'unit_price'.
              unitPrice: 100.0,
            },
          ],
        },
      },
    };

    const response = await axios.post(urlFacturacion, nuevaFacturaPayload, {
      headers: {
        "Facturadirecta-Api-Key": API_KEY,
        "Accept-version": "1.0.8",
        "Content-Type": "application/json",
      },
    });

    console.log("✅ Factura creada correctamente:");
    console.log(response.data);
  } catch (err) {
    console.error(
      "❌ Error al crear factura:",
      err.response?.data || err.message
    );
  }
}

//#region ACTUALIZAR FACTURA
async function ActualizarFactura() {
  // Parametros: CompanyId, FacturaId, (accept-version, 1.0.8)
  const idFacturaPrueba = "inv_f0bc759f-0321-4036-adf3-8ee44572d4a9";
  const url = `${BASE_URL}/${COMPANY_ID}/invoices/${idFacturaPrueba}`;

  try {
    const body = {
      content: {
        type: "invoice",
        main: {
          contact: "con_f05432f0-2c42-43e9-b464-3afb40e20bbe",
          docNumber: {
            series: "F25 00000001", // numero de serie de la factura a actualizar
          },
          lines: [
            {
              quantity: 1,
              tax: ["01"],
              text: "Prueba de actualizacion de factura",
              unitPrice: 100,
            },
          ],
        },
      },
    };

    const response = await axios.put(url, body, {
      headers: {
        "Facturadirecta-Api-Key": API_KEY,
        "Accept-version": "1.0.8",
        "Content-Type": "application/json",
      },
    });

    console.log("✅ Factura modificada correctamente:");
  } catch (err) {
    console.error(
      "❌ Error al crear factura:",
      err.response?.data || err.message
    );
  }
}

app.listen(3000, () => {
  console.log("Servidor ERP corriendo en http://localhost:3000");
});

//#region LLAMADA A LAS FUNCIONES

//ListarFacturas();
//ListarContactos();
// ListarImpuestos();
// ActualizarFactura();
// CrearFactura();
