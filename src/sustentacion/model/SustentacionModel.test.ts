import SustentacionModel from './SustentacionModel'
import Sustentacion from '../types/Sustentacion'
import fs from 'fs'
import path from 'path'

describe('SustentacionModel - Pruebas Unitarias', () => {
  const testDbPath = path.join(__dirname, '../../../database/jest.json')
  let model: SustentacionModel

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

  // Resetear archivo jest.json antes de cada test
  beforeEach(() => {
    fs.writeFileSync(testDbPath, JSON.stringify(initialData, null, 2), 'utf-8')
    model = new SustentacionModel(testDbPath)
  })

  // Limpiar después de todos los tests (opcional)
  afterAll(() => {
    // Restaurar estado inicial del archivo
    fs.writeFileSync(testDbPath, JSON.stringify(initialData, null, 2), 'utf-8')
  })

  describe('fetchSustentaciones()', () => {
    test('debe devolver un array de sustentaciones', async () => {
      const result = await model.fetchSustentaciones()

      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(3)
    })

    test('debe devolver sustentaciones con la estructura correcta', async () => {
      const result = await model.fetchSustentaciones()
      const firstSustentacion = result[0]

      expect(firstSustentacion).toHaveProperty('id')
      expect(firstSustentacion).toHaveProperty('imagen')
      expect(firstSustentacion).toHaveProperty('nombreGrupo')
      expect(firstSustentacion).toHaveProperty('integrantes')
      expect(firstSustentacion).toHaveProperty('materia')
      expect(firstSustentacion).toHaveProperty('descripcion')
      expect(firstSustentacion).toHaveProperty('contenido')
      expect(firstSustentacion).toHaveProperty('destacada')
    })

    test('debe lanzar error si el archivo no existe', async () => {
      const invalidModel = new SustentacionModel('/path/inexistente.json')

      await expect(invalidModel.fetchSustentaciones()).rejects.toThrow('Archivo de sustentaciones no encontrado')
    })
  })

  describe('fetchSustentacionById()', () => {
    test('debe devolver la sustentación con ID 1', async () => {
      const result = await model.fetchSustentacionById(1)

      expect(result).toBeDefined()
      expect(result?.id).toBe(1)
      expect(result?.nombreGrupo).toBe('TEST_GROUP_1')
    })

    test('debe devolver la sustentación con ID 2', async () => {
      const result = await model.fetchSustentacionById(2)

      expect(result).toBeDefined()
      expect(result?.id).toBe(2)
      expect(result?.nombreGrupo).toBe('TEST_GROUP_2')
      expect(result?.destacada).toBe(true)
    })

    test('debe devolver null si el ID no existe', async () => {
      const result = await model.fetchSustentacionById(999)

      expect(result).toBeNull()
    })

    test('debe devolver null para ID negativo', async () => {
      const result = await model.fetchSustentacionById(-1)

      expect(result).toBeNull()
    })

    test('debe devolver null para ID 0', async () => {
      const result = await model.fetchSustentacionById(0)

      expect(result).toBeNull()
    })
  })

  describe('fetchDestacadas()', () => {
    test('debe devolver solo sustentaciones destacadas', async () => {
      const result = await model.fetchDestacadas()

      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(2)
    })

    test('todas las sustentaciones devueltas deben tener destacada=true', async () => {
      const result = await model.fetchDestacadas()

      result.forEach(sustentacion => {
        expect(sustentacion.destacada).toBe(true)
      })
    })

    test('debe incluir sustentaciones con IDs 2 y 3', async () => {
      const result = await model.fetchDestacadas()
      const ids = result.map(s => s.id)

      expect(ids).toContain(2)
      expect(ids).toContain(3)
      expect(ids).not.toContain(1)
    })

    test('debe devolver array vacío si no hay destacadas', async () => {
      // Modificar todas para que NO sean destacadas
      const allNonDestacadas = initialData.map(s => ({ ...s, destacada: false }))
      fs.writeFileSync(testDbPath, JSON.stringify(allNonDestacadas, null, 2), 'utf-8')

      const result = await model.fetchDestacadas()

      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(0)
    })
  })

  describe('searchSustentaciones()', () => {
    test('debe buscar por nombre de grupo (LANNISTER)', async () => {
      const result = await model.searchSustentaciones('LANNISTER')

      expect(result).toBeDefined()
      expect(result.length).toBe(1)
      expect(result[0]?.nombreGrupo).toBe('LANNISTER')
    })

    test('debe buscar case-insensitive (lannister en minúsculas)', async () => {
      const result = await model.searchSustentaciones('lannister')

      expect(result.length).toBe(1)
      expect(result[0]?.nombreGrupo).toBe('LANNISTER')
    })

    test('debe buscar por materia', async () => {
      const result = await model.searchSustentaciones('Test Subject')

      expect(result.length).toBe(3)
    })

    test('debe buscar por nombre de integrante', async () => {
      const result = await model.searchSustentaciones('Estudiante Uno')

      expect(result.length).toBe(1)
      expect(result[0]?.nombreGrupo).toBe('TEST_GROUP_1')
    })

    test('debe buscar por contenido', async () => {
      const result = await model.searchSustentaciones('Contenido de prueba 2')

      expect(result.length).toBe(1)
      expect(result[0]?.id).toBe(2)
    })

    test('debe devolver array vacío si no hay coincidencias', async () => {
      const result = await model.searchSustentaciones('TEXTO_QUE_NO_EXISTE')

      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(0)
    })

    test('debe ignorar espacios en blanco al inicio y final', async () => {
      const result = await model.searchSustentaciones('  LANNISTER  ')

      expect(result.length).toBe(1)
    })

    test('debe devolver todas las sustentaciones si la búsqueda está vacía', async () => {
      const result = await model.searchSustentaciones('')

      expect(result.length).toBe(3)
    })
  })

  describe('crearSustentacion()', () => {
    test('debe crear una nueva sustentación', async () => {
      const nuevaSustentacion: Omit<Sustentacion, 'id'> = {
        imagen: 'nueva.jpeg',
        nombreGrupo: 'NUEVO_GRUPO',
        integrantes: ['Nuevo Estudiante'],
        materia: 'Nueva Materia',
        descripcion: 'Nueva descripción',
        contenido: 'Nuevo contenido',
        destacada: false
      }

      const result = await model.crearSustentacion(nuevaSustentacion)

      expect(result).toBeDefined()
      expect(result.id).toBe(4) // El máximo ID era 3, así que el nuevo es 4
      expect(result.nombreGrupo).toBe('NUEVO_GRUPO')
    })

    test('debe generar ID autoincrementable correctamente', async () => {
      const primera: Omit<Sustentacion, 'id'> = {
        imagen: 'test.jpeg',
        nombreGrupo: 'GRUPO_A',
        integrantes: ['A'],
        materia: 'Materia A',
        descripcion: 'Desc A',
        contenido: 'Cont A',
        destacada: false
      }

      const segunda: Omit<Sustentacion, 'id'> = {
        imagen: 'test.jpeg',
        nombreGrupo: 'GRUPO_B',
        integrantes: ['B'],
        materia: 'Materia B',
        descripcion: 'Desc B',
        contenido: 'Cont B',
        destacada: false
      }

      const result1 = await model.crearSustentacion(primera)
      const result2 = await model.crearSustentacion(segunda)

      expect(result1.id).toBe(4)
      expect(result2.id).toBe(5)
    })

    test('debe persistir la sustentación en el archivo JSON', async () => {
      const nuevaSustentacion: Omit<Sustentacion, 'id'> = {
        imagen: 'persistencia.jpeg',
        nombreGrupo: 'PERSISTENCIA',
        integrantes: ['Test'],
        materia: 'Test',
        descripcion: 'Test',
        contenido: 'Test',
        destacada: false
      }

      await model.crearSustentacion(nuevaSustentacion)

      // Leer el archivo directamente
      const fileContent = fs.readFileSync(testDbPath, 'utf-8')
      const data = JSON.parse(fileContent)

      expect(data.length).toBe(4)
      expect(data[3].nombreGrupo).toBe('PERSISTENCIA')
    })

    test('debe crear sustentación destacada correctamente', async () => {
      const nuevaDestacada: Omit<Sustentacion, 'id'> = {
        imagen: 'destacada.jpeg',
        nombreGrupo: 'DESTACADA_NUEVA',
        integrantes: ['Test'],
        materia: 'Test',
        descripcion: 'Test',
        contenido: 'Test',
        destacada: true
      }

      const result = await model.crearSustentacion(nuevaDestacada)

      expect(result.destacada).toBe(true)

      const destacadas = await model.fetchDestacadas()
      expect(destacadas.length).toBe(3) // 2 iniciales + 1 nueva
    })

    test('debe manejar array vacío correctamente', async () => {
      // Crear archivo vacío
      fs.writeFileSync(testDbPath, JSON.stringify([], null, 2), 'utf-8')

      const primera: Omit<Sustentacion, 'id'> = {
        imagen: 'primera.jpeg',
        nombreGrupo: 'PRIMERA',
        integrantes: ['Test'],
        materia: 'Test',
        descripcion: 'Test',
        contenido: 'Test',
        destacada: false
      }

      const result = await model.crearSustentacion(primera)

      expect(result.id).toBe(1) // Primer ID cuando no hay datos
    })

    test('debe preservar todos los campos de la sustentación', async () => {
      const nuevaSustentacion: Omit<Sustentacion, 'id'> = {
        imagen: 'completa.jpeg',
        nombreGrupo: 'COMPLETO',
        integrantes: ['Int1', 'Int2', 'Int3'],
        materia: 'Materia Completa',
        descripcion: 'Descripción completa con texto largo',
        contenido: 'Contenido completo con más información',
        destacada: true
      }

      const result = await model.crearSustentacion(nuevaSustentacion)

      expect(result.imagen).toBe('completa.jpeg')
      expect(result.nombreGrupo).toBe('COMPLETO')
      expect(result.integrantes).toEqual(['Int1', 'Int2', 'Int3'])
      expect(result.materia).toBe('Materia Completa')
      expect(result.descripcion).toBe('Descripción completa con texto largo')
      expect(result.contenido).toBe('Contenido completo con más información')
      expect(result.destacada).toBe(true)
    })
  })
})
