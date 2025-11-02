import { Router } from 'express'
import SustentacionView from '../../sustentacion/view/SustentacionView'

export default class RegistroRouter {
  router: Router

  constructor(private readonly sustentacionView: SustentacionView) {
    this.router = Router()
    this.routes()
  }

  readonly routes = () => {
    // Mostrar formulario de registro
    this.router.get('/', this.sustentacionView.getRegistroForm)
    
    // Procesar formulario de registro
    this.router.post('/', this.sustentacionView.postCrearSustentacion)
  }
}
