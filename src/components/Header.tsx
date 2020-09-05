import React, { useState } from 'react'

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import AboutModal from './AboutModal'
import { DataFile } from '../utils/utils'

interface Props {
  data: DataFile | undefined
}

export default function Header({ data }: Props) {
  const [aboutVisible, showAbout] = useState(false)

  return (
    <div>
      <header className="Header">
        <Navbar bg="dark" variant="dark" expand="lg">
          <Navbar.Brand href="/">Nikzionario™</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link onClick={() => showAbout(true)}>About</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

      </header>
      <AboutModal show={aboutVisible} handleClose={() => { showAbout(false) }} data={data} />
    </div>
  )
}
