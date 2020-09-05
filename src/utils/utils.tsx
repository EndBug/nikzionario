import React, { useEffect, useState } from 'react'
import axios from 'axios'

export interface Entry {
  word: string
  def: string
  source: {
    id: number
    title: string
    link: string
  }
}

export interface DataFile {
  last_update: Date
  entries: Entry[]
}

export async function getCurrentData(): Promise<DataFile> {
  const res = await axios.get('https://raw.githubusercontent.com/EndBug/nikzionario/data/data.json')
  return res.data
}

export async function getRealEpisodeURL(id: number) {
  const res = await axios.get(`https://www.spreaker.com/episode/${id}`)
  return res.request?.res.responseUrl
}

export function SpreakerWidget({ episode }: { episode: Entry['source'] }) {
  const [embed, loadEmbed] = useState<JSX.Element>()

  useEffect(() => {
    if (!embed) axios.get(`https://api.spreaker.com/oembed?url=${episode.link}`)
      .then(({ data }) => {
        console.log(data.html)
        if (typeof data == 'object' && data.html) {
          loadEmbed(<div dangerouslySetInnerHTML={{ __html: data.html }} />)
        }
      })
      .catch(console.error)
  })

  return (
    <div>
      <a href={episode.link} >
        {embed}
      </a>
    </div>
  )
}

