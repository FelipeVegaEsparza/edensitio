export interface ContentField {
  key: string
  label: string
  type: 'text' | 'textarea' | 'image'
}

export interface SectionConfig {
  label: string
  icon: string
  fields: ContentField[]
}

export interface ContentRow {
  id: number
  section: string
  field: string
  value: string
  updated_at: string
}

export interface ImageRow {
  id: number
  section: string
  field: string
  filename: string
  alt: string
  created_at: string
}

export interface UserRow {
  id: number
  username: string
  password: string
}
