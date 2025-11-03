export default interface Sustentacion {
  id: number
  imagen: string
  nombreGrupo: string
  integrantes: string[]
  materia: string
  contenido: string
  descripcion: string
  destacada?: boolean
}