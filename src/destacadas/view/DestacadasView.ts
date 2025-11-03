import { Request, Response } from 'express'
import SustentacionModel from '../../sustentacion/model/SustentacionModel'

export default class DestacadasView {
  constructor(private readonly sustentacionModel: SustentacionModel) {}

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
}
