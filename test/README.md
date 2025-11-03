# 🧪 Tests - Proyecto MVT Sustentaciones

Esta carpeta contiene todas las pruebas automatizadas del proyecto, organizadas por tipo.

## 📁 Estructura

```
test/
├── unit/                           # Pruebas unitarias
│   └── SustentacionModel.test.ts  # Tests del Model (26 tests)
└── e2e/                            # Pruebas End-to-End
    └── SustentacionRouter.test.ts  # Tests de rutas HTTP (próximamente)
```

## 🎯 Tipos de Pruebas

### **1. Pruebas Unitarias (`test/unit/`)**
Prueban funciones y métodos individuales en aislamiento.

#### **Archivo:** `SustentacionModel.test.ts` (26 tests)

---

##### **📦 `fetchSustentaciones()` - 3 tests**

**¿Qué hace este método?**  
Obtiene TODAS las sustentaciones del archivo JSON.

**Tests:**

1. **✅ Debe devolver un array de sustentaciones**
   - **Qué prueba:** Verifica que el método devuelva una lista (array) y que tenga 3 elementos.
   - **Por qué importa:** Asegura que el método no devuelva `undefined`, `null` o un objeto raro.
   - **Ejemplo:** Si hay 3 sustentaciones en `jest.json`, debe devolver array con 3 elementos.

2. **✅ Debe devolver sustentaciones con la estructura correcta**
   - **Qué prueba:** Verifica que cada sustentación tenga TODOS los campos necesarios (id, imagen, nombreGrupo, integrantes, materia, descripcion, contenido, destacada).
   - **Por qué importa:** Si falta un campo, la aplicación puede fallar al renderizar la página.
   - **Ejemplo:** Cada sustentación debe tener `id`, `nombreGrupo`, etc.

3. **✅ Debe lanzar error si el archivo no existe**
   - **Qué prueba:** Si intentas leer un archivo que no existe (ej: `/path/inexistente.json`), debe lanzar un error claro.
   - **Por qué importa:** Ayuda a debuggear si alguien borra accidentalmente el archivo JSON.
   - **Ejemplo:** Si el archivo no existe, debe decir "Archivo de sustentaciones no encontrado".

---

##### **🔍 `fetchSustentacionById()` - 5 tests**

**¿Qué hace este método?**  
Busca UNA sustentación por su ID.

**Tests:**

1. **✅ Debe devolver la sustentación con ID 1**
   - **Qué prueba:** Si pides la sustentación con `id: 1`, debe devolver exactamente esa sustentación.
   - **Por qué importa:** Es la funcionalidad básica del método.
   - **Ejemplo:** `fetchSustentacionById(1)` → Devuelve `{ id: 1, nombreGrupo: "TEST_GROUP_1", ... }`

2. **✅ Debe devolver la sustentación con ID 2**
   - **Qué prueba:** Similar al anterior, pero con `id: 2`. También verifica que `destacada: true` esté correcto.
   - **Por qué importa:** Asegura que el método funciona con diferentes IDs y no solo con el primero.
   - **Ejemplo:** `fetchSustentacionById(2)` → Devuelve `{ id: 2, nombreGrupo: "TEST_GROUP_2", destacada: true }`

3. **✅ Debe devolver null si el ID no existe**
   - **Qué prueba:** Si pides un ID que no existe (ej: 999), debe devolver `null` en lugar de fallar.
   - **Por qué importa:** Evita que la app crashee. En tu código puedes hacer `if (!sustentacion) { mostrar 404 }`.
   - **Ejemplo:** `fetchSustentacionById(999)` → `null`

4. **✅ Debe devolver null para ID negativo**
   - **Qué prueba:** IDs negativos (ej: -1) no son válidos, debe devolver `null`.
   - **Por qué importa:** Protege contra errores si alguien pasa un número negativo por error.
   - **Ejemplo:** `fetchSustentacionById(-1)` → `null`

5. **✅ Debe devolver null para ID 0**
   - **Qué prueba:** El ID 0 tampoco es válido (tus IDs empiezan en 1).
   - **Por qué importa:** Similar al caso anterior, evita bugs.
   - **Ejemplo:** `fetchSustentacionById(0)` → `null`

---

##### **⭐ `fetchDestacadas()` - 4 tests**

