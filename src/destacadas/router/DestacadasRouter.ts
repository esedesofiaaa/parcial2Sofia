import { Router } from 'express'
import DestacadasView from '../view/DestacadasView'

export default class DestacadasRouter {
  router: Router

  constructor(private readonly destacadasView: DestacadasView) {
    this.router = Router()
    this.routes()
  }

  readonly routes = () => {
    this.router.get('/', this.destacadasView.getDestacadas)
  }
}
