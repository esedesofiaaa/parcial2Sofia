import express, { Application } from 'express'
import path from 'path'

import SustentacionRouter from './sustentacion/router/SustentacionRouter'
import SustentacionView from './sustentacion/view/SustentacionView'
import SustentacionModel from './sustentacion/model/SustentacionModel'

import HomeRouter from './home/router/HomeRouter'
import HomeView from './home/view/HomeView'

import ErrorRouter from './error/router/ErrorRouter'
import ErrorView from './error/view/ErrorView'

export default class Server {
  private readonly app: Application

  constructor(
    private readonly sustentacionRouter: SustentacionRouter,
    private readonly homeRouter: HomeRouter,
    private readonly errorRouter: ErrorRouter
  ) {
    this.app = express()
    this.configure()
    this.static()
    this.routes()
  }

  private readonly configure = (): void => {
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
    this.app.set('view engine', 'ejs')
    this.app.set('views', path.join(__dirname, './template'))
  }

  private readonly routes = (): void => {
    this.app.use('/home', this.homeRouter.router)
    this.app.use('/sustentaciones', this.sustentacionRouter.router)
    this.app.use('/{*any}', this.errorRouter.router)
  }

  private readonly static = (): void => {
    this.app.use(express.static(path.join(__dirname, './public')))
  }

  readonly start = (): void => {
    const port = 1888
    const host = 'localhost'
    this.app.listen(port, () => {
      console.log(`Server is running on http://${host}:${port}`)
    })
  }
}

const sustentacionModel = new SustentacionModel()
const sustentacionView = new SustentacionView(sustentacionModel)

const server = new Server(
  new SustentacionRouter(sustentacionView),
  new HomeRouter(new HomeView()),
  new ErrorRouter(new ErrorView())
)
server.start()