**¿Qué hace este método?**  
Obtiene solo las sustentaciones que tienen `destacada: true`.

**Tests:**

1. **✅ Debe devolver solo sustentaciones destacadas**
   - **Qué prueba:** Si hay 3 sustentaciones totales y 2 son destacadas, debe devolver solo esas 2.
   - **Por qué importa:** Es el filtro principal de la página "Destacadas".
   - **Ejemplo:** De 3 sustentaciones, solo 2 tienen `destacada: true` → Devuelve array con 2 elementos.

2. **✅ Todas las sustentaciones devueltas deben tener destacada=true**
   - **Qué prueba:** Verifica que TODAS las sustentaciones del resultado tengan `destacada: true`.
   - **Por qué importa:** Si una sustentación con `destacada: false` se cuela, es un bug del filtro.
   - **Ejemplo:** Recorre el array y verifica que cada una tenga `destacada: true`.

3. **✅ Debe incluir sustentaciones con IDs 2 y 3**
   - **Qué prueba:** En tus datos de prueba, las sustentaciones 2 y 3 son destacadas, así que deben estar en el resultado.
   - **Por qué importa:** Confirma que el método encuentra las correctas.
   - **Ejemplo:** El resultado debe incluir `id: 2` y `id: 3`, pero NO `id: 1`.

4. **✅ Debe devolver array vacío si no hay destacadas**
   - **Qué prueba:** Si modificas el archivo para que NINGUNA sustentación sea destacada, debe devolver array vacío `[]`.
   - **Por qué importa:** Evita errores cuando no hay destacadas. La página puede mostrar "No hay sustentaciones destacadas".
   - **Ejemplo:** Si todas tienen `destacada: false` → `[]`

---

##### **🔎 `searchSustentaciones()` - 8 tests**

**¿Qué hace este método?**  
Busca sustentaciones por texto (nombre, materia, integrantes, contenido).

**Tests:**

1. **✅ Debe buscar por nombre de grupo (LANNISTER)**
   - **Qué prueba:** Si buscas "LANNISTER", debe encontrar la sustentación con ese nombre.
   - **Por qué importa:** Es el caso de uso más común (buscar por nombre).
   - **Ejemplo:** `searchSustentaciones("LANNISTER")` → Encuentra 1 resultado con `nombreGrupo: "LANNISTER"`.

2. **✅ Debe buscar case-insensitive (lannister en minúsculas)**
   - **Qué prueba:** La búsqueda NO distingue mayúsculas/minúsculas. "LANNISTER" y "lannister" dan el mismo resultado.
   - **Por qué importa:** Los usuarios pueden escribir en minúsculas y debe funcionar igual.
   - **Ejemplo:** `searchSustentaciones("lannister")` → Encuentra "LANNISTER".

3. **✅ Debe buscar por materia**
   - **Qué prueba:** Si buscas "Test Subject" (la materia), debe devolver todas las sustentaciones con esa materia.
   - **Por qué importa:** Permite filtrar por materia.
   - **Ejemplo:** `searchSustentaciones("Test Subject")` → Devuelve las 3 sustentaciones.

4. **✅ Debe buscar por nombre de integrante**
   - **Qué prueba:** Si buscas "Estudiante Uno" (nombre de un integrante), debe encontrar la sustentación donde está ese integrante.
   - **Por qué importa:** Útil para buscar proyectos de un estudiante específico.
   - **Ejemplo:** `searchSustentaciones("Estudiante Uno")` → Encuentra `TEST_GROUP_1`.

5. **✅ Debe buscar por contenido**
   - **Qué prueba:** Si buscas texto dentro del campo `contenido`, debe encontrarlo.
   - **Por qué importa:** Permite buscar por palabras clave en el contenido/preguntas docentes.
   - **Ejemplo:** `searchSustentaciones("Contenido de prueba 2")` → Encuentra la sustentación con `id: 2`.

6. **✅ Debe devolver array vacío si no hay coincidencias**
   - **Qué prueba:** Si buscas algo que no existe (ej: "TEXTO_QUE_NO_EXISTE"), debe devolver array vacío `[]`.
   - **Por qué importa:** Evita errores. La app puede mostrar "No se encontraron resultados".
   - **Ejemplo:** `searchSustentaciones("XYZABC123")` → `[]`

