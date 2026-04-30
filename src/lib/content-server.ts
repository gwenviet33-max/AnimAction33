import 'server-only'
import { promises as fs } from 'fs'
import path from 'path'
import { unstable_cache, revalidateTag } from 'next/cache'
import { getDb } from './firebase-admin'
import { STORE_DEFAULTS, type StoreSection } from './defaults'

const COLLECTION = 'content'
const DATA_DIR = path.join(process.cwd(), '.data')

const ALL_SECTIONS = Object.keys(STORE_DEFAULTS) as StoreSection[]

function tag(section: StoreSection) {
  return `content:${section}`
}

async function fsReadContent(section: string): Promise<unknown | null> {
  try {
    const file = path.join(DATA_DIR, `content-${section}.json`)
    const raw = await fs.readFile(file, 'utf8')
    return JSON.parse(raw)
  } catch {
    return null
  }
}

async function fsWriteContent(section: string, value: unknown) {
  await fs.mkdir(DATA_DIR, { recursive: true })
  const file = path.join(DATA_DIR, `content-${section}.json`)
  await fs.writeFile(file, JSON.stringify(value, null, 2), 'utf8')
}

async function readSectionRaw<K extends StoreSection>(
  section: K
): Promise<(typeof STORE_DEFAULTS)[K]> {
  const db = getDb()
  if (db) {
    try {
      const doc = await db.collection(COLLECTION).doc(section).get()
      if (doc.exists) {
        const data = doc.data()
        if (data && 'value' in data) {
          return data.value as (typeof STORE_DEFAULTS)[K]
        }
      }
    } catch (e) {
      console.error(`Firestore read failed for content/${section}:`, e)
    }
  } else {
    const local = await fsReadContent(section)
    if (local !== null) return local as (typeof STORE_DEFAULTS)[K]
  }
  return STORE_DEFAULTS[section]
}

const cachedReaders: Partial<
  Record<StoreSection, () => Promise<(typeof STORE_DEFAULTS)[StoreSection]>>
> = {}

function cachedReaderFor<K extends StoreSection>(section: K) {
  if (!cachedReaders[section]) {
    cachedReaders[section] = unstable_cache(
      async () => readSectionRaw(section),
      [`content-${section}`],
      { tags: [tag(section)], revalidate: 60 }
    ) as () => Promise<(typeof STORE_DEFAULTS)[StoreSection]>
  }
  return cachedReaders[section] as () => Promise<(typeof STORE_DEFAULTS)[K]>
}

export async function getContent<K extends StoreSection>(
  section: K
): Promise<(typeof STORE_DEFAULTS)[K]> {
  return cachedReaderFor(section)()
}

export async function getAllContent(): Promise<{
  [K in StoreSection]: (typeof STORE_DEFAULTS)[K]
}> {
  const entries = await Promise.all(
    ALL_SECTIONS.map(async (s) => [s, await getContent(s)] as const)
  )
  return Object.fromEntries(entries) as {
    [K in StoreSection]: (typeof STORE_DEFAULTS)[K]
  }
}

export async function setContent<K extends StoreSection>(
  section: K,
  value: (typeof STORE_DEFAULTS)[K]
) {
  const db = getDb()
  if (db) {
    await db
      .collection(COLLECTION)
      .doc(section)
      .set({ value, updatedAt: new Date().toISOString() }, { merge: false })
  } else {
    await fsWriteContent(section, value)
  }
  // Bust both the per-section server cache and any path that aggregates many sections
  try {
    revalidateTag(tag(section))
  } catch {
    // revalidateTag throws outside request scope (e.g. during tests) — safe to ignore
  }
}

export function isValidSection(s: string): s is StoreSection {
  return (ALL_SECTIONS as string[]).includes(s)
}
