import React, { useState } from 'react'
import matchSorter from 'match-sorter'

import Form from 'react-bootstrap/Form'
import ListGroup from 'react-bootstrap/esm/ListGroup'
import ListGroupItem from 'react-bootstrap/esm/ListGroupItem'

import { Entry } from '../utils/utils'

interface Props {
  entries: Entry[]
  displayEntry: (entry: Entry) => void
}

export default function EntrySearch({ entries, displayEntry }: Props) {
  const [value, setValue] = useState<string>()

  return (
    <div>
      <Form>
        <Form.Control
          placeholder="Cerca"
          value={value}
          onChange={e => setValue(e.currentTarget.value)}
        />
      </Form>
      <ListGroup>
        {
          matchSorter(entries, value, { keys: ['word', 'def'] })
            .map((e: Entry) => (
              <ListGroupItem action onClick={() => displayEntry(e)} key={e.word + e.source.id}>
                <b>{e.word}</b>: {e.def}
              </ListGroupItem>
            ))
        }
      </ListGroup>
    </div>
  )
}
