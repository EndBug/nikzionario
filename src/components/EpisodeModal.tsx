import React, { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import ListGroup from 'react-bootstrap/esm/ListGroup'
import ListGroupItem from 'react-bootstrap/esm/ListGroupItem'

import { Entry, SpreakerWidget } from '../utils/utils'

interface Props {
  id: number | undefined
  entries: Entry[]
  handleClose: () => void
}

export default function EpisodeModal({ id, entries, handleClose }: Props) {
  const [cached, cacheID] = useState<number | undefined>()
  const episode = {
    source: entries.find(e => e.source.id === cached)?.source,
    entries: entries.filter(e => e.source.id === cached).map(e => ({ ...e, source: undefined }))
  }

  useEffect(() => {
    if (typeof id != 'undefined') cacheID(id)
  }, [id])

  return (
    <Modal
      show={!!id}
      onHide={handleClose}
      centered
    >
      <Modal.Header closeButton>
        {episode.source?.title}
      </Modal.Header>
      <Modal.Body>
        <h5>Episodio:</h5>
        <div>
          {episode.source && <SpreakerWidget episode={episode.source} />}
        </div>
        <hr />
        <h5>Definizioni:</h5>
        <ListGroup>
          {episode.entries.map((entry, index) => (
            <ListGroupItem key={index} style={{ color: '#495057' }}>
              <b>{entry.word}</b>: {entry.def}
            </ListGroupItem>
          ))}
        </ListGroup>
      </Modal.Body>
    </Modal>
  )
}
