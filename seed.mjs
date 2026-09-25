import Database from 'better-sqlite3'
import bcrypt from 'bcryptjs'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'db', 'fundacion.db')
const UPLOADS_DIR = process.env.UPLOADS_DIR || path.join(__dirname, 'public', 'uploads')

// Ensure directories exist
if (!fs.existsSync(path.dirname(DB_PATH))) fs.mkdirSync(path.dirname(DB_PATH), { recursive: true })
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

// Default content (real content migrated from fundacioneleden.cl)
const defaults = {
  navbar: {
    logo_text: 'El',
    logo_span: 'Edén',
    donate_text: 'Donar',
  },
  hero: {
    badge: 'Centro de Rehabilitación',
    title: 'Fundación\nEl Edén',
    subtitle: 'Preocupados por rehabilitarte. Somos una comunidad cristiana de tratamiento y restauración para quienes buscan una nueva oportunidad de vida.',
    stats_years: '25',
    stats_years_label: 'Años de experiencia',
    stats_lives: '500',
    stats_lives_label: 'Vidas transformadas',
    stats_centers: '5',
    stats_centers_label: 'Sucursales',
  },
  quienes_somos: {
    title: 'Quiénes Somos',
    intro: 'La comunidad cristiana para el tratamiento de adicciones Centro de Restauración El Edén se define, entonces, como un espacio con ambiente comunitario residencial, libre de SPA (estupefacientes), en el que se cuenta con una estructura organizativa de normas y valores propios y el apoyo espiritual y terapéutico de un equipo interdisciplinar que busca, a través de etapas, la abstinencia total o el mejoramiento de la calidad de vida de los usuarios.',
    mision_title: 'Misión',
    mision: 'Nuestra misión es el abordaje integral de las adicciones a través de la acción y prevención, el tratamiento y la reducción de daños. Atendemos tanto a las personas con dicha problemática como a sus familias, desde un enfoque espiritual y teoterapéutico, partiendo de la capacidad que tiene la persona para hacerse cargo de su vida y tomar decisiones de forma autónoma; fomentando además un cambio en la percepción social de las adicciones.',
    vision_title: 'Visión',
    vision: 'Nuestra visión es ser una organización de referencia en el ámbito de las adicciones y la exclusión social, trabajando para mejorar y ampliar nuestras intervenciones, tanto en prevención como en rehabilitación, reforzando la reinserción sociolaboral de las personas con problemas de adicción, comprometida y abierta a los cambios sociales.',
    objetivos_title: 'Objetivos',
    objetivos: 'Ser un centro de restauración modelo para la ciudad de Linares y alrededores, que responda a las necesidades espirituales y cognitivo-conductuales de personas y familias necesitadas de apoyo y/o rehabilitación por consumo problemático de alcohol y drogas, de manera integral.',
    director_title: 'Director General de Tratamiento',
    director_desc: 'Exadicto rehabilitado, profesionalmente capacitado en prevención y rehabilitación de adicciones al alcohol y las drogas.',
    floating_number: '+500',
    floating_label: 'Vidas transformadas',
  },
  servicios: {
    title: 'Nuestro Servicio',
    desc: 'Contamos con centros especializados para hombres y mujeres, con un enfoque terapéutico integral y espiritual.',
    rehab_title: 'Rehabilitación',
    rehab_text: 'Por el daño causado por el flagelo del alcohol y la droga.',
    hombre_title: 'Para Hombres',
    hombre_text: 'Tenemos centros enfocados y divididos por género masculino y femenino, con un ambiente estructurado y de apoyo mutuo.',
    mujer_title: 'Para Mujeres',
    mujer_text: 'Sabemos que el proceso de rehabilitarse es una decisión importante, por lo que nos preocupamos de dar el mejor entorno que te genere tranquilidad y confianza.',
    proyecto_title: 'Proyecto Restauración',
    objetivos_title: 'Objetivos del Tratamiento',
    objetivos_text: 'Lograr una reeducación de los residentes que les permita desarrollar un nivel espiritual elevado y ser capaces de hacerse responsables de sus vidas, reforzando habilidades y valores morales, de manera que puedan resignificar sus vidas y reinsertarse social y laboralmente. La Biblia, la expresión de la voluntad de Dios para su vida, y los manuales de comportamiento moral orientarán su vida libre de drogas y darán paso a una reinserción a la sociedad.',
    espera_title: 'Lo que se espera',
    espera_text: 'La comunidad del Centro de Restauración El Edén, desde un esquema espiritual y cognitivo-conductual, debe restablecer habilidades y valores saludables, así como rescatar la salud física y emocional de la persona con problemas de adicciones, cambiando los patrones negativos de conducta y pensamiento a través de terapias individuales y grupales. Se espera que la Fundación El Edén instale una microsociedad que impacte a la persona con problemas de adicciones y la convierta en punto de referencia y modelo para la sociedad; que aprenda a observar de manera constante y en detalle sus actitudes y comportamientos, asumiendo una relación directa con lo espiritual y así cambiar su estilo de vida y conductas. Siendo residente y después ex usuario, debe darle una resignificación a su vida y asumir la responsabilidad de sus actos.',
  },
  instalaciones: {
    title: 'Instalaciones y Profesionales',
    desc: 'Ambientes diseñados para la recuperación, la paz y la convivencia comunitaria.',
    profesionales_title: 'Profesionales',
    profesionales_text: 'Se cuenta con la participación de profesionales de apoyo a la comunidad tales como psicólogos, psiquiatras, terapeutas ocupacionales, trabajadores sociales, personal de enfermería, profesionales de la educación y del deporte. Se otorga gran valor al aspecto cristiano como base de la intervención.',
    persona_title: 'Concepción de la persona',
    persona_text: 'Persona con necesidad de ingresar a un espacio con ambiente familiar y de hermandad; con carencias emocionales y de recursos para enfrentar la adicción, con necesidad de orientarse bajo parámetros cristianos, en el que lo grupal prima sobre lo individual, fomentando la relación Dios-creyente.',
    ubicacion_text: 'Preferencia en zonas rurales para el proceso de desintoxicación. Los espacios urbanos son empleados para los programas iniciales de reinserción.',
    principios_title: 'Principios de operación de la comunidad',
    principios_text_1: 'Es necesario comprometerse con la abstención total del consumo de sustancias psicotrópicas y del uso de violencia. El tratamiento está fundamentado en la instrucción bíblica y en la práctica de rituales cristianos, dándole una importancia central a la práctica de la oración.',
    principios_text_2: 'La modalidad residencial parte de la premisa de que no genera un ambiente de alta presión ni de control sobre las personas, procurando la autonomía en el actuar. El apoyo es proporcionado a través de tres componentes: la dinámica de grupo, la actividad espiritual y el ejercicio de un liderazgo carismático. Se promueven espacios para la expresión de aquellas dificultades socioafectivas que pueden ser factores determinantes de la adicción.',
    principios_text_3: 'Nuestras raíces filosóficas y metodológicas tienen en su base una intervención cristiana, por lo cual sus principios se fundamentan en la fe, en el estudio de la Palabra de Dios y en el cumplimiento de preceptos bíblicos; en términos generales, en el seguimiento de la teología bíblica. La Fundación El Edén emplea intervenciones tanto individuales como grupales, dando lugar al avance del tratamiento en los principios cristianos de autoayuda, apoyo comunitario y el aprendizaje de oficios.',
  },
  radio: {
    title: 'Estamos online 24/7',
    text: 'Acompañamos tu proceso de recuperación también a través de nuestra señal radial con contenido edificante.',
    status_text: 'En vivo',
    btn_text: 'Escuchar la radio en vivo',
    btn_url: 'https://eleden.ipstream.cl/',
  },
  videos: {
    title: 'Videos',
    text: 'Muy pronto encontrarás aquí material audiovisual de nuestra comunidad y de los testimonios de quienes han transformado su vida.',
    video_1_url: '',
    video_2_url: '',
    video_3_url: '',
  },
  testimonios: {
    title: 'Historias de transformación',
    quote: 'El centro tiene un director general de tratamiento, quien es un exadicto rehabilitado. Él mismo lo cuenta como parte de su testimonio de vida y se ha capacitado profesionalmente en prevención y rehabilitación de adicciones al alcohol y las drogas.',
    author_name: 'Director General',
    author_role: 'Exadicto rehabilitado',
  },
  donaciones: {
    title: 'Donaciones Mensuales',
    text: 'Elige cualquiera de los 6 montos para donar mensualmente. Este cargo se descontará cada mes de la tarjeta con la que te inscribas al momento de donar. Agradecemos tu aporte, ya que estarás apoyando la rehabilitación de cientos de personas al año.',
    amount_1: '1.000', label_1: 'Colaborador', url_1: 'https://app.payku.cl/suscripcion/index?idplan=4927&verif=fdab7cf2',
    amount_2: '3.000', label_2: 'Aporte básico', url_2: 'https://app.payku.cl/suscripcion/index?idplan=4928&verif=72deb912',
    amount_3: '5.000', label_3: 'Aporte mensual', url_3: 'https://app.payku.cl/suscripcion/index?idplan=4929&verif=1d310707',
    amount_4: '10.000', label_4: 'Aporte solidario', url_4: 'https://app.payku.cl/suscripcion/index?idplan=4930&verif=287cf30a',
    amount_5: '20.000', label_5: 'Padrino', url_5: 'https://app.payku.cl/suscripcion/index?idplan=4931&verif=42e339dc',
    amount_6: '50.000', label_6: 'Padrino mayor', url_6: 'https://app.payku.cl/suscripcion/index?idplan=4932&verif=b80733d6',
    single_title: 'Donación única',
    single_text: 'Aquí podrás hacer una donación ingresando manualmente el monto que deseas donar. Este monto es un pago único, no se descontará mensualmente.',
    single_btn_text: 'Donar',
    single_url: 'https://www.flow.cl/app/web/pagarBtnPago.php?token=wq9vlsy',
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
  contacto: {
    title: 'Contáctanos',
    text: 'Estamos disponibles para orientarte y responder tus consultas sobre nuestros programas de rehabilitación.',
    email: 'contacto@fundacioneleden.cl',
    whatsapp_masculino: '+56 9 4527 4987',
    whatsapp_femenino: '+56 9 5013 8736',
    address_label_1: 'Casa Matriz',
    address_1: 'Coironal, camino a Yerbas Buenas, calle 1 s/n',
    address_label_2: 'Sucursal Edén Nuevo Amanecer',
    address_2: 'Las Camelias s/n',
    address_label_3: 'Sucursal',
    address_3: 'Callejón Las Camelias, poste 375469, Linares',
    address_label_4: 'Sucursal Edén Femenino',
    address_4: 'Camino Panimávida, kilómetro 6 s/n, Linares',
    note: 'Consultar por sucursales Chillán y Curicó.',
    instagram_url: '',
  },
  yo_soy_socio: {
    title: 'Yo Soy Socio',
    text_1: 'Los avances y el crecimiento de nuestra fundación son gracias a personas que han terminado su proceso y hoy ayudan a otros a salir del flagelo de las drogas, y también a personas simpatizantes de esta obra que está causando un impacto en la comunidad.',
    text_2: 'Queremos invitarte a ser parte de este gran equipo. Con muy poco hemos logrado mucho. ¡Súmate y vamos por más!',
    socio_name: 'Luis Humberto Quilodrán Quilodrán',
    socio_desc: 'Él es un reeducado: alguien que terminó su proceso de rehabilitación gratuitamente en la Fundación El Edén. Es el primer socio de la fundación. 👍',
  },
  footer: {
    brand_text: 'Centro de Rehabilitación comprometido con la restauración integral de personas afectadas por el alcohol y las drogas.',
    copyright: '© 2026 Fundación El Edén. Todos los derechos reservados.',
    email: 'contacto@fundacioneleden.cl',
    phone: '+56 9 4527 4987',
    address: 'Linares, Región del Maule, Chile',
    facebook: '',
    instagram: '',
    youtube: '',
  },
}

// Insert defaults. By default keeps existing values (safe for production restarts).
// Pass --force to overwrite existing values (useful to refresh content).
const force = process.argv.includes('--force')
const insertStmt = db.prepare(`
  INSERT INTO content (section, field, value) VALUES (?, ?, ?)
  ON CONFLICT(section, field) DO UPDATE SET value = excluded.value, updated_at = datetime('now')
`)
const insertIgnoreStmt = db.prepare('INSERT OR IGNORE INTO content (section, field, value) VALUES (?, ?, ?)')
const stmt = force ? insertStmt : insertIgnoreStmt

for (const [section, fields] of Object.entries(defaults)) {
  for (const [field, value] of Object.entries(fields)) {
    stmt.run(section, field, value)
  }
}

// One-time migration: point existing radio installs to the new stream URL.
db.prepare(`
  UPDATE content SET value = ?, updated_at = datetime('now')
  WHERE section = 'radio' AND field = 'btn_url' AND value LIKE '%hover.cl%'
`).run(defaults.radio.btn_url)

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
if (!force) console.log('   (valores existentes conservados; usa --force para sobrescribir)')
console.log('\n⚠️  CAMBIA LA CONTRASEÑA POR DEFECTO EN PRODUCCIÓN')
