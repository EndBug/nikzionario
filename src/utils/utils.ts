import axios from 'axios'

export interface Entry {
  word: string
  def: string
  source: {
    id: number
    title: string
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
