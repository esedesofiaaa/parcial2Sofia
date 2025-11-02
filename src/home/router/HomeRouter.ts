import { Router } from 'express'
import HomeView from '../view/HomeView'

export default class HomeRouter {
  router: Router

  constructor(private readonly homeView: HomeView) {
    this.router = Router()
    this.routes()
  }

  readonly routes = () => {
    this.router.get('/', this.homeView.getHome)
  }
}
