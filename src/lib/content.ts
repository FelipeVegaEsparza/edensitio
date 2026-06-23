import { getDb } from './db'

export interface SectionData {
  [field: string]: string
}

export function getSection(section: string): SectionData {
  const db = getDb()
  const rows = db.prepare('SELECT field, value FROM content WHERE section = ?').all(section) as { field: string; value: string }[]
  const data: SectionData = {}
  for (const row of rows) {
    data[row.field] = row.value
  }
  return data
}

export function getAllContent(): Record<string, SectionData> {
  const db = getDb()
  const rows = db.prepare('SELECT section, field, value FROM content ORDER BY section, field').all() as { section: string; field: string; value: string }[]
  const result: Record<string, SectionData> = {}
  for (const row of rows) {
    if (!result[row.section]) result[row.section] = {}
    result[row.section][row.field] = row.value
  }
  return result
}

export function updateSection(section: string, fields: Record<string, string>) {
  const db = getDb()
  const stmt = db.prepare('INSERT INTO content (section, field, value) VALUES (?, ?, ?) ON CONFLICT(section, field) DO UPDATE SET value = ?, updated_at = datetime(\'now\')')
  const tx = db.transaction(() => {
    for (const [field, value] of Object.entries(fields)) {
      stmt.run(section, field, value, value)
    }
  })
  tx()
}

export function getImage(section: string, field: string): { filename: string; alt: string } | null {
  const db = getDb()
  const row = db.prepare('SELECT filename, alt FROM images WHERE section = ? AND field = ?').get(section, field) as { filename: string; alt: string } | undefined
  return row || null
}

export function getAllImages(): Record<string, Record<string, { filename: string; alt: string }>> {
  const db = getDb()
  const rows = db.prepare('SELECT section, field, filename, alt FROM images').all() as { section: string; field: string; filename: string; alt: string }[]
  const result: Record<string, Record<string, { filename: string; alt: string }>> = {}
  for (const row of rows) {
    if (!result[row.section]) result[row.section] = {}
    result[row.section][row.field] = { filename: row.filename, alt: row.alt }
  }
  return result
}

export function upsertImage(section: string, field: string, filename: string, alt = '') {
  const db = getDb()
  db.prepare('INSERT INTO images (section, field, filename, alt) VALUES (?, ?, ?, ?) ON CONFLICT(section, field) DO UPDATE SET filename = ?, alt = ?').run(section, field, filename, alt, filename, alt)
}

export function deleteImage(id: number) {
  const db = getDb()
  db.prepare('DELETE FROM images WHERE id = ?').run(id)
}

export function getSectionImages(section: string): { id: number; filename: string; alt: string; field: string }[] {
  const db = getDb()
  return db.prepare('SELECT id, filename, alt, field FROM images WHERE section = ? ORDER BY field').all(section) as { id: number; filename: string; alt: string; field: string }[]
}

export function addCarouselImage(section: string, filename: string, alt = ''): number {
  const db = getDb()
  const existing = db.prepare("SELECT field FROM images WHERE section = ? AND field LIKE 'carousel_%' ORDER BY field DESC LIMIT 1").get(section) as { field: string } | undefined
  const nextIndex = existing ? parseInt(existing.field.split('_')[1]) + 1 : 0
  const field = `carousel_${nextIndex}`
  db.prepare('INSERT INTO images (section, field, filename, alt) VALUES (?, ?, ?, ?)').run(section, field, filename, alt)
  return nextIndex
}
