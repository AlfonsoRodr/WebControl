// Cargar variables de entorno ANTES de importar el servicio
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

import { contactoService } from "../FacturaDirecta/Contactos/ContactoService.mjs";
import { productoService } from "../FacturaDirecta/Productos/ProductoService.mjs";
import { presupuestoService } from "../FacturaDirecta/Presupuestos/PresupuestoService.mjs";

async function test() {
  try {
    /*
    // 1. Listar productos
    const response = await productoService.getAllProductos();
    console.log("Respuesta exitosa!");
    console.log(
      "Total de productos:",
      response.data.pagination?.total || response.data.items?.length
    );
    console.log("\nPrimeros productos:");
    console.log(JSON.stringify(response.data.items?.slice(0, 3), null, 2));
    */
    /*
    // 2. Crear producto
    const nuevoProducto = {
      content: {
        type: "product",
        main: {
          sku: "PV001",
          name: "MSI GE67 Raider",
          currency: "EUR",
          sales: {
            price: 2500,
            description: "Portátil Gaming",
            tax: ["S_IVA_21"],
            account: "700000",
          },
        },
      },
    };
    const created = await productoService.createProducto(nuevoProducto);
    console.log("Producto creado:", created.data);
    */
    /*
    // 3. Obtener un producto concreto
    const idProducto = "pro_402a0a87-adf0-463e-81f7-c1c3a2f967cd";
    const producto = await productoService.getProducto(idProducto);
    console.log("Producto devuelto:", producto.data);
    */
    /*
    // 4. Borrar un producto concreto
    const id = "pro_402a0a87-adf0-463e-81f7-c1c3a2f967cd";
    const operacion = await productoService.deleteProducto(id);
    console.log("Operación de borrado", operacion.data);
    */

    // 5. Actualizar un producto concreto
    const id = "pro_de750bcd-1464-4bd2-8850-40634fceea83";
    const productoActualizado = {
      content: {
        type: "product",
        uuid: id,
        main: {
          title: "RTX 5090 Suprim Liquid",
          name: "RTX 5090 Suprim Liquid",
          sku: "PRO02",
          externalId: "PRO02",
          currency: "EUR",
          sales: {
            price: 3500,
            description: "Con refrigeración líquida",
            tax: ["S_IVA_21"],
            account: "081081",
          },
        },
      },
    };
    const operacion = await productoService.updateProducto(
      id,
      productoActualizado
    );
    console.log("Operación de actualización", operacion.data);
  } catch (error) {
    console.error("Error:", error.message);
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Headers enviados:", error.config?.headers);
      console.error("URL:", error.config?.url);
      console.error("Respuesta de la API:", error.response.data);
    }
  }
}

test();