7. **✅ Debe ignorar espacios en blanco al inicio y final**
   - **Qué prueba:** Si buscas `"  LANNISTER  "` (con espacios), debe funcionar igual que `"LANNISTER"`.
   - **Por qué importa:** Los usuarios pueden copiar/pegar texto con espacios accidentales.
   - **Ejemplo:** `searchSustentaciones("  LANNISTER  ")` → Encuentra "LANNISTER".

8. **✅ Debe devolver todas las sustentaciones si la búsqueda está vacía**
   - **Qué prueba:** Si no escribes nada en la búsqueda (`""`), debe devolver TODAS las sustentaciones.
   - **Por qué importa:** Comportamiento esperado cuando el campo de búsqueda está vacío.
   - **Ejemplo:** `searchSustentaciones("")` → Devuelve las 3 sustentaciones.

---

##### **➕ `crearSustentacion()` - 6 tests**

**¿Qué hace este método?**  
Crea una NUEVA sustentación y la guarda en el archivo JSON.

**Tests:**

1. **✅ Debe crear una nueva sustentación**
   - **Qué prueba:** Puedes crear una sustentación nueva y se le asigna un ID automático.
   - **Por qué importa:** Es la funcionalidad principal del formulario de registro.
   - **Ejemplo:** Si hay 3 sustentaciones (IDs 1, 2, 3), la nueva tendrá `id: 4`.

2. **✅ Debe generar ID autoincrementable correctamente**
   - **Qué prueba:** Si creas 2 sustentaciones seguidas, la primera tendrá ID 4 y la segunda ID 5.
   - **Por qué importa:** Asegura que los IDs sean únicos y no se repitan.
   - **Ejemplo:** Primera → `id: 4`, Segunda → `id: 5`.

3. **✅ Debe persistir la sustentación en el archivo JSON**
   - **Qué prueba:** Después de crear una sustentación, el archivo `jest.json` debe tener 4 elementos (3 iniciales + 1 nueva).
   - **Por qué importa:** Verifica que los datos SÍ se guarden en el archivo (no solo en memoria).
   - **Ejemplo:** Lee el archivo directamente y cuenta cuántas sustentaciones hay.

4. **✅ Debe crear sustentación destacada correctamente**
   - **Qué prueba:** Si creas una sustentación con `destacada: true`, debe guardarse correctamente.
   - **Por qué importa:** Asegura que el campo `destacada` funcione al crear.
   - **Ejemplo:** Crear con `destacada: true` → `fetchDestacadas()` debe devolver 3 (2 iniciales + 1 nueva).

5. **✅ Debe manejar array vacío correctamente**
   - **Qué prueba:** Si el archivo JSON está VACÍO (sin sustentaciones), la primera sustentación debe tener `id: 1`.
   - **Por qué importa:** Caso extremo cuando la BD está vacía.
   - **Ejemplo:** Array vacío `[]` → Primera sustentación tendrá `id: 1`.

6. **✅ Debe preservar todos los campos de la sustentación**
   - **Qué prueba:** Cuando creas una sustentación con TODOS los campos llenos (imagen, nombreGrupo, integrantes[], materia, descripcion, contenido, destacada), todos deben guardarse correctamente.
   - **Por qué importa:** Verifica que no se pierda ningún dato al guardar.
   - **Ejemplo:** Si pasas 3 integrantes, la sustentación guardada debe tener exactamente esos 3 integrantes.

---

**Total:** 26 tests ✅

---

### **2. Pruebas E2E (`test/e2e/`)**
Prueban el comportamiento completo de las rutas HTTP (End-to-End).

#### **Archivo:** `SustentacionRouter.test.ts` (28 tests)

**¿Qué son las pruebas E2E?**  
Simulan peticiones HTTP reales como si un usuario navegara en tu aplicación. Usan `supertest` para hacer peticiones GET/POST y verificar las respuestas.

---

##### **📄 `GET /sustentaciones` - 6 tests**

**¿Qué hace esta ruta?**  
Muestra la lista de sustentaciones con paginación (6 por página).

**Tests:**

1. **✅ Debe devolver status 200**
   - **Qué prueba:** La petición GET a `/sustentaciones` responde correctamente.
   - **Por qué importa:** Status 200 significa "OK", la ruta funciona.
   - **Ejemplo:** `GET /sustentaciones` → Status 200

