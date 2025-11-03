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

**Archivo:** `SustentacionModel.test.ts`
- ✅ `fetchSustentaciones()` - 3 tests
- ✅ `fetchSustentacionById()` - 5 tests
- ✅ `fetchDestacadas()` - 4 tests
- ✅ `searchSustentaciones()` - 8 tests
- ✅ `crearSustentacion()` - 6 tests

**Total:** 26 tests ✅

### **2. Pruebas E2E (`test/e2e/`)**
Prueban el comportamiento completo de las rutas HTTP.

**Archivo:** `SustentacionRouter.test.ts` (próximamente)
- ⏳ `GET /sustentaciones` - Lista con paginación
- ⏳ `GET /sustentaciones/destacadas` - Filtro de destacadas
- ⏳ `GET /sustentaciones/registro` - Formulario de registro
- ⏳ `GET /sustentaciones/:id` - Detalle de sustentación
- ⏳ `POST /sustentaciones` - Crear sustentación con imagen
- ⏳ `POST /sustentaciones/search` - Búsqueda

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

**Actual (SustentacionModel):**
- Statements: 92.3% ✅
- Branches: 81.25% ✅
- Functions: 100% ✅
- Lines: 91.66% ✅

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

- [x] Configuración Jest
- [x] Pruebas unitarias SustentacionModel (26/26) ✅
- [ ] Pruebas E2E SustentacionRouter (0/6) ⏳
- [ ] Pruebas de integración (opcional)
