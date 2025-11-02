import Sustentacion from '../types/Sustentacion'
import sustentaciones from '../../../database/GrupoSustentacion.json'
import fs from 'fs'
import path from 'path'

export default class SustentacionModel {
  private readonly dbPath = path.join(__dirname, '../../../database/GrupoSustentacion.json')

  readonly fetchSustentaciones = async (): Promise<Sustentacion[]> => {
    const data = sustentaciones as Sustentacion[]
    if (!data) {
      throw new Error('No se encontraron sustentaciones')
    }
    return data
  }

  readonly fetchSustentacionById = async (id: number): Promise<Sustentacion | null> => {
    const data = await this.fetchSustentaciones()
    const sustentacion = data.find(s => s.id === id)
    return sustentacion || null
  }

  readonly fetchDestacadas = async (): Promise<Sustentacion[]> => {
    const data = await this.fetchSustentaciones()
    return data.filter(s => s.destacada === true)
  }

  readonly searchSustentaciones = async (query: string): Promise<Sustentacion[]> => {
    const data = await this.fetchSustentaciones()
    const lowerQuery = query.toLowerCase().trim()
    
    return data.filter(s => 
      s.nombreGrupo.toLowerCase().includes(lowerQuery) ||
      s.materia.toLowerCase().includes(lowerQuery) ||
      s.contenido.toLowerCase().includes(lowerQuery) ||
      s.integrantes.some(integrante => integrante.toLowerCase().includes(lowerQuery))
    )
  }

  readonly crearSustentacion = async (nuevaSustentacion: Omit<Sustentacion, 'id'>): Promise<Sustentacion> => {
    try {
      const data = await this.fetchSustentaciones()
      
      // Generar nuevo ID (máximo ID existente + 1)
      const maxId = data.length > 0 ? Math.max(...data.map(s => s.id)) : 0
      const sustentacionConId: Sustentacion = {
        id: maxId + 1,
        ...nuevaSustentacion
      }
      
      // Agregar nueva sustentación al array
      data.push(sustentacionConId)
      
      // Escribir al archivo JSON
      fs.writeFileSync(this.dbPath, JSON.stringify(data, null, 2), 'utf-8')
      
      return sustentacionConId
    } catch (error) {
      throw new Error(`Error al crear sustentación: ${error}`)
    }
  }
}