2. **✅ Debe renderizar la vista de lista de sustentaciones**
   - **Qué prueba:** El HTML devuelto contiene los nombres de los grupos (TEST_GROUP_1, TEST_GROUP_2, LANNISTER).
   - **Por qué importa:** Verifica que el template EJS se renderiza con datos correctos.
   - **Ejemplo:** El HTML incluye "TEST_GROUP_1", "TEST_GROUP_2", "LANNISTER"

3. **✅ Debe soportar paginación (página 1)**
   - **Qué prueba:** La URL `/sustentaciones?page=1` funciona correctamente.
   - **Por qué importa:** La paginación es esencial cuando hay muchas sustentaciones.
   - **Ejemplo:** `GET /sustentaciones?page=1` → Status 200

4. **✅ Debe devolver 404 para página inexistente**
   - **Qué prueba:** Si pides página 999 (que no existe), devuelve 404.
   - **Por qué importa:** Evita que los usuarios vean páginas vacías sin avisar.
   - **Ejemplo:** `GET /sustentaciones?page=999` → Status 404 con mensaje "no encontrada"

5. **✅ Debe devolver 404 para página negativa**
   - **Qué prueba:** Números negativos (page=-1) no son válidos, devuelve 404.
   - **Por qué importa:** Protege contra URLs malformadas.
   - **Ejemplo:** `GET /sustentaciones?page=-1` → Status 404

6. **✅ Debe mostrar todas las sustentaciones en página 1 si son pocas**
   - **Qué prueba:** Con solo 3 sustentaciones (menos de 6), todas aparecen en página 1.
   - **Por qué importa:** Verifica que el cálculo de paginación funciona correctamente.
   - **Ejemplo:** 3 sustentaciones totales → Todas en página 1

---

##### **🔍 `GET /sustentaciones/:id` - 5 tests**

**¿Qué hace esta ruta?**  
Muestra el detalle completo de UNA sustentación específica.

**Tests:**

1. **✅ Debe devolver status 200 para ID válido**
   - **Qué prueba:** La petición `GET /sustentaciones/1` responde correctamente.
   - **Por qué importa:** La funcionalidad básica de ver detalle.
   - **Ejemplo:** `GET /sustentaciones/1` → Status 200

2. **✅ Debe renderizar la vista de detalle con datos correctos**
   - **Qué prueba:** El HTML incluye el nombre del grupo (TEST_GROUP_1) y los integrantes (Estudiante Uno).
   - **Por qué importa:** Asegura que se muestran todos los datos de la sustentación.
   - **Ejemplo:** HTML contiene "TEST_GROUP_1", "Estudiante Uno", "Descripción de prueba 1"

3. **✅ Debe mostrar descripción y contenido separados**
   - **Qué prueba:** Los campos `descripcion` y `contenido` aparecen en el HTML (en columnas separadas).
   - **Por qué importa:** Verifica que la separación de campos funciona correctamente.
   - **Ejemplo:** HTML contiene ambos: "Descripción de prueba 2" Y "Contenido de prueba 2"

4. **✅ Debe devolver 404 para ID inexistente**
   - **Qué prueba:** Si pides ID 999 (no existe), devuelve página 404.
   - **Por qué importa:** Manejo correcto de errores cuando buscan algo que no existe.
   - **Ejemplo:** `GET /sustentaciones/999` → Status 404 con "no encontrada"

5. **✅ Debe devolver 404 para ID no numérico**
   - **Qué prueba:** Si pones letras en vez de número (`/sustentaciones/abc`), devuelve 404.
   - **Por qué importa:** Protección contra URLs mal formadas.
   - **Ejemplo:** `GET /sustentaciones/abc` → Status 404

---

##### **⭐ `GET /sustentaciones/destacadas` - 3 tests**

**¿Qué hace esta ruta?**  
Muestra solo las sustentaciones marcadas como destacadas.

**Tests:**

1. **✅ Debe devolver status 200**
   - **Qué prueba:** La ruta `/sustentaciones/destacadas` responde correctamente.
   - **Por qué importa:** La página de destacadas funciona.
   - **Ejemplo:** `GET /sustentaciones/destacadas` → Status 200

