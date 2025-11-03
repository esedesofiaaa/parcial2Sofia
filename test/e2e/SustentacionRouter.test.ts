import request from 'supertest'
import express, { Application } from 'express'
import path from 'path'
import fs from 'fs'

import SustentacionRouter from '../../src/sustentacion/router/SustentacionRouter'
import SustentacionView from '../../src/sustentacion/view/SustentacionView'
import SustentacionModel from '../../src/sustentacion/model/SustentacionModel'
import Sustentacion from '../../src/sustentacion/types/Sustentacion'

describe('SustentacionRouter - Pruebas E2E', () => {
  let app: Application
  const testDbPath = path.join(__dirname, '../../database/jest.json')

  // Datos iniciales para resetear antes de cada test
  const initialData: Sustentacion[] = [
    {
      id: 1,
      imagen: 'test1.jpeg',
      nombreGrupo: 'TEST_GROUP_1',
      integrantes: ['Estudiante Uno', 'Estudiante Dos'],
      materia: 'Test Subject',
      descripcion: 'Descripción de prueba 1',
      contenido: 'Contenido de prueba 1',
      destacada: false
    },
    {
      id: 2,
      imagen: 'test2.jpeg',
      nombreGrupo: 'TEST_GROUP_2',
      integrantes: ['Estudiante Tres', 'Estudiante Cuatro'],
      materia: 'Test Subject',
      descripcion: 'Descripción de prueba 2',
      contenido: 'Contenido de prueba 2',
      destacada: true
    },
    {
      id: 3,
      imagen: 'test3.jpeg',
      nombreGrupo: 'LANNISTER',
      integrantes: ['Test Student'],
      materia: 'Test Subject',
      descripcion: 'Descripción de prueba 3',
      contenido: 'Contenido de prueba 3',
      destacada: true
    }
  ]

  // Configurar app de Express antes de cada test
  beforeEach(() => {
    // Resetear archivo de datos
    fs.writeFileSync(testDbPath, JSON.stringify(initialData, null, 2), 'utf-8')

    // Crear instancias con BD de prueba
    const model = new SustentacionModel(testDbPath)
    const view = new SustentacionView(model)
    const router = new SustentacionRouter(view)

    // Configurar Express
    app = express()
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.set('view engine', 'ejs')
    app.set('views', path.join(__dirname, '../../src/template'))
    app.use(express.static(path.join(__dirname, '../../src/public')))
    app.use('/sustentaciones', router.router)
  })

  // Restaurar estado después de todos los tests
  afterAll(() => {
    fs.writeFileSync(testDbPath, JSON.stringify(initialData, null, 2), 'utf-8')
  })

  describe('GET /sustentaciones', () => {
    test('debe devolver status 200', async () => {
      const response = await request(app).get('/sustentaciones')

      expect(response.status).toBe(200)
    })

    test('debe renderizar la vista de lista de sustentaciones', async () => {
      const response = await request(app).get('/sustentaciones')

      expect(response.text).toContain('TEST_GROUP_1')
      expect(response.text).toContain('TEST_GROUP_2')
      expect(response.text).toContain('LANNISTER')
    })

    test('debe soportar paginación (página 1)', async () => {
      const response = await request(app).get('/sustentaciones?page=1')

      expect(response.status).toBe(200)
      expect(response.text).toContain('TEST_GROUP_1')
    })

    test('debe devolver 404 para página inexistente', async () => {
      const response = await request(app).get('/sustentaciones?page=999')

      expect(response.status).toBe(404)
      expect(response.text).toContain('no encontrada')
    })

    test('debe devolver 404 para página negativa', async () => {
      const response = await request(app).get('/sustentaciones?page=-1')

      expect(response.status).toBe(404)
    })

    test('debe mostrar todas las sustentaciones en página 1 si son pocas', async () => {
      const response = await request(app).get('/sustentaciones')

      // Como solo hay 3 sustentaciones y el límite es 6 por página, todas deben aparecer
      expect(response.text).toContain('TEST_GROUP_1')
      expect(response.text).toContain('TEST_GROUP_2')
      expect(response.text).toContain('LANNISTER')
    })
  })

  describe('GET /sustentaciones/:id', () => {
    test('debe devolver status 200 para ID válido', async () => {
      const response = await request(app).get('/sustentaciones/1')

      expect(response.status).toBe(200)
    })

    test('debe renderizar la vista de detalle con datos correctos', async () => {
      const response = await request(app).get('/sustentaciones/1')

      expect(response.text).toContain('TEST_GROUP_1')
      expect(response.text).toContain('Estudiante Uno')
      expect(response.text).toContain('Descripción de prueba 1')
    })

    test('debe mostrar descripción y contenido separados', async () => {
      const response = await request(app).get('/sustentaciones/2')

      expect(response.text).toContain('Descripción de prueba 2')
      expect(response.text).toContain('Contenido de prueba 2')
    })

    test('debe devolver 404 para ID inexistente', async () => {
      const response = await request(app).get('/sustentaciones/999')

      expect(response.status).toBe(404)
      expect(response.text).toContain('no encontrada')
    })

    test('debe devolver 404 para ID no numérico', async () => {
      const response = await request(app).get('/sustentaciones/abc')

      expect(response.status).toBe(404)
    })
  })

  describe('GET /sustentaciones/destacadas', () => {
    test('debe devolver status 200', async () => {
      const response = await request(app).get('/sustentaciones/destacadas')

      expect(response.status).toBe(200)
    })

    test('debe mostrar solo sustentaciones destacadas', async () => {
      const response = await request(app).get('/sustentaciones/destacadas')

      expect(response.text).toContain('TEST_GROUP_2')
      expect(response.text).toContain('LANNISTER')
      expect(response.text).not.toContain('TEST_GROUP_1') // Esta NO es destacada
    })

    test('debe renderizar template destacadas.ejs', async () => {
      const response = await request(app).get('/sustentaciones/destacadas')

      // Verificar que usa el template correcto (puedes buscar un elemento específico del template)
      expect(response.text).toContain('destacadas')
    })
  })

  describe('GET /sustentaciones/registro', () => {
    test('debe devolver status 200', async () => {
      const response = await request(app).get('/sustentaciones/registro')

      expect(response.status).toBe(200)
    })

    test('debe renderizar el formulario de registro', async () => {
      const response = await request(app).get('/sustentaciones/registro')

      expect(response.text).toContain('nombreGrupo')
      expect(response.text).toContain('integrantes')
      expect(response.text).toContain('materia')
      expect(response.text).toContain('descripcion')
      expect(response.text).toContain('imagen')
    })

    test('debe tener campo para destacada', async () => {
      const response = await request(app).get('/sustentaciones/registro')

      expect(response.text).toContain('destacada')
    })
  })

  describe('POST /sustentaciones/search', () => {
    test('debe devolver status 200', async () => {
      const response = await request(app)
        .post('/sustentaciones/search')
        .send({ query: 'LANNISTER' })

      expect(response.status).toBe(200)
    })

    test('debe buscar por nombre de grupo', async () => {
      const response = await request(app)
        .post('/sustentaciones/search')
        .send({ query: 'LANNISTER' })

      expect(response.text).toContain('LANNISTER')
      expect(response.text).not.toContain('TEST_GROUP_1')
    })

    test('debe buscar case-insensitive', async () => {
      const response = await request(app)
        .post('/sustentaciones/search')
        .send({ query: 'lannister' })

      expect(response.text).toContain('LANNISTER')
    })

    test('debe buscar por materia', async () => {
      const response = await request(app)
        .post('/sustentaciones/search')
        .send({ query: 'Test Subject' })

      expect(response.text).toContain('TEST_GROUP_1')
      expect(response.text).toContain('TEST_GROUP_2')
      expect(response.text).toContain('LANNISTER')
    })

    test('debe devolver vista vacía si no hay resultados', async () => {
      const response = await request(app)
        .post('/sustentaciones/search')
        .send({ query: 'TEXTO_INEXISTENTE' })

      expect(response.status).toBe(200)
      // La página debe renderizar pero sin resultados
    })

    test('debe manejar búsqueda vacía devolviendo todas las sustentaciones', async () => {
      const response = await request(app)
        .post('/sustentaciones/search')
        .send({ query: '' })

      expect(response.status).toBe(200)
      expect(response.text).toContain('TEST_GROUP_1')
      expect(response.text).toContain('TEST_GROUP_2')
      expect(response.text).toContain('LANNISTER')
    })
  })

  describe('POST /sustentaciones (crear sustentación)', () => {
    test('debe devolver 400 si no se envía imagen', async () => {
      const response = await request(app)
        .post('/sustentaciones')
        .field('nombreGrupo', 'NUEVO_GRUPO')
        .field('integrantes', 'Nuevo Estudiante')
        .field('materia', 'Nueva Materia')
        .field('descripcion', 'Nueva descripción')
        .field('contenido', 'Nuevo contenido')
        .field('destacada', 'false')

      expect(response.status).toBe(400)
      expect(response.text).toContain('imagen')
    })

    test('debe crear sustentación con imagen válida', async () => {
      const imagePath = path.join(__dirname, '../../src/public/img/test1.jpeg')
      
      // Verificar que la imagen de prueba existe
      if (!fs.existsSync(imagePath)) {
        console.warn('⚠️  Imagen de prueba no existe, se omite test')
        return
      }

      const response = await request(app)
        .post('/sustentaciones')
        .field('nombreGrupo', 'NUEVO_GRUPO')
        .field('integrantes', 'Nuevo Estudiante 1, Nuevo Estudiante 2')
        .field('materia', 'Nueva Materia')
        .field('descripcion', 'Nueva descripción')
        .field('contenido', 'Nuevo contenido')
        .field('destacada', 'false')
        .attach('imagen', imagePath)

      expect(response.status).toBe(302) // Redirect
      expect(response.headers['location']).toBe('/sustentaciones')
    })

    test('debe persistir la nueva sustentación en el archivo', async () => {
      const imagePath = path.join(__dirname, '../../src/public/img/test1.jpeg')
      
      if (!fs.existsSync(imagePath)) {
        console.warn('⚠️  Imagen de prueba no existe, se omite test')
        return
      }

      await request(app)
        .post('/sustentaciones')
        .field('nombreGrupo', 'PERSISTENCIA_TEST')
        .field('integrantes', 'Test 1, Test 2')
        .field('materia', 'Test')
        .field('descripcion', 'Test')
        .field('contenido', 'Test')
        .field('destacada', 'false')
        .attach('imagen', imagePath)

      // Leer el archivo y verificar que se guardó
      const fileContent = fs.readFileSync(testDbPath, 'utf-8')
      const data = JSON.parse(fileContent)

      expect(data.length).toBe(4) // 3 iniciales + 1 nueva
      expect(data[3].nombreGrupo).toBe('PERSISTENCIA_TEST')
    })

    test('debe generar ID autoincrementable', async () => {
      const imagePath = path.join(__dirname, '../../src/public/img/test1.jpeg')
      
      if (!fs.existsSync(imagePath)) {
        console.warn('⚠️  Imagen de prueba no existe, se omite test')
        return
      }

      await request(app)
        .post('/sustentaciones')
        .field('nombreGrupo', 'GRUPO_ID_TEST')
        .field('integrantes', 'Test')
        .field('materia', 'Test')
        .field('descripcion', 'Test')
        .field('contenido', 'Test')
        .field('destacada', 'false')
        .attach('imagen', imagePath)

      const fileContent = fs.readFileSync(testDbPath, 'utf-8')
      const data = JSON.parse(fileContent)

      expect(data[3].id).toBe(4) // El ID más alto era 3, el nuevo debe ser 4
    })

    test('debe rechazar archivos que no sean imágenes', async () => {
      const txtPath = path.join(__dirname, '../../test/README.md')

      const response = await request(app)
        .post('/sustentaciones')
        .field('nombreGrupo', 'TEST')
        .field('integrantes', 'Test')
        .field('materia', 'Test')
        .field('descripcion', 'Test')
        .field('contenido', 'Test')
        .field('destacada', 'false')
        .attach('imagen', txtPath)

      expect(response.status).toBe(500)
    })
  })
})
