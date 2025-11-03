import { Request, Response } from 'express'

export default class HomeView {
  readonly getHome = (_req: Request, res: Response) => {
    res.status(200).render('home', { currentPage: 'home' })
  }
}
