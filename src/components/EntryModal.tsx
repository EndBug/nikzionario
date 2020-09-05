import React, { useState, useEffect } from 'react'

import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

import { Entry, SpreakerWidget } from '../utils/utils'

interface Props {
  entry: Entry | undefined
  handleClose: () => void
  episodeLink: (id: number) => void
}

export default function EntryModal({ entry, handleClose, episodeLink }: Props) {
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
        {cached && <SpreakerWidget episode={cached.source} />}
        <Button
          variant="light"
          block
          onClick={() => entry && episodeLink(entry.source.id)}
        >
          Altre "definizioni" da questo episodio
        </Button>
      </Modal.Body>
    </Modal>
  )
}
