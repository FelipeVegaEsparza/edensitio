import type { SectionConfig } from './types'

export const sectionConfig: Record<string, SectionConfig> = {
  hero: {
    label: 'Hero',
    icon: '🏠',
    fields: [
      { key: 'badge', label: 'Badge', type: 'text' },
      { key: 'title', label: 'Título principal', type: 'text' },
      { key: 'subtitle', label: 'Subtítulo', type: 'textarea' },
      { key: 'stats_years', label: 'Años (valor numérico)', type: 'text' },
      { key: 'stats_years_label', label: 'Años (etiqueta)', type: 'text' },
      { key: 'stats_lives', label: 'Vidas (valor numérico)', type: 'text' },
      { key: 'stats_lives_label', label: 'Vidas (etiqueta)', type: 'text' },
      { key: 'stats_centers', label: 'Centros (valor numérico)', type: 'text' },
      { key: 'stats_centers_label', label: 'Centros (etiqueta)', type: 'text' },
    ],
  },
  quienes_somos: {
    label: 'Quiénes Somos',
    icon: '🌿',
    fields: [
      { key: 'title', label: 'Título', type: 'text' },
      { key: 'text_1', label: 'Texto principal', type: 'textarea' },
      { key: 'text_2', label: 'Texto secundario', type: 'textarea' },
      { key: 'director_title', label: 'Cargo del director', type: 'text' },
      { key: 'director_desc', label: 'Descripción del director', type: 'textarea' },
      { key: 'floating_number', label: 'Número flotante', type: 'text' },
      { key: 'floating_label', label: 'Etiqueta flotante', type: 'text' },
    ],
  },
  servicios: {
    label: 'Servicios',
    icon: '🤝',
    fields: [
      { key: 'title', label: 'Título', type: 'text' },
      { key: 'desc', label: 'Descripción', type: 'textarea' },
      { key: 'hombre_title', label: 'Título (hombres)', type: 'text' },
      { key: 'hombre_text', label: 'Texto (hombres)', type: 'textarea' },
      { key: 'mujer_title', label: 'Título (mujeres)', type: 'text' },
      { key: 'mujer_text', label: 'Texto (mujeres)', type: 'textarea' },
    ],
  },
  instalaciones: {
    label: 'Instalaciones',
    icon: '🏛️',
    fields: [
      { key: 'title', label: 'Título', type: 'text' },
      { key: 'desc', label: 'Descripción', type: 'textarea' },
    ],
  },
  radio: {
    label: 'Radio El Edén',
    icon: '📻',
    fields: [
      { key: 'title', label: 'Título', type: 'text' },
      { key: 'text', label: 'Texto descriptivo', type: 'textarea' },
      { key: 'status_text', label: 'Estado (ej: En vivo)', type: 'text' },
      { key: 'btn_text', label: 'Texto del botón', type: 'text' },
      { key: 'btn_url', label: 'URL del botón', type: 'text' },
    ],
  },
  testimonios: {
    label: 'Testimonios',
    icon: '💬',
    fields: [
      { key: 'title', label: 'Título', type: 'text' },
      { key: 'quote', label: 'Cita textual', type: 'textarea' },
      { key: 'author_name', label: 'Nombre del autor', type: 'text' },
      { key: 'author_role', label: 'Rol del autor', type: 'text' },
    ],
  },
  donaciones: {
    label: 'Donaciones',
    icon: '❤️',
    fields: [
      { key: 'title', label: 'Título', type: 'text' },
      { key: 'text', label: 'Texto', type: 'textarea' },
      { key: 'amount_1', label: 'Monto 1', type: 'text' },
      { key: 'label_1', label: 'Etiqueta 1', type: 'text' },
      { key: 'amount_2', label: 'Monto 2', type: 'text' },
      { key: 'label_2', label: 'Etiqueta 2', type: 'text' },
      { key: 'amount_3', label: 'Monto 3', type: 'text' },
      { key: 'label_3', label: 'Etiqueta 3', type: 'text' },
    ],
  },
  contacto: {
    label: 'Contacto',
    icon: '✉️',
    fields: [
      { key: 'title', label: 'Título', type: 'text' },
      { key: 'text', label: 'Texto', type: 'textarea' },
      { key: 'phone', label: 'Teléfono', type: 'text' },
      { key: 'email', label: 'Email', type: 'text' },
      { key: 'address', label: 'Dirección', type: 'text' },
    ],
  },
  footer: {
    label: 'Footer',
    icon: '🔻',
    fields: [
      { key: 'brand_text', label: 'Texto de marca', type: 'textarea' },
      { key: 'copyright', label: 'Copyright', type: 'text' },
    ],
  },
  admision: {
    label: 'Requisitos de Admisión',
    icon: '📋',
    fields: [
      { key: 'title', label: 'Título', type: 'text' },
      { key: 'text', label: 'Texto introductorio', type: 'textarea' },
      { key: 'req_1', label: 'Requisito 1', type: 'text' },
      { key: 'req_2', label: 'Requisito 2', type: 'text' },
      { key: 'req_3', label: 'Requisito 3', type: 'text' },
      { key: 'req_4', label: 'Requisito 4', type: 'text' },
      { key: 'req_5', label: 'Requisito 5', type: 'text' },
      { key: 'req_6', label: 'Requisito 6', type: 'text' },
      { key: 'req_7', label: 'Requisito 7', type: 'text' },
      { key: 'req_8', label: 'Requisito 8', type: 'text' },
    ],
  },
  navbar: {
    label: 'Barra de navegación',
    icon: '🧭',
    fields: [
      { key: 'logo_text', label: 'Texto del logo', type: 'text' },
      { key: 'logo_span', label: 'Texto dorado del logo', type: 'text' },
      { key: 'donate_text', label: 'Texto botón donar', type: 'text' },
    ],
  },
}

export const sectionKeys = Object.keys(sectionConfig)
