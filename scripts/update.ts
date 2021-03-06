import axios from 'axios'
import dotenv from 'dotenv'
import { writeFileSync } from 'fs'
import _ from 'lodash'

import { DataFile, Entry, getCurrentData, getRealEpisodeURL } from '../src/utils/utils'

dotenv.config()

if (!process.env.SPREAKER_API_TOKEN) throw new Error('Can\' find Spreaker API token.')

const SHOW_ID = '3039391',
  LAZY = process.env.LAZY === 'false' ? false : true

let entries: Entry[]

(async () => {
  console.log(`${LAZY ? 'Running' : 'Not running'} in lazy mode.`)
  const currentData = await getCurrentData().catch(() => { })
  entries = (LAZY && (currentData || {}).entries) || []
  const episodeList = await getEpisodes()

  const infos = (await Promise.all(episodeList.map(e => getEpisodeInfo(e.episode_id))))
    .map(e => (e && {
      id: e.episode_id,
      title: e.title,
      info: e.description
    }))

  const noEntries: string[] = []
  const nikzionarioPatterns = [
    '🍕nikzionario',
    '🍕 nikzionario',
    '+nikzionario',
    '+ nikzionario'
  ]

  for (const ep of infos) {
    if (!ep) continue
    const { id, title, info } = ep

    const lines = info.split('\n')
    let start: number | undefined,
      end: number | undefined

    lines.forEach((line, index) => {
      const l = line.toLowerCase().trim()
      if (!start && (nikzionarioPatterns.some(p => l.includes(p)) || l.endsWith('nikzionario')))
        start = index
      else if (!!start && !end && (l.startsWith('con:') || l.startsWith('editato da:') || l.startsWith('con :') || l.startsWith('editato da :') || l.includes('http')))
        end = index
    })

    if (start) {
      const entryLines = lines
        .slice(start + 1, end)
        .map(l => l.trim())
        .filter(l => !!l)

      if (entryLines.length == 0)
        noEntries.push(title)
      // eslint-disable-next-line no-loop-func
      else await Promise.allSettled(entryLines.map(async e => {
        let split = e.split(/:/g)
        if (split.length <= 1) split = e.split(/-/g)

        const [word, ...def] = split,
          next = {
            word: word.trim(),
            def: def.join(':').trim(),
            source: {
              id,
              title,
              link: await getRealEpisodeURL(id)
            }
          }
        if (word && def.length && entries.every(ee => !_.isEqual(ee, next)))
          entries.push(next)
      }))
    } else noEntries.push(title)
  }

  const nextDataFile: DataFile = {
    last_update: new Date(),
    entries: entries.sort((a, b) => b.source.id - a.source.id)
  }

  if (!currentData || JSON.stringify(currentData.entries) != JSON.stringify(nextDataFile.entries)) {
    console.log(`The datafile now has ${entries.length} entries.`)
    console.warn(`${noEntries.length} episodes with no entries: ${noEntries.map(s => {
      let r = s.split(':')[0]
      if (r.startsWith('ep.')) r = r.slice(3).trim()
      return r
    }).join(', ')}`)

    writeFileSync('./data.json', JSON.stringify(nextDataFile, null, 2))
  } else {
    console.log('There are no new entries.')
  }
})()

interface SpreakerResponse<T> {
  response: T | {
    error: {
      messages: string[]
      code: number
    }
  }
}
interface Episodes {
  items: {
    episode_id: number
    type: 'DRAFT' | 'RECORDED' | 'LIVE' | 'EXTERNAL'
    title: string
    duration: number
    show_id: number
    author_id: number
    site_url: string
    image_url: string
    image_original_url: string
    published_at: string
    download_enabled: boolean
  }[]
  next_url: string
}
interface Episode {
  episode: {
    episode_id: number
    type: 'DRAFT' | 'RECORDED' | 'LIVE' | 'EXTERNAL'
    title: string
    description: string
    duration: number
    site_url: string
    image_original_url: string
    image_url: string
    published_at: string
    auto_published_at: string
    author: any // User object
    author_id: number
    show: any // Show object
    show_id: number
    download_enabled: boolean
    plays_count: number | null
    downloads_count: number | null
    plays_ondemand_count: number | null
    plays_live_count: number | null
    likes_count: number | null
    messages_count: number | null
    is_on_air: boolean
    is_non_stop: boolean
    encoding_status: string
    waveform_url: string | null
    tags: string[]
    hidden: boolean
    visibility: 'PUBLIC' | 'PRIVATE' | 'LIMITED'
    site_limited_url: string
    site_limited_key: string
    media_id: number
    media_url: string | null
    download_url: string
    playback_url: string
  }
}

async function get<T>(url: string, params?: Record<string, any>) {
  try {
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${process.env.SPREAKER_API_TOKEN}`
      },
      params
    })

    const { response } = (res.data as SpreakerResponse<T>)
    // @ts-ignore
    if (response.error) throw new Error(`Spreaker responded with code ${response.error.code}:\n${response.error.messages.join('\n')}`)

    return response as T
  } catch (e) {
    console.error(e)
  }
}

async function getEpisodes(limit = 50) {
  let items: Episodes['items'] = []

  const fetch = (url: string) => (
    get<Episodes>(url, {
      limit,
      filter: 'listenable'
    }).then(res => {
      if (!res) return
      items = [...items, ...res.items]
      if (res.next_url) return fetch(res.next_url)
    }))

  await fetch(`https://api.spreaker.com/v2/shows/${SHOW_ID}/episodes`)

  return items
}

async function getEpisodeInfo(id: number) {
  return (await get<Episode>(`https://api.spreaker.com/v2/episodes/${id}`))?.episode
}