2. **✅ Debe mostrar solo sustentaciones destacadas**
   - **Qué prueba:** Solo aparecen TEST_GROUP_2 y LANNISTER (las destacadas), NO aparece TEST_GROUP_1.
   - **Por qué importa:** Verifica que el filtro funciona correctamente.
   - **Ejemplo:** HTML contiene "TEST_GROUP_2" y "LANNISTER", pero NO "TEST_GROUP_1"

3. **✅ Debe renderizar template destacadas.ejs**
   - **Qué prueba:** Usa el template correcto (destacadas.ejs).
   - **Por qué importa:** Asegura que no usa el template equivocado.
   - **Ejemplo:** El HTML contiene elementos específicos del template destacadas

---

##### **📝 `GET /sustentaciones/registro` - 3 tests**

**¿Qué hace esta ruta?**  
Muestra el formulario para registrar una nueva sustentación.

**Tests:**

1. **✅ Debe devolver status 200**
   - **Qué prueba:** La página del formulario carga correctamente.
   - **Por qué importa:** El formulario es accesible.
   - **Ejemplo:** `GET /sustentaciones/registro` → Status 200

2. **✅ Debe renderizar el formulario de registro**
   - **Qué prueba:** El HTML contiene todos los campos del form: nombreGrupo, integrantes, materia, descripcion, imagen.
   - **Por qué importa:** Asegura que el formulario tiene todos los campos necesarios.
   - **Ejemplo:** HTML contiene inputs para nombreGrupo, integrantes, materia, descripcion, imagen

3. **✅ Debe tener campo para destacada**
   - **Qué prueba:** El formulario incluye el checkbox/campo "destacada".
   - **Por qué importa:** Permite marcar sustentaciones como destacadas desde el registro.
   - **Ejemplo:** HTML contiene campo "destacada"

---

##### **🔎 `POST /sustentaciones/search` - 6 tests**

**¿Qué hace esta ruta?**  
Busca sustentaciones según el texto ingresado.

**Tests:**

1. **✅ Debe devolver status 200**
   - **Qué prueba:** La búsqueda responde correctamente.
   - **Por qué importa:** La funcionalidad de búsqueda está disponible.
   - **Ejemplo:** `POST /sustentaciones/search` con query="LANNISTER" → Status 200

2. **✅ Debe buscar por nombre de grupo**
   - **Qué prueba:** Buscar "LANNISTER" devuelve solo esa sustentación.
   - **Por qué importa:** La búsqueda por nombre funciona.
   - **Ejemplo:** Buscar "LANNISTER" → Solo aparece LANNISTER, no TEST_GROUP_1

3. **✅ Debe buscar case-insensitive**
   - **Qué prueba:** Buscar "lannister" (minúsculas) encuentra "LANNISTER" (mayúsculas).
   - **Por qué importa:** Los usuarios escriben de diferentes formas.
   - **Ejemplo:** Buscar "lannister" → Encuentra "LANNISTER"

4. **✅ Debe buscar por materia**
   - **Qué prueba:** Buscar "Test Subject" devuelve las 3 sustentaciones (todas tienen esa materia).
   - **Por qué importa:** Permite filtrar por materia.
   - **Ejemplo:** Buscar "Test Subject" → Devuelve las 3 sustentaciones

5. **✅ Debe devolver vista vacía si no hay resultados**
   - **Qué prueba:** Buscar "TEXTO_INEXISTENTE" devuelve Status 200 pero sin resultados.
   - **Por qué importa:** No crashea cuando no hay coincidencias, muestra página vacía.
   - **Ejemplo:** Buscar "XYZABC" → Status 200, sin resultados

6. **✅ Debe manejar búsqueda vacía devolviendo todas las sustentaciones**
   - **Qué prueba:** Si el campo de búsqueda está vacío, muestra todas las sustentaciones.
   - **Por qué importa:** Comportamiento esperado (buscar nada = mostrar todo).
   - **Ejemplo:** Buscar "" → Devuelve las 3 sustentaciones

---

##### **➕ `POST /sustentaciones` - 5 tests**

**¿Qué hace esta ruta?**  
Crea una nueva sustentación con los datos del formulario (incluyendo imagen).

**Tests:**

1. **✅ Debe devolver 400 si no se envía imagen**
   - **Qué prueba:** Si envías el formulario sin imagen, devuelve error 400.
   - **Por qué importa:** La imagen es obligatoria según tu lógica de negocio.
   - **Ejemplo:** POST sin imagen → Status 400 con mensaje "Por favor seleccione una imagen"

