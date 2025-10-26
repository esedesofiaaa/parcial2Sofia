import Sustentacion from '../../sustentacion/types/Sustentacion'

export default interface Grupo {
  id: number
  nombreGrupo: string
  curso: string
  integrantes: string[]
  imagen: string
  completado: boolean
  sustentacion: Sustentacion | null
}
