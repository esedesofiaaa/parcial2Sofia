import { Router } from 'express'
import SustentacionView from '../view/SustentacionView'
import multer from 'multer'
import path from 'path'

// Configuración de Multer para subida de imágenes
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, '../../public/img'))
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const ext = path.extname(file.originalname)
    const nameWithoutExt = path.basename(file.originalname, ext)
    cb(null, `${nameWithoutExt}-${uniqueSuffix}${ext}`)
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/
    const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mime = allowedTypes.test(file.mimetype)
    if (ext && mime) {
      cb(null, true)
    } else {
      cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, gif, webp)'))
    }
  }
})

export default class SustentacionRouter {
  router: Router

  constructor(private readonly sustentacionView: SustentacionView) {
    this.router = Router()
    this.routes()
  }

  readonly routes = () => {
    // IMPORTANTE: Rutas específicas deben ir ANTES que las paramétricas
    
    // Formulario de registro (GET)
    this.router.get('/registro', this.sustentacionView.getRegistroForm)
    
    // Sustentaciones destacadas (GET)
    this.router.get('/destacadas', this.sustentacionView.getDestacadas)
    
    // Búsqueda de sustentaciones (POST)
    this.router.post('/search', this.sustentacionView.searchSustentaciones)
    
    // Crear nueva sustentación (POST) - con Multer para imágenes
    this.router.post('/', upload.single('imagen'), this.sustentacionView.postCrearSustentacion)
    
    // Vista individual de sustentación (GET) - debe ir después de rutas específicas
    this.router.get('/:id', this.sustentacionView.getSustentacionById)
    
    // Lista de sustentaciones con paginación (GET)
    this.router.get('/', this.sustentacionView.getSustentacionLista)
  }
}