2. **✅ Debe crear sustentación con imagen válida**
   - **Qué prueba:** Enviar formulario completo con imagen válida devuelve redirect (302) a `/sustentaciones`.
   - **Por qué importa:** La funcionalidad principal de crear sustentaciones funciona.
   - **Ejemplo:** POST con todos los datos + imagen → Status 302 (redirect) a `/sustentaciones`

3. **✅ Debe persistir la nueva sustentación en el archivo**
   - **Qué prueba:** Después de crear, el archivo `jest.json` tiene 4 sustentaciones (3 iniciales + 1 nueva).
   - **Por qué importa:** Los datos SÍ se guardan en el archivo JSON.
   - **Ejemplo:** Crear sustentación → Leer archivo → Ahora hay 4 sustentaciones

4. **✅ Debe generar ID autoincrementable**
   - **Qué prueba:** La nueva sustentación recibe ID 4 (porque el máximo era 3).
   - **Por qué importa:** Los IDs son únicos y secuenciales.
   - **Ejemplo:** Crear sustentación → Nuevo ID es 4

5. **✅ Debe rechazar archivos que no sean imágenes**
   - **Qué prueba:** Si intentas subir un archivo .txt o .md en vez de imagen, devuelve error 500.
   - **Por qué importa:** Protección contra uploads incorrectos (validación de Multer).
   - **Ejemplo:** POST con README.md como "imagen" → Status 500 (error de Multer)

---

**Total:** 28 tests ✅

---

## 🎯 Resumen Global

- **Pruebas Unitarias:** 26 tests ✅
- **Pruebas E2E:** 28 tests ✅
- **TOTAL:** **54 tests ✅**

## 🚀 Comandos

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas con cobertura
npm run test-c

# Ejecutar pruebas en modo verbose
npm run test-v

# Ejecutar pruebas de un archivo específico
npm test -- SustentacionModel.test.ts
```

## 📊 Cobertura de Código

**Objetivo:** ≥ 80%

**Actual (Total):**
- Statements: 84.16% ✅
- Branches: 65.21% ⚠️ (no alcanza 80%)
- Functions: 87.5% ✅
- Lines: 83.76% ✅

**Por archivo:**

| Archivo | Statements | Branches | Functions | Lines |
|---------|-----------|----------|-----------|-------|
| `SustentacionModel.ts` | 92.3% ✅ | 81.25% ✅ | 100% ✅ | 91.66% ✅ |
| `SustentacionRouter.ts` | 77.77% | 50% ⚠️ | 60% | 77.77% |
| `SustentacionView.ts` | 81.48% ✅ | 57.69% ⚠️ | 87.5% ✅ | 81.48% ✅ |

**Nota:** El Model tiene cobertura excelente (100% funciones). El Router y View tienen menor cobertura en "branches" porque algunas rutas de error no se prueban exhaustivamente.

## 🗄️ Datos de Prueba

Las pruebas utilizan `database/jest.json` como archivo de datos de prueba.

**Ventajas:**
- ✅ No contamina `GrupoSustentacion.json` (BD de producción)
- ✅ Datos resetean automáticamente antes de cada test
- ✅ Predecible y reproducible

## 🛠️ Configuración

**Archivo:** `jest.config.js` (raíz del proyecto)

```javascript
roots: ['<rootDir>/test']       // Buscar tests solo en carpeta test/
testMatch: ['**/test/**/*.test.ts']
```

## 📝 Convenciones

1. **Nombres de archivos:** `NombreClase.test.ts`
2. **Ubicación:** 
   - Unit tests → `test/unit/`
   - E2E tests → `test/e2e/`
3. **Estructura describe:**
   ```typescript
   describe('NombreClase', () => {
     describe('nombreMetodo()', () => {
       test('debe hacer X cuando Y', () => {
         // ...
       })
     })
   })
   ```

## ✅ Estado Actual

- [x] Configuración Jest ✅
- [x] Pruebas unitarias SustentacionModel (26/26) ✅
- [x] Pruebas E2E SustentacionRouter (28/28) ✅
- [x] **54 tests totales pasando** ✅
- [ ] Pruebas de integración (opcional)
