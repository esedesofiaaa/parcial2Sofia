import { Request, Response } from 'express'
import SustentacionModel from '../model/SustentacionModel'

export default class SustentacionView {
  constructor(private readonly sustentacionModel: SustentacionModel) {}

  readonly getSustentacionLista = async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query['page'] as string) || 1
      const itemsPerPage = 6
      
      const allSustentaciones = await this.sustentacionModel.fetchSustentaciones()
      
      // Paginación
      const startIndex = (page - 1) * itemsPerPage
      const endIndex = startIndex + itemsPerPage
      const sustentaciones = allSustentaciones.slice(startIndex, endIndex)
      const totalPages = Math.ceil(allSustentaciones.length / itemsPerPage)
      
      res.status(200).render('sustentacionLista', {
        sustentaciones,
        currentPage: page,
        totalPages,
        searchQuery: ''
      })
    } catch (error) {
      res.status(500).render('error', { message: 'Error al cargar sustentaciones' })
    }
  }

  readonly getSustentacionById = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params['id'] as string)
      const sustentacion = await this.sustentacionModel.fetchSustentacionById(id)
      
      if (!sustentacion) {
        return res.status(404).render('error', { message: 'Sustentación no encontrada' })
      }
      
      res.status(200).render('sustentacion', { sustentacion })
    } catch (error) {
      res.status(500).render('error', { message: 'Error al cargar sustentación' })
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
        searchQuery: query
      })
    } catch (error) {
      res.status(500).render('error', { message: 'Error en la búsqueda' })
    }
  }

  readonly getRegistroForm = async (_req: Request, res: Response) => {
    res.status(200).render('registro')
  }

  readonly postCrearSustentacion = async (req: Request, res: Response) => {
    try {
      const { nombreGrupo, integrantes, materia, contenido, imagen, destacada } = req.body
      
      // Convertir integrantes de string a array
      const integrantesArray = typeof integrantes === 'string' 
        ? integrantes.split(',').map(i => i.trim())
        : integrantes
      
      const nuevaSustentacion = {
        imagen: imagen || 'error.png',
        nombreGrupo,
        integrantes: integrantesArray,
        materia,
        contenido,
        destacada: destacada === 'true' || destacada === true
      }
      
      await this.sustentacionModel.crearSustentacion(nuevaSustentacion)
      
      res.redirect('/sustentaciones')
    } catch (error) {
      res.status(500).render('error', { message: 'Error al crear sustentación' })
    }
  }
}
