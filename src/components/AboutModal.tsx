import React from 'react'
import Modal from 'react-bootstrap/Modal'

interface Props {
  show: boolean
  handleClose: () => void
}

export default function AboutModal({ show, handleClose }: Props) {
  return (
    <Modal show={show} onHide={handleClose} size="xl">
      <Modal.Header closeButton>About</Modal.Header>
      <Modal.Body style={{ textJustify: 'auto' }}>
        <p><i>L'unico sito dove potete sensibilmente arricchire il vostro vocabolario sfruttando le perle lessicali di <a href="https://www.spreaker.com/show/power-pizza">Power Pizza</a>.</i></p>
        <h5>Come funziona:</h5>
        <p>Il sito si aggiorna automaticamente leggendo le descrizioni delle puntate del podcast e trovando le definizioni. Questo processo è quindi automatico e lontano dall'essere perfetto: se dovessero mancare delle definizioni, contattate l'autore del sito.</p>
        <h5>Formati riconosciuti:</h5>
        <p>Al fine di rendere più facile l'aggiornamento del sito, sarebbe meglio che il formato del nikzionario all'interno delle note degli episodi rimanesse costante. Lo script che aggiorna le definizioni ragiona così:</p>
        <ul>
          <li>
            {/* eslint-disable-next-line jsx-a11y/accessible-emoji */}
            <p>Il Nikzionario è preceduto da una linea che comprende <code>+nikzionario</code> o <code>🍕nikzionario</code> (caps insentive, validi anche con uno spazio tra simbolo e parola), oppure che finisce con <code>nikzionario</code>. Se non viene trovata una linea con queste caratteristiche, la puntata non ha un Nikzionario.</p>
          </li>
          <li>
            <p>Il Nikzionario finisce quando ci sono le indicazioni degli ospiti e dell'editor, ovvero una linea che inizia con <code>con:</code> oppure <code>editato da:</code>. Se non viene trovata una linea con queste caratteristiche, finisce con la fine delle note dell'episodio.</p>
          </li>
          <li>
            <p>Ogni "entry" ha una parola e una definizione, separate da un <code>:</code> o, se non ce n'è nessuno, da un <code>-</code>. Se non c'è nessuno dei due simboli, la linea non ha nessuna "entry"</p>
          </li>
        </ul>
        <h5>Problemi?</h5>
        <p>Il sito è un progetto open source disponibile su GitHub, quindi chi è in grado può contribuire direttamente lì. In caso di problemi potete contattare l'autore del sito tramite le "Issues" di GitHub, oppure tramite il suo profilo.</p>
        <p>Link:</p>
        <ul>
          <li><a href="https://github.com/EndBug/nikzionario">Progetto del sito</a></li>
          <li><a href="https://github.com/EndBug">Profilo dell'autore</a></li>
        </ul>

      </Modal.Body>
    </Modal >
  )
}
