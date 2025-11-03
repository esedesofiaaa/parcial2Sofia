# 📚 Proyecto Sustentaciones - Patrón MVT

> **Sistema de Gestión de Sustentaciones Académicas** desarrollado con Node.js, Express y TypeScript aplicando el patrón arquitectónico **Model-View-Template (MVT)**.

---

## 📋 Tabla de Contenidos

1. [¿Qué es el Patrón MVT?](#-qué-es-el-patrón-mvt)
2. [Arquitectura del Proyecto](#-arquitectura-del-proyecto)
3. [Componentes MVT Explicados](#-componentes-mvt-explicados)
4. [Flujo de Datos](#-flujo-de-datos)
5. [Casos de Uso](#-casos-de-uso)
6. [Ventajas del Patrón MVT](#-ventajas-del-patrón-mvt)
7. [Testing](#-testing)
8. [Instalación y Uso](#-instalación-y-uso)

---

## 🎯 ¿Qué es el Patrón MVT?

El patrón **Model-View-Template (MVT)** es una arquitectura de software que **separa las responsabilidades** de una aplicación en tres componentes principales:

### **M - Model (Modelo)**
- **Responsabilidad:** Gestionar los **datos** y la **lógica de negocio** relacionada con la base de datos.
- **Qué hace:** Leer, escribir, buscar y manipular datos.
- **Analogía:** Es el "almacén" donde guardas y recuperas información.

### **V - View (Vista)**
- **Responsabilidad:** Manejar la **lógica de presentación** y coordinar entre el Router y el Model.
- **Qué hace:** Procesar peticiones, llamar al Model para obtener datos, y decidir qué Template renderizar.
- **Analogía:** Es el "gerente" que toma decisiones sobre qué mostrar.

### **T - Template (Plantilla)**
- **Responsabilidad:** Definir **cómo se ve** la página HTML.
- **Qué hace:** Renderizar datos en formato HTML para el usuario.
- **Analogía:** Es el "diseñador" que presenta la información de forma visual.

### **Router (Extra)**
- Aunque no es parte oficial de MVT, en Express necesitamos un **Router** que maneje las rutas HTTP.
- **Responsabilidad:** Recibir peticiones HTTP y delegar a la View correspondiente.

---

## 🏗️ Arquitectura del Proyecto

```
src/
└── sustentacion/                    # Módulo Sustentacion (todo en uno)
    ├── model/
    │   └── SustentacionModel.ts     # 📦 MODEL - Acceso a datos
    ├── view/
    │   └── SustentacionView.ts      # 🎯 VIEW - Lógica de negocio
    ├── router/
    │   └── SustentacionRouter.ts    # 🛣️ ROUTER - Rutas HTTP
    └── types/
        └── Sustentacion.ts          # 📝 Interface TypeScript

template/
├── products.ejs                      # 🎨 TEMPLATE - Lista
├── user.ejs                          # 🎨 TEMPLATE - Detalle
├── destacadas.ejs                    # 🎨 TEMPLATE - Destacadas
└── register.ejs                      # 🎨 TEMPLATE - Formulario

database/
└── GrupoSustentacion.json            # 💾 Base de datos (JSON)
```

### **Decisión Arquitectónica Importante**

❓ **¿Por qué un solo módulo "Sustentacion"?**

En este proyecto, aunque hay múltiples templates (lista, detalle, destacadas, registro), **todos comparten el mismo modelo de datos (Sustentacion)**. Por lo tanto:

- ✅ **Opción A (implementada):** Un solo módulo `sustentacion/` con un Model, una View y un Router que maneja todas las rutas.
- ❌ **Opción B (descartada):** Módulos separados (Registro, Destacadas) duplicarían código innecesariamente.

**Conclusión:** Seguimos el principio **DRY (Don't Repeat Yourself)** - reutilizamos el mismo Model para todas las operaciones relacionadas con sustentaciones.

---

## 🔍 Componentes MVT Explicados

### **1️⃣ Model - `SustentacionModel.ts`**

**Pregunta clave:** *"¿Qué hace el Model?"*  
**Respuesta:** Maneja **TODA** la interacción con la base de datos (archivo JSON).

#### **Métodos Principales:**

```typescript
class SustentacionModel {
  private dbPath: string

  constructor(dbPath?: string) {
    // Permite inyectar ruta para testing
    this.dbPath = dbPath || path.join(__dirname, '../../../database/GrupoSustentacion.json')
  }

  // 1️⃣ Obtener TODAS las sustentaciones
  fetchSustentaciones(): Sustentacion[] {
    const data = fs.readFileSync(this.dbPath, 'utf-8')
    return JSON.parse(data)
  }

  // 2️⃣ Obtener UNA sustentación por ID
  fetchSustentacionById(id: number): Sustentacion | null {
    const sustentaciones = this.fetchSustentaciones()
    return sustentaciones.find(s => s.id === id) || null
  }

  // 3️⃣ Filtrar solo las DESTACADAS
  fetchDestacadas(): Sustentacion[] {
    return this.fetchSustentaciones().filter(s => s.destacada)
  }

  // 4️⃣ Buscar por texto (nombre, materia, integrantes, contenido)
  searchSustentaciones(query: string): Sustentacion[] {
    const q = query.trim().toLowerCase()
    if (!q) return this.fetchSustentaciones()
    
    return this.fetchSustentaciones().filter(s => 
      s.nombreGrupo.toLowerCase().includes(q) ||
      s.materia.toLowerCase().includes(q) ||
      s.integrantes.some(i => i.toLowerCase().includes(q)) ||
      s.contenido.toLowerCase().includes(q)
    )
  }

  // 5️⃣ Crear nueva sustentación
  crearSustentacion(nuevaSustentacion: Omit<Sustentacion, 'id'>): Sustentacion {
    const sustentaciones = this.fetchSustentaciones()
    
    // Generar ID autoincrementable
    const maxId = sustentaciones.length > 0 
      ? Math.max(...sustentaciones.map(s => s.id)) 
      : 0
    
    const sustentacion: Sustentacion = {
      id: maxId + 1,
      ...nuevaSustentacion
    }
    
    sustentaciones.push(sustentacion)
    fs.writeFileSync(this.dbPath, JSON.stringify(sustentaciones, null, 2))
    
    return sustentacion
  }
}
```

#### **Características Clave:**

✅ **Inyección de Dependencias:** El constructor acepta `dbPath` opcional para testing.  
✅ **Separación de Responsabilidades:** SOLO maneja datos, NO sabe nada de HTTP ni HTML.  
✅ **Reutilizable:** Todos los métodos pueden usarse desde cualquier View.  
✅ **Sin lógica de negocio:** No decide qué mostrar, solo provee datos.

---

### **2️⃣ View - `SustentacionView.ts`**

**Pregunta clave:** *"¿Qué hace la View?"*  
**Respuesta:** Coordina entre el **Router** (peticiones HTTP) y el **Model** (datos), y decide qué **Template** renderizar.

#### **Métodos Principales:**

```typescript
class SustentacionView {
  private model: SustentacionModel

  constructor(model: SustentacionModel) {
    this.model = model
  }

  // 1️⃣ Lista con paginación
  getSustentacionLista(req: Request, res: Response): void {
    const page = parseInt(req.query.page as string) || 1
    const limit = 6
    
    const sustentaciones = this.model.fetchSustentaciones()
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const paginatedData = sustentaciones.slice(startIndex, endIndex)
    
    if (page < 1 || (page > 1 && paginatedData.length === 0)) {
      res.status(404).render('error', { 
        message: 'Página no encontrada' 
      })
      return
    }
    
    res.render('products', { 
      sustentaciones: paginatedData,
      currentPage: page,
      totalPages: Math.ceil(sustentaciones.length / limit)
    })
  }

  // 2️⃣ Detalle de una sustentación
  getSustentacionById(req: Request, res: Response): void {
    const id = parseInt(req.params.id)
    
    if (isNaN(id)) {
      res.status(404).render('error', { 
        message: 'Sustentación no encontrada' 
      })
      return
    }
    
    const sustentacion = this.model.fetchSustentacionById(id)
    
    if (!sustentacion) {
      res.status(404).render('error', { 
        message: 'Sustentación no encontrada' 
      })
      return
    }
    
    res.render('user', { sustentacion })
  }

  // 3️⃣ Sustentaciones destacadas
  getDestacadas(req: Request, res: Response): void {
    const destacadas = this.model.fetchDestacadas()
    res.render('destacadas', { sustentaciones: destacadas })
  }

  // 4️⃣ Formulario de registro
  getRegistroForm(req: Request, res: Response): void {
    res.render('register')
  }

  // 5️⃣ Búsqueda
  searchSustentaciones(req: Request, res: Response): void {
    const query = req.body.query || ''
    const resultados = this.model.searchSustentaciones(query)
    res.render('products', { 
      sustentaciones: resultados,
      searchQuery: query
    })
  }

  // 6️⃣ Crear sustentación (POST)
  postCrearSustentacion(req: Request, res: Response): void {
    if (!req.file) {
      res.status(400).send('Por favor seleccione una imagen')
      return
    }
    
    const integrantes = req.body.integrantes
      .split(',')
      .map((i: string) => i.trim())
    
    const nuevaSustentacion = {
      imagen: req.file.filename,
      nombreGrupo: req.body.nombreGrupo,
      integrantes,
      materia: req.body.materia,
      descripcion: req.body.descripcion,
      contenido: req.body.contenido,
      destacada: req.body.destacada === 'on'
    }
    
    this.model.crearSustentacion(nuevaSustentacion)
    res.redirect('/sustentaciones')
  }
}
```

#### **Características Clave:**

✅ **Lógica de Presentación:** Decide qué template usar según el caso.  
✅ **Validación:** Verifica que los datos sean correctos (ej: ID numérico).  
✅ **Paginación:** Calcula qué sustentaciones mostrar según la página.  
✅ **Manejo de Errores:** Renderiza página 404 cuando algo falla.  
✅ **Transformación de Datos:** Convierte `integrantes` de string a array.

---

### **3️⃣ Router - `SustentacionRouter.ts`**

**Pregunta clave:** *"¿Qué hace el Router?"*  
**Respuesta:** Define las **rutas HTTP** y delega el trabajo a la **View**.

#### **Configuración de Rutas:**

```typescript
class SustentacionRouter {
  public router: Router
  private view: SustentacionView

  constructor(view: SustentacionView) {
    this.router = Router()
    this.view = view
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    // ⚠️ ORDEN IMPORTANTE: Rutas específicas ANTES de rutas paramétricas
    
    // 1️⃣ Formulario de registro
    this.router.get('/registro', (req, res) => 
      this.view.getRegistroForm(req, res)
    )
    
    // 2️⃣ Sustentaciones destacadas
    this.router.get('/destacadas', (req, res) => 
      this.view.getDestacadas(req, res)
    )
    
    // 3️⃣ Búsqueda (POST)
    this.router.post('/search', (req, res) => 
      this.view.searchSustentaciones(req, res)
    )
    
    // 4️⃣ Crear sustentación (POST con Multer)
    this.router.post('/', upload.single('imagen'), (req, res) => 
      this.view.postCrearSustentacion(req, res)
    )
    
    // 5️⃣ Detalle de sustentación (paramétrica)
    this.router.get('/:id', (req, res) => 
      this.view.getSustentacionById(req, res)
    )
    
    // 6️⃣ Lista de sustentaciones (debe ir al final)
    this.router.get('/', (req, res) => 
      this.view.getSustentacionLista(req, res)
    )
  }
}
```

#### **Configuración de Multer (subida de imágenes):**

```typescript
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../public/img/'))
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)
    
    if (extname && mimetype) {
      cb(null, true)
    } else {
      cb(new Error('Solo se permiten imágenes'))
    }
  }
})
```

#### **Características Clave:**

✅ **Orden de Rutas:** Las rutas específicas (`/registro`, `/destacadas`) van ANTES que las paramétricas (`/:id`).  
✅ **Delegación:** NO procesa lógica, solo llama a la View.  
✅ **Middleware Multer:** Maneja la subida de archivos antes de llegar a la View.  
✅ **Verbos HTTP:** GET para consultas, POST para crear.

---

### **4️⃣ Templates - EJS**

**Pregunta clave:** *"¿Qué hacen los Templates?"*  
**Respuesta:** Renderizan los **datos en HTML** para mostrar al usuario.

#### **Ejemplo: `products.ejs` (Lista)**

```ejs
<div class="row">
  <% sustentaciones.forEach(sustentacion => { %>
    <div class="col-md-4 mb-4">
      <div class="card">
        <img src="/img/<%= sustentacion.imagen %>" class="card-img-top">
        <div class="card-body">
          <h5><%= sustentacion.nombreGrupo %></h5>
          <p><%= sustentacion.materia %></p>
          <a href="/sustentaciones/<%= sustentacion.id %>" class="btn btn-primary">
            Ver Detalle
          </a>
        </div>
      </div>
    </div>
  <% }) %>
</div>
```

#### **Ejemplo: `user.ejs` (Detalle)**

```ejs
<h1><%= sustentacion.nombreGrupo %></h1>
<img src="/img/<%= sustentacion.imagen %>" class="img-fluid">

<h3>Integrantes:</h3>
<ul>
  <% sustentacion.integrantes.forEach(integrante => { %>
    <li><%= integrante %></li>
  <% }) %>
</ul>

<h3>Descripción:</h3>
<p><%= sustentacion.descripcion %></p>

<h3>Preguntas Docentes:</h3>
<p><%= sustentacion.contenido %></p>
```

#### **Características Clave:**

✅ **Sin Lógica Compleja:** Solo loops y condicionales simples.  
✅ **Datos desde View:** Reciben variables desde `res.render()`.  
✅ **Reutilizables:** Pueden incluirse entre sí (`<%- include('menu') %>`).

---

## 🔄 Flujo de Datos

### **Caso 1: Ver lista de sustentaciones**

```
1. Usuario → Navegador → GET /sustentaciones
                              ↓
2. Router → Recibe petición en ruta GET /
                              ↓
3. Router → Llama a view.getSustentacionLista(req, res)
                              ↓
4. View → Llama a model.fetchSustentaciones()
                              ↓
5. Model → Lee database/GrupoSustentacion.json
                              ↓
6. Model → Devuelve array de Sustentacion[]
                              ↓
7. View → Aplica paginación (6 por página)
                              ↓
8. View → Renderiza template products.ejs con datos
                              ↓
9. Template → Genera HTML con las sustentaciones
                              ↓
10. Usuario ← Navegador ← HTML renderizado
```

### **Caso 2: Crear nueva sustentación**

```
1. Usuario → Formulario → POST /sustentaciones (con imagen)
                              ↓
2. Router → Multer procesa la imagen
                              ↓
3. Router → Llama a view.postCrearSustentacion(req, res)
                              ↓
4. View → Valida que req.file existe
                              ↓
5. View → Transforma datos (split integrantes)
                              ↓
6. View → Llama a model.crearSustentacion(nuevaSustentacion)
                              ↓
7. Model → Genera ID autoincrementable
                              ↓
8. Model → Guarda en database/GrupoSustentacion.json
                              ↓
9. Model → Devuelve la sustentación creada
                              ↓
10. View → Redirige a /sustentaciones (res.redirect)
                              ↓
11. Usuario ← Navegador ← Redirect a lista actualizada
```

---

## 💡 Casos de Uso

### **1. Ver todas las sustentaciones (con paginación)**
- **Ruta:** `GET /sustentaciones?page=1`
- **Model:** `fetchSustentaciones()`
- **View:** `getSustentacionLista()` - aplica paginación
- **Template:** `products.ejs`

### **2. Ver detalle de una sustentación**
- **Ruta:** `GET /sustentaciones/3`
- **Model:** `fetchSustentacionById(3)`
- **View:** `getSustentacionById()` - valida ID
- **Template:** `user.ejs`

### **3. Ver solo las destacadas**
- **Ruta:** `GET /sustentaciones/destacadas`
- **Model:** `fetchDestacadas()`
- **View:** `getDestacadas()`
- **Template:** `destacadas.ejs`

### **4. Buscar sustentaciones**
- **Ruta:** `POST /sustentaciones/search`
- **Model:** `searchSustentaciones(query)`
- **View:** `searchSustentaciones()` - recibe query del body
- **Template:** `products.ejs` (reutilizado)

### **5. Registrar nueva sustentación**
- **Ruta:** `POST /sustentaciones` (con multipart/form-data)
- **Middleware:** Multer procesa la imagen
- **Model:** `crearSustentacion()`
- **View:** `postCrearSustentacion()` - valida y transforma datos
- **Resultado:** Redirect a `/sustentaciones`

---

## ✅ Ventajas del Patrón MVT

### **1. Separación de Responsabilidades**
- ✅ **Model** solo maneja datos.
- ✅ **View** solo maneja lógica de presentación.
- ✅ **Template** solo maneja HTML.
- ✅ **Router** solo maneja rutas HTTP.

### **2. Reutilización de Código**
- ✅ Un solo Model para todas las operaciones.
- ✅ Templates reutilizables (ej: `products.ejs` para lista y búsqueda).
- ✅ Métodos del Model usables desde cualquier View.

### **3. Testabilidad**
- ✅ Model testeable en aislamiento (26 tests unitarios).
- ✅ Router testeable con Supertest (28 tests E2E).
- ✅ Inyección de dependencias permite usar BD de prueba.

### **4. Mantenibilidad**
- ✅ Si cambias la BD, solo modificas el Model.
- ✅ Si cambias el diseño, solo modificas los Templates.
- ✅ Si cambias las rutas, solo modificas el Router.

### **5. Escalabilidad**
- ✅ Fácil agregar nuevas rutas (solo una línea en Router).
- ✅ Fácil agregar nuevos métodos al Model.
- ✅ Fácil crear nuevos Templates.

---

## 🧪 Testing

El proyecto implementa **54 tests** (26 unitarios + 28 E2E) con Jest y Supertest.

### **Pruebas Unitarias (Model)**
```bash
npm test -- SustentacionModel.test.ts
```

**Cobertura:**
- ✅ `fetchSustentaciones()` - 3 tests
- ✅ `fetchSustentacionById()` - 5 tests
- ✅ `fetchDestacadas()` - 4 tests
- ✅ `searchSustentaciones()` - 8 tests
- ✅ `crearSustentacion()` - 6 tests

### **Pruebas E2E (Router)**
```bash
npm test -- SustentacionRouter.test.ts
```

**Cobertura:**
- ✅ `GET /sustentaciones` - 6 tests
- ✅ `GET /sustentaciones/:id` - 5 tests
- ✅ `GET /sustentaciones/destacadas` - 3 tests
- ✅ `GET /sustentaciones/registro` - 3 tests
- ✅ `POST /sustentaciones/search` - 6 tests
- ✅ `POST /sustentaciones` - 5 tests

**Ver más:** [test/README.md](test/README.md)

---

## 🚀 Instalación y Uso

### **Requisitos**
- Node.js 18+
- npm 9+

### **Instalación**
```bash
# Clonar repositorio
git clone <repo-url>
cd parcial2Sofia

# Instalar dependencias
npm install

# Inicializar proyecto
chmod +x scripts/init.sh
./scripts/init.sh
```

### **Comandos**

```bash
# Desarrollo (hot reload)
npm run dev

# Producción
npm start

# Tests
npm test                # Todos los tests
npm run test-c          # Con cobertura
npm run test-v          # Modo verbose
```

### **URLs**

- **Lista:** http://localhost:1888/sustentaciones
- **Detalle:** http://localhost:1888/sustentaciones/1
- **Destacadas:** http://localhost:1888/sustentaciones/destacadas
- **Registro:** http://localhost:1888/sustentaciones/registro

---

## 📚 Preguntas para la Sustentación

### **Sobre MVT**

**Q: ¿Qué es MVT?**  
**A:** Es un patrón arquitectónico que separa responsabilidades en Model (datos), View (lógica de presentación) y Template (HTML).

**Q: ¿Por qué usaste un solo módulo Sustentacion?**  
**A:** Porque todas las operaciones (registro, destacadas, detalle) comparten el mismo modelo de datos. Seguimos el principio DRY.

**Q: ¿Cuál es la diferencia entre View y Template?**  
**A:** View decide QUÉ mostrar y procesa lógica. Template decide CÓMO mostrarlo (HTML/CSS).

### **Sobre el Model**

**Q: ¿Por qué inyectas dbPath en el constructor?**  
**A:** Para testabilidad. En tests uso `jest.json`, en producción uso `GrupoSustentacion.json`.

**Q: ¿Cómo funciona el ID autoincrementable?**  
**A:** Busco el ID máximo existente y le sumo 1. Si la BD está vacía, el primer ID es 1.

### **Sobre Testing**

**Q: ¿Qué diferencia hay entre tests unitarios y E2E?**  
**A:** Unitarios prueban métodos individuales del Model en aislamiento. E2E simulan peticiones HTTP completas (Router + View + Model + Template).

**Q: ¿Por qué 54 tests?**  
**A:** 26 unitarios (cubren todos los métodos del Model) + 28 E2E (cubren todas las rutas HTTP).

---

## 👨‍💻 Autor

**Sofia** - Universidad Pontificia Bolivariana  
Materia: Desarrollo Web  
Fecha: Noviembre 2025

---

## 📄 Licencia

Este proyecto es de uso académico.
