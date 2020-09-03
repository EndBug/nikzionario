import React from 'react'
import ReactDOM from 'react-dom'
import Header from './components/Header/Header'
import App from './components/App/App'
// import Footer from './Footer';

import 'bootstrap/dist/css/bootstrap.min.css'

ReactDOM.render(
  <React.StrictMode>
    <Header />
    <App />
    {/* <Footer /> */}
  </React.StrictMode>,
  document.getElementById('root')
)
