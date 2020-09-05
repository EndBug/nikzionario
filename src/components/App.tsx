import React, { useState, useEffect } from 'react'

import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import ListGroup from 'react-bootstrap/ListGroup'
import ListGroupItem from 'react-bootstrap/ListGroupItem'

import Header from './Header'
import EntryModal from './EntryModal'
import EpisodeModal from './EpisodeModal'
import EntrySearch from './EntrySearch'

import { DataFile, getCurrentData, Entry } from '../utils/utils'

export default function App() {
  const [data, setData] = useState<DataFile>(),
    [displayedEntry, displayEntry] = useState<Entry>(),
    [displayedEpisode, displayEpisode] = useState<number>(),
    [tab, setTab] = useState<string | null>('entries')

  useEffect(() => {
    getCurrentData().then(d => setData({
      entries: d.entries,
      last_update: new Date(d.last_update)
    }))
  }, [data])

  return (
    <div>
      <Header data={data} />
      {
        data
          ? (
            <div>

              <Tabs
                id="main tab menu"
                activeKey={tab}
                onSelect={t => {
                  if (displayedEntry) displayEntry(undefined)
                  if (displayedEpisode) displayEpisode(undefined)
                  setTab(t)
                }}
              >
                <Tab
                  eventKey="entries"
                  title={'"""Definizioni"""'}
                >
                  <ListGroup>
                    {data.entries.map(e => (
                      <ListGroupItem action onClick={() => displayEntry(e)} key={e.word + e.source.id}>
                        <b>{e.word}</b>: {e.def}
                      </ListGroupItem>
                    ))}
                  </ListGroup>
                  <EntryModal
                    entry={displayedEntry}
                    handleClose={() => { displayEntry(undefined) }}
                    episodeLink={id => {
                      displayEntry(undefined)
                      displayEpisode(id)
                    }}
                  />
                </Tab>
                <Tab
                  eventKey="episodes"
                  title="Puntate"
                >
                  <ListGroup>
                    {
                      data.entries
                        .map(e => e.source)
                        .reduce((arr, curr) => arr.find(e => e.id === curr.id) ? arr : [...arr, curr], [] as Entry['source'][])
                        .map(e => (
                          <ListGroupItem action onClick={() => displayEpisode(e.id)} key={e.id}>
                            {e.title}
                          </ListGroupItem>
                        ))
                    }
                  </ListGroup>
                  <EpisodeModal id={displayedEpisode} entries={data.entries} handleClose={() => { displayEpisode(undefined) }} />
                </Tab>
                <Tab
                  eventKey="search"
                  title="Ricerca"
                >
                  <EntrySearch entries={data.entries} displayEntry={displayEntry} />
                  <EntryModal
                    entry={displayedEntry}
                    handleClose={() => { displayEntry(undefined) }}
                    episodeLink={id => {
                      displayEntry(undefined)
                      displayEpisode(id)
                    }}
                  />
                </Tab>
              </Tabs>
            </div>
          )
          : 'Loading...'
      }
    </div>
  )
}
