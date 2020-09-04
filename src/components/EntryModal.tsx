import React from 'react'
import Modal from 'react-bootstrap/Modal'
import { Entry } from '../utils/utils'

interface Props {
  entry: Entry | undefined
  handleClose: () => void
}

export default function EntryModal({ entry, handleClose }: Props) {
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
        {entry?.def}
        <h5>Episodio:</h5>
        <a href={entry?.source.link || ''}>{entry?.source.title}</a>
      </Modal.Body>
    </Modal>
  )
}
