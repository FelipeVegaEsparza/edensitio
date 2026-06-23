import Database from 'better-sqlite3'
import bcrypt from 'bcryptjs'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DB_PATH = path.join(__dirname, 'db', 'fundacion.db')
const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads')

// Ensure directories exist
if (!fs.existsSync(path.join(__dirname, 'db'))) fs.mkdirSync(path.join(__dirname, 'db'), { recursive: true })
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true })

const db = new Database(DB_PATH)
db.pragma('journal_mode = WAL')

// Schema
db.exec(`
  CREATE TABLE IF NOT EXISTS content (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    section TEXT NOT NULL,
    field TEXT NOT NULL,
    value TEXT NOT NULL DEFAULT '',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    UNIQUE(section, field)
  );

  CREATE TABLE IF NOT EXISTS images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    section TEXT NOT NULL,
    field TEXT NOT NULL,
    filename TEXT NOT NULL,
    alt TEXT DEFAULT '',
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(section, field)
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );
`)

// Default content
const defaults = {
  navbar: {
    logo_text: 'El',
    logo_span: 'Edén',
    donate_text: 'Donar',
  },
  hero: {
    badge: 'Centro de Rehabilitación',
    title: 'Fundación\nEl Edén',
    subtitle: 'Preocupados por rehabilitarte. Una comunidad cristiana de tratamiento y restauración para quienes buscan una nueva oportunidad.',
    stats_years: '15',
    stats_years_label: 'Años de experiencia',
    stats_lives: '500',
    stats_lives_label: 'Vidas transformadas',
    stats_centers: '3',
    stats_centers_label: 'Centros',
  },
  quienes_somos: {
    title: 'Una comunidad comprometida con la restauración',
    text_1: 'La comunidad cristiana para el tratamiento de adicciones Centro de Restauración El Edén se define como un espacio con ambiente comunitario residencial, libre de SPA (estupefacientes), en el que se cuenta con una estructura organizativa de normas y valores propios y el apoyo espiritual y terapéutico de un equipo interdisciplinar que busca, a través de etapas, la abstinencia total o el mejoramiento de la calidad de vida de los usuarios.',
    text_2: 'Creemos en segundas oportunidades. Cada persona que llega a nuestras puertas encuentra un entorno seguro, digno y amoroso para reconstruir su vida.',
    director_title: 'Director General de Tratamiento',
    director_desc: 'Exadicto rehabilitado, profesionalmente capacitado en prevención y rehabilitación de adicciones al alcohol y las drogas.',
    floating_number: '+500',
    floating_label: 'Vidas transformadas',
  },
  servicios: {
    title: 'Programas de rehabilitación',
    desc: 'Contamos con centros especializados para hombres y mujeres, con un enfoque terapéutico integral y espiritual.',
    hombre_title: 'Rehabilitación para Hombres',
    hombre_text: 'Centros enfocados en el tratamiento del daño causado por el flagelo del alcohol y la droga, con un ambiente estructurado y de apoyo mutuo.',
    mujer_title: 'Rehabilitación para Mujeres',
    mujer_text: 'Sabemos que el proceso de rehabilitarse es una decisión importante, por lo que nos preocupamos de dar el mejor entorno que genere tranquilidad y confianza.',
  },
  instalaciones: {
    title: 'Nuestros espacios',
    desc: 'Ambientes diseñados para la recuperación, la paz y la convivencia comunitaria.',
  },
  radio: {
    title: 'Estamos online 24/7',
    text: 'Acompañamos tu proceso de recuperación también a través de nuestra señal radial con contenido edificante.',
    status_text: 'En vivo',
    btn_text: '🎧 Escuchar ahora',
    btn_url: '#',
  },
  testimonios: {
    title: 'Historias de transformación',
    quote: 'El centro tiene un director general de tratamiento, quien es un exadicto rehabilitado. Él mismo lo cuenta como parte de su testimonio de vida y se ha capacitado profesionalmente en prevención y rehabilitación de adicciones al alcohol y las drogas.',
    author_name: 'Director General',
    author_role: 'Exadicto rehabilitado',
  },
  admision: {
    title: 'Requisitos de Admisión',
    text: 'Para iniciar tu proceso de rehabilitación en Fundación El Edén, necesitas cumplir con los siguientes requisitos:',
    req_1: 'Ser mayor de 18 años',
    req_2: 'Asistir a una evaluación inicial presencial',
    req_3: 'Manifestar voluntad de rehabilitación',
    req_4: 'Presentar cédula de identidad vigente',
    req_5: 'No estar bajo proceso judicial activo',
    req_6: 'Firmar carta de compromiso del programa',
    req_7: 'Contar con evaluación médica reciente',
    req_8: 'Aceptar las normas de convivencia del centro',
  },
  donaciones: {
    title: 'Si te interesa aportar a esta causa',
    text: 'Apoya nuestras sucursales para seguir ayudando a personas que realmente necesitan rehabilitar y perseverar en su vida. Te agradecemos cualquier aporte mensual que quieras realizar.',
    amount_1: '5.000',
    label_1: 'Apoyo básico',
    amount_2: '10.000',
    label_2: 'Apoyo mensual',
    amount_3: '25.000',
    label_3: 'Apoyo completo',
  },
  contacto: {
    title: 'Hablemos',
    text: '¿Tienes dudas o quieres más información? Escríbenos y te responderemos a la brevedad.',
    phone: '+56 9 XXXX XXXX',
    email: 'contacto@fundacioneleden.cl',
    address: 'Santiago, Chile',
  },
  footer: {
    brand_text: 'Centro de Rehabilitación comprometido con la restauración integral de personas afectadas por el alcohol y las drogas.',
    copyright: '© 2026 Fundación El Edén. Todos los derechos reservados.',
  },
}

// Insert defaults (skip if already exists)
const insertStmt = db.prepare('INSERT OR IGNORE INTO content (section, field, value) VALUES (?, ?, ?)')
for (const [section, fields] of Object.entries(defaults)) {
  for (const [field, value] of Object.entries(fields)) {
    insertStmt.run(section, field, value)
  }
}

// Create admin user
const adminUser = process.env.ADMIN_USER || 'admin'
const adminPass = process.env.ADMIN_PASS || 'admin123'
const hash = bcrypt.hashSync(adminPass, 10)

const userStmt = db.prepare('INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)')
userStmt.run(adminUser, hash)

db.close()

console.log('✅ Base de datos inicializada correctamente')
console.log(`   Usuario: ${adminUser}`)
console.log(`   Contraseña: ${adminPass}`)
console.log('\n⚠️  CAMBIA LA CONTRASEÑA POR DEFECTO EN PRODUCCIÓN')
