import { Router } from 'express'
import SustentacionView from '../view/SustentacionView'

export default class SustentacionRouter {
  router: Router

  constructor(private readonly sustentacionView: SustentacionView) {
    this.router = Router()
    this.routes()
  }

  readonly routes = () => {
    // Lista de sustentaciones con paginación
    this.router.get('/', this.sustentacionView.getSustentacionLista)
    
    // Búsqueda de sustentaciones
    this.router.post('/search', this.sustentacionView.searchSustentaciones)
    
    // Vista individual de sustentación
    this.router.get('/:id', this.sustentacionView.getSustentacionById)
  }
}
