# Integración API de FacturaDirecta en WebControl ERP

**Versión:** 1.0
**Fecha:** Octubre 2025
**Autor:** Equipo WebControl

---

## 📋 Índice

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Arquitectura de la Integración](#arquitectura-de-la-integración)
3. [Guía de Instalación](#guía-de-instalación)
4. [Estructura de Archivos](#estructura-de-archivos)
5. [Configuración](#configuración)
6. [Uso de Endpoints](#uso-de-endpoints)
7. [Extender Funcionalidad](#extender-funcionalidad)
8. [Problemas Comunes y Soluciones](#problemas-comunes-y-soluciones)
9. [Buenas Prácticas](#buenas-prácticas)

---

## 🎯 Resumen Ejecutivo

Esta integración permite conectar nuestro ERP **WebControl** con la API de **FacturaDirecta** para gestionar facturas, contactos y otros recursos de facturación desde nuestra aplicación.

### Tecnologías utilizadas:

- **TypeScript** (archivos de integración con FacturaDirecta)
- **ts-node** (ejecución de TypeScript en desarrollo sin compilación previa)
- **JavaScript** (servidor Express y endpoints del ERP)
- **dotenv** (gestión de variables de entorno)
- **API Key** de FacturaDirecta (autenticación simplificada)

### Características principales:

✅ Autenticación mediante API Key (sin OAuth)
✅ Gestión de facturas (listar, crear, generar PDF)
✅ Gestión de contactos (listar)
✅ Arquitectura modular y extensible
✅ Manejo robusto de errores

---

## 🏗️ Arquitectura de la Integración

### Flujo de datos:

```
Cliente (REST Client/Frontend)
    ↓
Express Server (JavaScript)
    ↓
Módulos de integración (TypeScript via ts-node)
    ↓
API de FacturaDirecta
```

### Componentes principales:

1. **Carpeta `facturadirecta/`**: Contiene toda la lógica de integración
2. **Servidor de pruebas**: `src/test/test-integracion-facturadirecta.js`
3. **Configuración**: Archivo `.env` con credenciales
4. **Definiciones de tipos**: `facturadirecta/src/@types/facturadirecta.d.ts`

---

## 📦 Guía de Instalación

### Prerequisitos:

- Node.js >= 12
- npm o yarn
- API Key de FacturaDirecta (obtenida desde su panel de administración)

### Paso 1: Copiar archivos de integración

Estructura a copiar en el proyecto:

```
tu-proyecto/
├── facturadirecta/
│   ├── src/
│   │   ├── lib/
│   │   │   ├── apiCommon.ts
│   │   │   ├── apiLogin.ts
│   │   │   ├── apiInvoices.ts
│   │   │   ├── apiProfile.ts
│   │   │   └── apiContacts.ts
│   │   └── @types/
│   │       └── facturadirecta.d.ts
│   └── tsconfig.json
└── .env
```

### Paso 2: Instalar dependencias

```bash
npm install --save ts-node typescript got@11 ajv lodash dotenv --legacy-peer-deps
npm install --save-dev @types/node @types/lodash --legacy-peer-deps
```

**⚠️ Nota importante:** Usa la flag `--legacy-peer-deps` si tu proyecto usa `react-scripts@5.0.1`, ya que hay conflictos entre TypeScript 5.x y react-scripts que requiere TypeScript 4.x. Este conflicto es cosmético y no afecta la funcionalidad.

### Paso 3: Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# API Key de FacturaDirecta (obtener desde https://app.facturadirecta.com)
FACTURADIRECTA_API_KEY=tu_api_key_aqui

# ID de empresa por defecto (obtener desde https://app.facturadirecta.com)
FACTURADIRECTA_COMPANY_ID=com_tu_company_id_aqui
```

**🔒 Seguridad:** Añade `.env` a tu `.gitignore` para no subir credenciales a Git:

```bash
echo ".env" >> .gitignore
```

### Paso 4: Crear servidor de pruebas

Crea `src/test/test-integracion-facturadirecta.js` (ver sección de código completo al final).

---

## 📂 Estructura de Archivos

### Carpeta `facturadirecta/src/lib/`

Esta carpeta contiene los módulos principales de la integración. Cada archivo sigue el patrón **CRUD + API Client**:

#### **1. `apiCommon.ts`** - Utilidades compartidas

**Propósito:** Funciones y tipos comunes usados por todos los módulos.

**Funciones principales:**

- `apiHeaders(credentials)`: Genera headers HTTP con autenticación (API Key o Bearer Token)
- `getSearchParams(query)`: Convierte objetos JavaScript a URLSearchParams para queries
- `webDocumentUrl()`: Genera URLs públicas de documentos en FacturaDirecta

**Tipos importantes:**

- `AnyCredential`: Union type para API Key (string) o OAuth credentials (object)
- `ApiCallResult<T>`: Tipo de retorno estándar con data + credentials actualizadas
- Tipos importados de `facturadirecta.d.ts`: Invoice, Contact, etc.

**Constantes:**

```typescript
API_BASE_URL = "https://app.facturadirecta.com/api";
AUTH_SERVER = "https://auth.facturadirecta.com/...";
```

---

#### **2. `apiLogin.ts`** - Gestión de autenticación

**⚠️ VERSIÓN SIMPLIFICADA - Solo API Key**

**Razón de la simplificación:**
Originalmente este archivo contenía toda la lógica OAuth (login con navegador, refresh tokens, JWT, etc.), lo que requería dependencias pesadas como `express`, `jsonwebtoken`, y `open`.

**¿Por qué lo simplificamos?**

1. **Nuestro ERP usa solo API Key** en producción (más simple y directo)
2. **Reducir dependencias** innecesarias
3. **Evitar complejidad** de gestión de tokens, refresh, expiración, etc.
4. **OAuth es para apps de terceros** que necesitan acceso delegado; nosotros tenemos control total de la API Key

**Función principal:**

```typescript
refreshCredentials(params: { credentials: AnyCredential }): Promise<AnyCredential>
```

**Lógica:**

- Si `credentials` es un **string** (API Key) → lo devuelve sin cambios
- Si `credentials` es un **objeto** (OAuth) → lanza error indicando que no está soportado

**📝 Nota:** Si en el futuro necesitas OAuth (ej: permitir que clientes conecten sus cuentas de FacturaDirecta), puedes restaurar el archivo original del proyecto de prueba.

---

#### **3. `apiInvoices.ts`** - Gestión de facturas

**Propósito:** CRUD completo de facturas.

**Funciones disponibles:**

```typescript
getInvoices(params: {
  credentials: AnyCredential;
  companyId: string;
  query?: GetInvoicesQuery;
}): Promise<ApiCallResult<GetInvoicesResponse>>
```

- Lista facturas con filtros y paginación
- `query` soporta: `limit`, `offset`, `sortBy`, filtros de fecha, etc.

```typescript
createInvoice(params: {
  credentials: AnyCredential;
  companyId: string;
  body: CreateInvoiceRequestBody;
}): Promise<ApiCallResult<CreateInvoiceResponse>>
```

- Crea una nueva factura
- `body` debe incluir: `content`, opcionalmente `tags` y `payments`

```typescript
createInvoicePDF(params: {
  credentials: AnyCredential;
  companyId: string;
  invoiceId: string;
  body: CreateInvoicePDFRequestBody;
}): Promise<ApiCallResult<CreateInvoicePDFResponse>>
```

- Genera PDF de una factura existente
- Retorna URL temporal del PDF

**Patrón común en todas las funciones:**

1. Recibe `credentials` y parámetros específicos
2. Llama a `refreshCredentials()` (para API Key es transparente)
3. Realiza petición HTTP con `got`
4. Retorna `{ credentials: updatedCredentials, data: responseData }`

---

#### **4. `apiProfile.ts`** - Perfil de usuario

**Propósito:** Obtener información del usuario y empresas accesibles.

```typescript
getProfile(params: {
  credentials: AnyCredential;
}): Promise<ApiCallResult<ProfileUser>>
```

**Uso típico:**

- Obtener lista de empresas (`companies`) del usuario
- Verificar que el API Key es válido
- Obtener el primer `companyId` si no se especificó uno

---

#### **5. `apiContacts.ts`** - Gestión de contactos

**Propósito:** Listar y gestionar contactos (clientes/proveedores).

```typescript
getContacts(params: {
  credentials: AnyCredential;
  companyId: string;
  query?: { limit?: number; offset?: number };
}): Promise<ApiCallResult<GetContactsResponse>>
```

**⚠️ Importancia:** Las facturas requieren un `contactId` válido. Usa este endpoint para obtener IDs reales antes de crear facturas.

---

### Archivo `facturadirecta/src/@types/facturadirecta.d.ts`

**🤖 AUTOGENERADO - NO EDITAR MANUALMENTE**

**Origen:**
Este archivo fue generado automáticamente usando la herramienta `openapi-typescript` a partir de la especificación OpenAPI de FacturaDirecta.

**Contenido:**

- **3845 líneas** de definiciones TypeScript
- Interfaces para todos los recursos de la API
- Tipos de requests y responses
- Enums y constantes

**Regeneración:**
Si FacturaDirecta actualiza su API, regenera este archivo con:

```bash
npx openapi-typescript https://api.facturadirecta.com/openapi.json -o facturadirecta/src/@types/facturadirecta.d.ts
```

**Uso:**
Los módulos de `lib/` importan tipos desde aquí:

```typescript
import { components, operations } from "../@types/facturadirecta";
export type Invoice = components["schemas"]["Invoice"];
```

---

### Archivo `tsconfig.json`

**Propósito:** Configuración del compilador de TypeScript.

**Configuraciones clave:**

- `module: "commonjs"` - Compatible con Node.js y require()
- `target: "es2016"` - JavaScript moderno pero compatible
- `rootDir: "src"` - Carpeta fuente
- `outDir: "build"` - Carpeta de salida si se compila
- `strict: true` - Type checking estricto

---

## ⚙️ Configuración

### Opción 1: Archivo .env (Desarrollo - Recomendado)

```env
FACTURADIRECTA_API_KEY=GDrhfV.xxxxxxxxxxxxxxxxxxxxx
FACTURADIRECTA_COMPANY_ID=com_xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

**Ventajas:**

- Fácil de cambiar
- No se sube a Git (si está en `.gitignore`)
- Un archivo por ambiente

### Opción 2: Variables de entorno del sistema (Producción)

**Windows (permanente):**

```powershell
[System.Environment]::SetEnvironmentVariable('FACTURADIRECTA_API_KEY', 'tu_api_key', 'Machine')
```

**Linux/Mac:**

```bash
# Añadir a ~/.bashrc o ~/.zshrc
export FACTURADIRECTA_API_KEY="tu_api_key"
export FACTURADIRECTA_COMPANY_ID="com_tu_company_id"
```

**Ventajas:**

- Más seguro para producción
- Separación por ambiente (dev/staging/prod)

---

## 🚀 Uso de Endpoints

### Ejemplo 1: Servidor Express de pruebas

```javascript
// Cargar variables de entorno
require("dotenv").config({
  path: require("path").resolve(__dirname, "../../.env"),
});

// Configurar ts-node para importar módulos TypeScript
require("ts-node").register({
  project: "../../facturadirecta/tsconfig.json",
  transpileOnly: true,
  compilerOptions: {
    module: "commonjs",
    esModuleInterop: true,
  },
});

const express = require("express");
const {
  getInvoices,
  createInvoice,
} = require("../../facturadirecta/src/lib/apiInvoices");
const { getContacts } = require("../../facturadirecta/src/lib/apiContacts");

const app = express();
app.use(express.json());

const API_KEY = process.env.FACTURADIRECTA_API_KEY;
const COMPANY_ID = process.env.FACTURADIRECTA_COMPANY_ID;

// GET: Listar contactos
app.get("/facturadirecta/contactos", async (req, res) => {
  try {
    const result = await getContacts({
      credentials: API_KEY,
      companyId: COMPANY_ID,
      query: req.query,
    });
    res.json(result.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET: Listar facturas
app.get("/facturadirecta/facturas", async (req, res) => {
  try {
    const result = await getInvoices({
      credentials: API_KEY,
      companyId: COMPANY_ID,
      query: req.query,
    });
    res.json(result.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST: Crear factura
app.post("/facturadirecta/facturas", async (req, res) => {
  try {
    const result = await createInvoice({
      credentials: API_KEY,
      companyId: COMPANY_ID,
      body: req.body,
    });
    res.json(result.data);
  } catch (error) {
    const errorDetails = {
      message: error.message,
      statusCode: error.response?.statusCode,
      body: error.response?.body,
    };
    console.error(
      "Error creando factura:",
      JSON.stringify(errorDetails, null, 2)
    );
    res.status(error.response?.statusCode || 500).json({
      error: error.message,
      details: error.response?.body,
    });
  }
});

app.listen(3000, () => {
  console.log("Servidor ERP corriendo en http://localhost:3000");
});
```

### Ejemplo 2: Pruebas con REST Client

Archivo `pruebasEndpoints.http`:

```http
### 1. Listar contactos
GET http://localhost:3000/facturadirecta/contactos

###

### 2. Listar facturas
GET http://localhost:3000/facturadirecta/facturas?limit=10

###

### 3. Crear factura
POST http://localhost:3000/facturadirecta/facturas
Content-Type: application/json

{
  "content": {
    "type": "invoice",
    "main": {
      "docNumber": {
        "series": "TEST"
      },
      "contact": "con_xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "currency": "EUR",
      "lines": [
        {
          "quantity": 1,
          "unitPrice": 100,
          "tax": ["S_IVA_21"],
          "text": "Servicio de consultoría"
        }
      ]
    }
  },
  "tags": ["ERP", "Test"]
}
```

---

## 🔧 Extender Funcionalidad

### Añadir un nuevo recurso (Ejemplo: Albaranes)

**Paso 1: Verificar que existe en `facturadirecta.d.ts`**

```bash
grep -i "deliveryNote" facturadirecta/src/@types/facturadirecta.d.ts
```

Si existe, los tipos ya están disponibles.

**Paso 2: Crear módulo `apiDeliveryNotes.ts`**

```typescript
// facturadirecta/src/lib/apiDeliveryNotes.ts

import { refreshCredentials } from "./apiLogin";
import {
  AnyCredential,
  ApiCallResult,
  apiHeaders,
  API_BASE_URL,
  getSearchParams,
} from "./apiCommon";
import got from "got";
import { components, operations } from "../@types/facturadirecta";

// Importar tipos desde el archivo autogenerado
export type DeliveryNote = components["schemas"]["DeliveryNote"];
export type GetDeliveryNotesQuery = Exclude<
  operations["getDeliveryNotes"]["parameters"],
  undefined
>["query"];
export type GetDeliveryNotesResponse =
  operations["getDeliveryNotes"]["responses"][200]["content"]["application/json"];

// Listar albaranes
export async function getDeliveryNotes(params: {
  credentials: AnyCredential;
  companyId: string;
  query?: GetDeliveryNotesQuery;
}): Promise<ApiCallResult<GetDeliveryNotesResponse>> {
  const { credentials, companyId, query } = params;
  const updatedCredentials = await refreshCredentials({ credentials });

  const res = await got.get(`${API_BASE_URL}/${companyId}/deliveryNotes`, {
    headers: apiHeaders(updatedCredentials),
    responseType: "json",
    searchParams: getSearchParams(query),
  });

  return {
    credentials: updatedCredentials,
    data: res.body as GetDeliveryNotesResponse,
  };
}

// Crear albarán
export async function createDeliveryNote(params: {
  credentials: AnyCredential;
  companyId: string;
  body: any; // Definir tipo específico desde facturadirecta.d.ts
}): Promise<ApiCallResult<any>> {
  const { credentials, companyId, body } = params;
  const updatedCredentials = await refreshCredentials({ credentials });

  const res = await got.post(`${API_BASE_URL}/${companyId}/deliveryNotes`, {
    headers: apiHeaders(updatedCredentials),
    json: body,
    responseType: "json",
  });

  return {
    credentials: updatedCredentials,
    data: res.body,
  };
}
```

**Paso 3: Añadir endpoints en Express**

```javascript
const {
  getDeliveryNotes,
  createDeliveryNote,
} = require("../../facturadirecta/src/lib/apiDeliveryNotes");

app.get("/facturadirecta/albaranes", async (req, res) => {
  try {
    const result = await getDeliveryNotes({
      credentials: API_KEY,
      companyId: COMPANY_ID,
      query: req.query,
    });
    res.json(result.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

**Paso 4: Probar**

```http
GET http://localhost:3000/facturadirecta/albaranes
```

### Patrón a seguir para cualquier recurso:

1. ✅ Verificar tipos en `facturadirecta.d.ts`
2. ✅ Crear `api[Recurso].ts` en `facturadirecta/src/lib/`
3. ✅ Importar tipos necesarios desde `facturadirecta.d.ts`
4. ✅ Implementar funciones siguiendo el patrón de `apiInvoices.ts`
5. ✅ Añadir endpoints en Express
6. ✅ Probar con REST Client

---

## ⚠️ Problemas Comunes y Soluciones

### Problema 1: Error "Cannot find module 'jsonwebtoken'"

**Causa:** Dependencias OAuth no instaladas.

**Solución aplicada:**
Simplificamos `apiLogin.ts` para eliminar dependencias OAuth. Si ves este error, asegúrate de usar la versión simplificada de `apiLogin.ts` (solo 30 líneas).

**Verificación:**

```bash
head -n 10 facturadirecta/src/lib/apiLogin.ts
# Debería ver: "// Versión simplificada solo para API Key"
```

---

### Problema 2: Error "Response code 400 (Bad Request)" al crear factura

**Causa:** Usar un `contactId` de ejemplo que no existe en tu cuenta.

**Solución:**

1. Ejecutar endpoint de contactos: `GET /facturadirecta/contactos`
2. Copiar un `id` real de la respuesta
3. Usar ese `id` en el campo `contact` de la factura

**Ejemplo correcto:**

```json
{
  "content": {
    "main": {
      "contact": "con_d21c2ab3-8a9c-4851-8737-f2f78db073c8" // ✅ ID real
    }
  }
}
```

**Ejemplo incorrecto:**

```json
{
  "content": {
    "main": {
      "contact": "con_10000000-0000-4000-8000-000000000000" // ❌ ID de ejemplo
    }
  }
}
```

---

### Problema 3: Conflicto de dependencias TypeScript

**Error:**

```
npm error ERESOLVE could not resolve
npm error Conflicting peer dependency: typescript@4.9.5
```

**Causa:** `react-scripts@5.0.1` requiere TypeScript 4.x, pero instalamos TypeScript 5.x.

**Solución:**
Usar flag `--legacy-peer-deps` en todos los comandos npm:

```bash
npm install --save ts-node typescript --legacy-peer-deps
npm install --save-dev @types/node @types/lodash --legacy-peer-deps
```

**Alternativa:** Si prefieres evitar el warning, usa TypeScript 4.x:

```bash
npm install --save typescript@~4.9.5
```

**📝 Nota:** Este conflicto es solo de versiones peer, no afecta la funcionalidad.

---

### Problema 4: Error "Cannot find module './apiLogin'" o extensión .ts

**Causa:** Imports TypeScript con extensión `.ts` o rutas incorrectas.

**Solución:**

- ❌ Incorrecto: `require("../../facturadirecta/src/lib/apiInvoices.ts")`
- ✅ Correcto: `require("../../facturadirecta/src/lib/apiInvoices")`

**ts-node resuelve automáticamente** las extensiones `.ts`, no las incluyas en los requires.

---

### Problema 5: API_KEY undefined o error "OAuth not supported"

**Causa:** Variable de entorno no cargada correctamente.

**Solución 1 - Verificar carga de dotenv:**

```javascript
require("dotenv").config({
  path: require("path").resolve(__dirname, "../../.env"),
});
console.log(
  "API_KEY:",
  process.env.FACTURADIRECTA_API_KEY ? "✓ Cargada" : "✗ No encontrada"
);
```

**Solución 2 - Verificar archivo .env:**

```bash
# Verificar que existe
ls -la .env

# Ver contenido (sin exponer la clave completa)
head -c 20 .env && echo "..."
```

**Solución 3 - Hardcodear para pruebas (NO en producción):**

```javascript
const API_KEY = process.env.FACTURADIRECTA_API_KEY || "tu_api_key_aqui";
```

---

### Problema 6: Error de manejo de errores sin detalles

**Solución:** Mejorar el catch para mostrar el cuerpo de la respuesta:

```javascript
app.post("/facturadirecta/facturas", async (req, res) => {
  try {
    const result = await createInvoice({ ... });
    res.json(result.data);
  } catch (error) {
    // ✅ Capturar detalles completos del error
    const errorDetails = {
      message: error.message,
      statusCode: error.response?.statusCode,
      body: error.response?.body,  // ← Clave: detalles de la API
    };
    console.error("Error:", JSON.stringify(errorDetails, null, 2));
    res.status(error.response?.statusCode || 500).json({
      error: error.message,
      details: error.response?.body,
    });
  }
});
```

Ahora verás errores específicos como:

```json
{
  "error": "Response code 400 (Bad Request)",
  "details": {
    "message": "Contact not found",
    "code": "CONTACT_NOT_FOUND"
  }
}
```

---

## ✅ Buenas Prácticas

### 1. Seguridad

- ✅ **Nunca** subas `.env` a Git (añádelo a `.gitignore`)
- ✅ Usa variables de entorno en producción
- ✅ Crea `.env.example` como plantilla para el equipo
- ✅ Rota las API Keys periódicamente
- ✅ Usa API Keys diferentes para dev/staging/prod

### 2. Gestión de errores

- ✅ Siempre captura `error.response.body` para detalles
- ✅ Log de errores en servidor (console.error)
- ✅ Devuelve mensajes claros al cliente
- ✅ Usa códigos HTTP apropiados (400, 404, 500, etc.)

### 3. TypeScript

- ✅ **NO** edites `facturadirecta.d.ts` manualmente
- ✅ Aprovecha los tipos para autocompletado en VS Code
- ✅ Importa tipos desde `facturadirecta.d.ts` en nuevos módulos
- ✅ Usa `transpileOnly: true` en desarrollo para más velocidad

### 4. Testing

- ✅ Prueba endpoints con REST Client antes de integrar en frontend
- ✅ Usa datos de prueba en desarrollo (series "TEST", "DEV", etc.)
- ✅ Verifica contactos existentes antes de crear facturas
- ✅ Guarda ejemplos de requests en archivos `.http`

### 5. Producción

- ⚠️ **ts-node es solo para desarrollo**
- ✅ Para producción, compila a JavaScript:
  ```bash
  npx tsc --project facturadirecta/tsconfig.json
  ```
- ✅ Luego usa los archivos compilados:
  ```javascript
  const { getInvoices } = require("../../facturadirecta/build/lib/apiInvoices");
  ```
- ✅ Esto mejora el rendimiento y elimina dependencias dev

### 6. Versionado

- ✅ Mantén un CHANGELOG.md con cambios en la integración
- ✅ Documenta versiones de la API de FacturaDirecta usadas
- ✅ Guarda backups del archivo `facturadirecta.d.ts` antes de regenerarlo

---

## 📚 Referencias

### Documentación oficial:

- **API FacturaDirecta**: https://api.facturadirecta.com/docs
- **Panel de API Keys**: https://app.facturadirecta.com (Configuración → API)
- **Especificación OpenAPI**: https://api.facturadirecta.com/openapi.json

### Herramientas:

- **openapi-typescript**: https://github.com/drwpow/openapi-typescript
- **ts-node**: https://typestrong.org/ts-node/
- **dotenv**: https://github.com/motdotla/dotenv
- **got**: https://github.com/sindresorhus/got

### Interno:

- Archivo de pruebas: `src/test/pruebasEndpoints.http`
- Servidor de test: `src/test/test-integracion-facturadirecta.js`
- Configuración: `.env` (ver `.env.example`)

---

## 🔄 Changelog

### v1.0 (Octubre 2025)

- ✅ Integración inicial con API Key
- ✅ Módulos: facturas, contactos, perfil
- ✅ Simplificación de OAuth (eliminado)
- ✅ Servidor Express de pruebas
- ✅ Manejo robusto de errores
- ✅ Documentación completa

---

## 👥 Equipo y Soporte

**Mantenedores:**

- Equipo WebControl

**Preguntas o problemas:**

1. Revisa esta documentación
2. Consulta `src/test/pruebasEndpoints.http` para ejemplos
3. Revisa los logs del servidor para errores detallados
4. Consulta la documentación oficial de FacturaDirecta

**Contribuir:**

- Al añadir nuevos recursos, sigue el patrón de `apiInvoices.ts`
- Actualiza esta documentación con nuevos endpoints
- Añade ejemplos en `pruebasEndpoints.http`

---

**¡La integración está lista para usar! 🚀**
