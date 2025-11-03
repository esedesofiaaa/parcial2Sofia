import { Request, Response } from 'express'
import SustentacionModel from '../model/SustentacionModel'

export default class SustentacionView {
  constructor(private readonly sustentacionModel: SustentacionModel) {}

  readonly getSustentacionLista = async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query['page'] as string) || 1
      const itemsPerPage = 6
      
      const allSustentaciones = await this.sustentacionModel.fetchSustentaciones()
      
      // Calcular total de páginas
      const totalPages = Math.ceil(allSustentaciones.length / itemsPerPage)
      
      // Validar que la página solicitada existe
      if (page < 1 || page > totalPages) {
        return res.status(404).render('error', { 
          message: `Página ${page} no encontrada. Solo hay ${totalPages} página${totalPages !== 1 ? 's' : ''} disponible${totalPages !== 1 ? 's' : ''}.`,
          currentPageName: 'sustentaciones'
        })
      }
      
      // Paginación
      const startIndex = (page - 1) * itemsPerPage
      const endIndex = startIndex + itemsPerPage
      const sustentaciones = allSustentaciones.slice(startIndex, endIndex)
      
      res.status(200).render('sustentacionLista', {
        sustentaciones,
        currentPage: page,
        totalPages,
        searchQuery: '',
        currentPageName: 'sustentaciones'
      })
    } catch (error) {
      res.status(500).render('error', { 
        message: 'Error al cargar sustentaciones',
        currentPageName: 'sustentaciones'
      })
    }
  }

  readonly getSustentacionById = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params['id'] as string)
      const sustentacion = await this.sustentacionModel.fetchSustentacionById(id)
      
      if (!sustentacion) {
        return res.status(404).render('error', { 
          message: 'Sustentación no encontrada',
          currentPageName: 'sustentaciones'
        })
      }
      
      res.status(200).render('sustentacion', { sustentacion, currentPageName: 'sustentaciones' })
    } catch (error) {
      res.status(500).render('error', { 
        message: 'Error al cargar sustentación',
        currentPageName: 'sustentaciones'
      })
    }
  }

  readonly searchSustentaciones = async (req: Request, res: Response) => {
    try {
      const query = req.body.query || ''
      const page = parseInt(req.body.page as string) || 1
      const itemsPerPage = 6
      
      const searchResults = await this.sustentacionModel.searchSustentaciones(query)
      
      // Paginación de resultados
      const startIndex = (page - 1) * itemsPerPage
      const endIndex = startIndex + itemsPerPage
      const sustentaciones = searchResults.slice(startIndex, endIndex)
      const totalPages = Math.ceil(searchResults.length / itemsPerPage)
      
      res.status(200).render('sustentacionLista', {
        sustentaciones,
        currentPage: page,
        totalPages,
        searchQuery: query,
        currentPageName: 'sustentaciones'
      })
    } catch (error) {
      res.status(500).render('error', { 
        message: 'Error en la búsqueda',
        currentPageName: 'sustentaciones'
      })
    }
  }

  readonly getDestacadas = async (_req: Request, res: Response) => {
    try {
      const destacadas = await this.sustentacionModel.fetchDestacadas()
      
      res.status(200).render('destacadas', { destacadas, currentPageName: 'destacadas' })
    } catch (error) {
      res.status(500).render('error', { 
        message: 'Error al cargar sustentaciones destacadas',
        currentPageName: 'destacadas'
      })
    }
  }

  readonly getRegistroForm = async (_req: Request, res: Response) => {
    res.status(200).render('registro', { currentPageName: 'registro' })
  }

  readonly postCrearSustentacion = async (req: Request, res: Response) => {
    try {
      const { nombreGrupo, integrantes, materia, contenido, descripcion, destacada } = req.body
      const file = req.file
      
      // Validar que se haya subido una imagen
      if (!file) {
        return res.status(400).render('error', {
          message: 'Por favor seleccione una imagen para el proyecto',
          currentPageName: 'registro'
        })
      }
      
      // Convertir integrantes de string a array
      const integrantesArray = typeof integrantes === 'string' 
        ? integrantes.split(',').map(i => i.trim())
        : integrantes
      
      const nuevaSustentacion = {
        imagen: file.filename, // Nombre del archivo subido
        nombreGrupo,
        integrantes: integrantesArray,
        materia,
        descripcion: descripcion || '',
        contenido: contenido || '',
        destacada: destacada === 'true' || destacada === true
      }
      
      await this.sustentacionModel.crearSustentacion(nuevaSustentacion)
      
      res.redirect('/sustentaciones')
    } catch (error) {
      res.status(500).render('error', { 
        message: 'Error al crear sustentación',
        currentPageName: 'registro'
      })
    }
  }
}
