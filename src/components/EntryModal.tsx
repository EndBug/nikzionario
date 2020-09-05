import React, { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import { Entry } from '../utils/utils'

interface Props {
  entry: Entry | undefined
  handleClose: () => void
}

export default function EntryModal({ entry, handleClose }: Props) {
  const [cached, cacheEntry] = useState<Entry | undefined>()

  useEffect(() => {
    if (entry) cacheEntry(entry)
  }, [entry])

  return (
    <Modal
      show={!!entry}
      onHide={handleClose}
      centered
    >
      <Modal.Header closeButton>
        {entry?.word}
      </Modal.Header>
      <Modal.Body>
        <h5>Definizione:</h5>
        {cached?.def}
        <hr />
        <h5>Episodio:</h5>
        {cached && getSpreakerWidget(cached.source)}
      </Modal.Body>
    </Modal>
  )
}

export function getSpreakerWidget(episode: Entry['source']) {
  return (
    <div>
      <a
        href={episode.link}
      >
        <iframe
          title="Player"
          src={`https://widget.spreaker.com/player?episode_id=${episode.id}`}
          width="100%"
          height="200px"></iframe>
      </a>
    </div>
  )
}
